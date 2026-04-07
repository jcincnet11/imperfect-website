import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAvailability, getAvailabilityForPlayers, upsertAvailability, getAllPlayers, getPlayerByDiscordId, type Availability } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { randomUUID } from "crypto";
import { notifyAvailabilityComplete } from "@/lib/discord-notify";

export async function GET(request: NextRequest) {
  if (!checkRateLimit(request)) return Response.json({ error: "Too many requests" }, { status: 429 });

  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const weekStart = searchParams.get("week_start") ?? currentWeekStart();

  const role = (session.user as Record<string, unknown>).role as string;
  const discordId = (session.user as Record<string, unknown>).discordId as string;

  if (role !== "player") {
    // Coaches and admins see all
    const [availability, players] = await Promise.all([
      getAvailability(weekStart),
      getAllPlayers(),
    ]);
    return Response.json({ availability, players });
  }

  // Players: scope to their own team
  const [allPlayers, currentPlayer] = await Promise.all([
    getAllPlayers(),
    getPlayerByDiscordId(discordId),
  ]);
  const myDivision = currentPlayer?.division;
  const teamPlayers = myDivision
    ? allPlayers.filter((p) => p.division === myDivision)
    : [];
  const teamDiscordIds = teamPlayers.map((p) => p.discord_id);
  const availability = await getAvailabilityForPlayers(weekStart, teamDiscordIds);

  return Response.json({ availability, players: teamPlayers });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const discordId = (session.user as Record<string, unknown>).discordId as string;
  const role = (session.user as Record<string, unknown>).role as string;

  const body = await request.json() as Partial<Availability>;

  // Players can only update their own availability
  if (role === "player" && body.player_discord_id !== discordId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const row: Availability = {
    id: body.id ?? randomUUID(),
    week_start: body.week_start!,
    player_discord_id: body.player_discord_id ?? discordId,
    day: body.day!,
    status: body.status!,
  };

  const saved = await upsertAvailability(row);

  // Check if all teammates have submitted — notify Discord if complete
  checkTeamCompletion(row.week_start, discordId).catch(() => {});

  return Response.json(saved);
}

async function checkTeamCompletion(weekStart: string, triggerDiscordId: string) {
  const player = await getPlayerByDiscordId(triggerDiscordId);
  if (!player?.division) return;

  const allPlayers = await getAllPlayers();
  const teamPlayers = allPlayers.filter((p) => p.division === player.division && !p.archived);
  if (teamPlayers.length === 0) return;

  const teamDiscordIds = teamPlayers.map((p) => p.discord_id);
  const availability = await getAvailabilityForPlayers(weekStart, teamDiscordIds);

  // Each player needs at least 1 entry for the week (they've interacted)
  const playersWithEntries = new Set(availability.map((a) => a.player_discord_id));
  const allSubmitted = teamDiscordIds.every((id) => playersWithEntries.has(id));

  if (!allSubmitted) return;

  // Count statuses
  const summary = { available: 0, unavailable: 0, unsure: 0 };
  for (const a of availability) {
    if (a.status === "AVAILABLE") summary.available++;
    else if (a.status === "UNAVAILABLE") summary.unavailable++;
    else summary.unsure++;
  }

  // Format week label
  const d = new Date(weekStart + "T12:00:00");
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  const weekLabel = `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  await notifyAvailabilityComplete(player.division, weekLabel, teamPlayers, summary);
}

function currentWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}
