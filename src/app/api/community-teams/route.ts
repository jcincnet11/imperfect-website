import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getCommunityTeams,
  createCommunityTeam,
  checkDuplicateCommunityTeam,
} from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";

/**
 * GET /api/community-teams?status=pending
 * Manager+ only.
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
  const teams = await getCommunityTeams(status);
  return Response.json({ teams });
}

/**
 * POST /api/community-teams
 * Public — no auth required.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validate team fields
  if (!body.team_name?.trim() || body.team_name.trim().length < 2 || body.team_name.trim().length > 50) {
    return Response.json({ error: "Team name must be 2–50 characters" }, { status: 400 });
  }
  if (body.team_tag && (body.team_tag.length < 2 || body.team_tag.length > 6 || !/^[A-Za-z0-9]+$/.test(body.team_tag))) {
    return Response.json({ error: "Team tag must be 2–6 alphanumeric characters" }, { status: 400 });
  }
  if (!Array.isArray(body.games) || body.games.length === 0) {
    return Response.json({ error: "Select at least one game" }, { status: 400 });
  }
  if (!Array.isArray(body.platforms) || body.platforms.length === 0) {
    return Response.json({ error: "Select at least one platform" }, { status: 400 });
  }
  if (!body.region?.trim() || body.region.trim().length < 2) {
    return Response.json({ error: "Region is required" }, { status: 400 });
  }
  if (!Array.isArray(body.goals) || body.goals.length === 0) {
    return Response.json({ error: "Select at least one goal" }, { status: 400 });
  }
  if (!body.discord_confirmed) {
    return Response.json({ error: "Discord confirmation required" }, { status: 400 });
  }

  // Validate players
  const players = body.players as Array<{
    is_captain: boolean; ign: string; discord_handle: string;
    role: string; rank: string; platform: string;
  }>;
  if (!Array.isArray(players) || players.length === 0) {
    return Response.json({ error: "At least the captain is required" }, { status: 400 });
  }
  const captain = players.find((p) => p.is_captain);
  if (!captain) {
    return Response.json({ error: "Captain info is required" }, { status: 400 });
  }
  if (!captain.ign?.trim() || captain.ign.trim().length < 2) {
    return Response.json({ error: "Captain IGN is required (2+ chars)" }, { status: 400 });
  }
  if (!captain.discord_handle?.trim()) {
    return Response.json({ error: "Captain Discord handle is required" }, { status: 400 });
  }
  if (!captain.role) {
    return Response.json({ error: "Captain role is required" }, { status: 400 });
  }
  if (!captain.rank?.trim() || captain.rank.trim().length < 2) {
    return Response.json({ error: "Captain rank is required" }, { status: 400 });
  }
  if (!captain.platform) {
    return Response.json({ error: "Captain platform is required" }, { status: 400 });
  }

  // Check for duplicate Discord handles within submission
  const handles = players.map((p) => p.discord_handle?.trim().toLowerCase()).filter(Boolean);
  if (new Set(handles).size !== handles.length) {
    return Response.json({ error: "Each player must have a unique Discord handle" }, { status: 400 });
  }

  // Validate non-captain players (if row exists, must be complete)
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    if (p.is_captain) continue;
    if (!p.ign?.trim() || !p.discord_handle?.trim()) {
      return Response.json({ error: `Player ${i + 1}: IGN and Discord handle are required` }, { status: 400 });
    }
  }

  // Duplicate guard: same captain + overlapping games within 30 days
  const isDuplicate = await checkDuplicateCommunityTeam(captain.discord_handle.trim(), body.games);
  if (isDuplicate) {
    return Response.json({
      error: `Looks like ${captain.discord_handle} already registered a team for this game recently. If you need to make changes, reach out on Discord.`,
      duplicate: true,
    }, { status: 409 });
  }

  const team = await createCommunityTeam(
    {
      team_name: body.team_name.trim(),
      team_tag: body.team_tag?.trim().toUpperCase() || null,
      games: body.games,
      platforms: body.platforms,
      region: body.region.trim(),
      discord_server: body.discord_server?.trim() || null,
      referral_source: body.referral_source || null,
      goals: body.goals,
      about: body.about?.trim() || null,
    },
    players.map((p) => ({
      is_captain: p.is_captain,
      ign: p.ign.trim(),
      discord_handle: p.discord_handle.trim(),
      role: p.role,
      rank: p.rank.trim(),
      platform: p.platform,
    })),
  );

  // Discord webhook (non-blocking)
  sendWebhook(team, players).catch(() => {});

  return Response.json({ team }, { status: 201 });
}

async function sendWebhook(
  team: { team_name: string; team_tag: string | null; games: string[]; platforms: string[]; region: string; discord_server: string | null; goals: string[] },
  players: Array<{ is_captain: boolean; ign: string; discord_handle: string; rank: string }>,
) {
  const url = process.env.DISCORD_COMMUNITY_WEBHOOK_URL || process.env.DISCORD_SCRIM_WEBHOOK_URL;
  if (!url) return;

  const captain = players.find((p) => p.is_captain);
  const gameLabel = team.games.map((g) => g === "ow2" ? "OW2" : g === "marvel_rivals" ? "Marvel Rivals" : g).join(", ");
  const goalLabel = team.goals.map((g) => g.charAt(0).toUpperCase() + g.slice(1)).join(", ");

  const embed = {
    title: "New Community Team Registration",
    color: 0xc8e400,
    fields: [
      { name: "Team", value: team.team_tag ? `${team.team_name} [${team.team_tag}]` : team.team_name, inline: true },
      { name: "Game(s)", value: gameLabel, inline: true },
      { name: "Platform(s)", value: team.platforms.join(", "), inline: true },
      { name: "Region", value: team.region, inline: true },
      { name: "Captain", value: captain ? `${captain.ign} — ${captain.discord_handle} — ${captain.rank}` : "N/A", inline: false },
      { name: "Players", value: `${players.length} total`, inline: true },
      { name: "Looking for", value: goalLabel, inline: true },
      { name: "Discord Server", value: team.discord_server || "Not provided", inline: true },
    ],
    footer: { text: "Review in Team Hub → /team-hub/community" },
  };

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });
}
