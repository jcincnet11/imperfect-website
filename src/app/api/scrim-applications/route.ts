import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getScrimApplications,
  createScrimApplication,
  checkDuplicateApplication,
  getAllPlayers,
  getAvailability,
} from "@/lib/db";
import { resolveOrgRole } from "@/lib/permissions";
import { can } from "@/lib/permissions";

/**
 * GET /api/scrim-applications?status=pending
 * Manager+ only — returns all applications, optionally filtered by status.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const orgRole = resolveOrgRole({ discordId: user.discordId as string, orgRole: user.orgRole as string });
  if (!can.manageScrim(orgRole)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status") ?? undefined;
  const applications = await getScrimApplications(status);
  return Response.json({ applications });
}

/**
 * POST /api/scrim-applications
 * Public — no auth required. Creates a new scrim application.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validate required fields
  const required = ["team_name", "captain_name", "captain_discord", "region", "game", "format", "rank_range", "preferred_days", "preferred_blocks", "earliest_date"];
  for (const field of required) {
    if (!body[field] || (typeof body[field] === "string" && !body[field].trim())) {
      return Response.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  if (!["ow2", "marvel_rivals", "both"].includes(body.game)) {
    return Response.json({ error: "Invalid game selection" }, { status: 400 });
  }

  if (!body.discord_confirmed) {
    return Response.json({ error: "Discord confirmation required" }, { status: 400 });
  }

  // Earliest date must be at least 3 days from now
  const earliest = new Date(body.earliest_date);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  minDate.setHours(0, 0, 0, 0);
  if (earliest < minDate) {
    return Response.json({ error: "Earliest date must be at least 3 days from today" }, { status: 400 });
  }

  // Duplicate guard: same captain + game within 7 days
  const isDuplicate = await checkDuplicateApplication(body.captain_discord.trim(), body.game);
  if (isDuplicate) {
    return Response.json({
      error: "You already have a pending application. Our Manager will be in touch soon.",
      duplicate: true,
    }, { status: 409 });
  }

  const app = await createScrimApplication({
    team_name: body.team_name.trim(),
    discord_invite: body.discord_invite?.trim() || null,
    captain_name: body.captain_name.trim(),
    captain_discord: body.captain_discord.trim(),
    region: body.region.trim(),
    game: body.game,
    format: body.format.trim(),
    rank_range: body.rank_range.trim(),
    preferred_days: body.preferred_days,
    preferred_blocks: body.preferred_blocks,
    earliest_date: body.earliest_date,
    message: body.message?.trim() || null,
    discord_confirmed: true,
  });

  // Fire Discord notification (non-blocking)
  sendDiscordNotification(app).catch(() => {});

  return Response.json({ application: app }, { status: 201 });
}

async function sendDiscordNotification(app: {
  team_name: string;
  game: string;
  format: string;
  captain_discord: string;
  region: string;
  rank_range: string;
  preferred_days: string[];
  preferred_blocks: string[];
  earliest_date: string;
  message: string | null;
}) {
  const channelId = process.env.DISCORD_CHANNEL_SCRIMS;
  const token = process.env.DISCORD_BOT_TOKEN;

  const gameLabel = app.game === "ow2" ? "Overwatch 2" : app.game === "marvel_rivals" ? "Marvel Rivals" : "Both";
  const days = (app.preferred_days as string[]).join(", ");
  const blocks = (app.preferred_blocks as string[]).map((b) => b.charAt(0).toUpperCase() + b.slice(1)).join(", ");

  // Check our teams' availability for the requested days
  const DAY_MAP: Record<string, string> = {
    mon: "MON", tue: "TUE", wed: "WED", thu: "THU", fri: "FRI", sat: "SAT", sun: "SUN",
  };
  let teamAvailField = "";
  try {
    const allPlayers = await getAllPlayers();
    // Get current week's availability
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + mondayOffset);
    const weekStartStr = weekStart.toISOString().slice(0, 10);
    const availability = await getAvailability(weekStartStr);

    const requestedDays = app.preferred_days.map((d) => DAY_MAP[d]).filter(Boolean);
    const divisions = ["IMPerfect", "Shadows"];

    const lines: string[] = [];
    for (const div of divisions) {
      const teamPlayers = allPlayers.filter((p) => p.division === div && !p.archived);
      if (teamPlayers.length === 0) continue;
      const teamIds = new Set(teamPlayers.map((p) => p.discord_id));
      const teamAvail = availability.filter((a) => teamIds.has(a.player_discord_id));

      const dayResults = requestedDays.map((day) => {
        const dayEntries = teamAvail.filter((a) => a.day === day && a.status === "AVAILABLE");
        return `${day.charAt(0) + day.slice(1).toLowerCase()}: ${dayEntries.length}/${teamPlayers.length}`;
      });
      lines.push(`**${div}** — ${dayResults.join(", ")}`);
    }
    if (lines.length > 0) teamAvailField = lines.join("\n");
  } catch {
    // Non-critical — skip if availability check fails
  }

  const fields = [
    { name: "Team", value: app.team_name, inline: true },
    { name: "Game", value: gameLabel, inline: true },
    { name: "Format", value: app.format, inline: true },
    { name: "Captain", value: app.captain_discord, inline: true },
    { name: "Region", value: app.region, inline: true },
    { name: "Rank Range", value: app.rank_range, inline: true },
    { name: "They're Available", value: `${days} — ${blocks}`, inline: false },
    { name: "Earliest Date", value: app.earliest_date, inline: true },
    ...(teamAvailField ? [{ name: "Our Team Availability (this week)", value: teamAvailField, inline: false }] : []),
    ...(app.message ? [{ name: "Message", value: app.message, inline: false }] : []),
  ];

  const embed = {
    title: "🎮 New Scrim Application",
    color: 0xc8e400,
    fields,
    footer: { text: "Review in Team Hub → /team-hub/scrims" },
  };

  // Send via bot to dedicated channel
  if (channelId && token) {
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
    return;
  }

  // Fallback to webhook if bot not configured
  const url = process.env.DISCORD_SCRIM_WEBHOOK_URL;
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });
}
