import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAvailability, upsertAvailability, getAllPlayers, type Availability } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const weekStart = searchParams.get("week_start") ?? currentWeekStart();

  const role = (session.user as Record<string, unknown>).role as string;
  const discordId = (session.user as Record<string, unknown>).discordId as string;

  // Coaches and admins see all; players see only their own
  const filterById = role === "player" ? discordId : undefined;
  const [availability, players] = await Promise.all([
    getAvailability(weekStart, filterById),
    role !== "player" ? getAllPlayers() : Promise.resolve([]),
  ]);

  return Response.json({ availability, players });
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
  return Response.json(saved);
}

function currentWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}
