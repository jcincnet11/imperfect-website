import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { updateCommunityTeam, getCommunityTeamPlayers, appendAuditLog, type CommunityTeam } from "@/lib/db";
import { resolveOrgRole, hasRole } from "@/lib/permissions";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";

/**
 * GET /api/community-teams/[id]
 * Manager+ — returns team players.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as Record<string, unknown>;
    const orgRole = resolveOrgRole({ discordId: user.discordId as string, orgRole: user.orgRole as string });
    if (!hasRole(orgRole, "MANAGER")) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const players = await getCommunityTeamPlayers(id);
    return Response.json({ players });
  } catch (e) {
    console.error("GET /api/community-teams/[id]", e);
    return apiError("Internal server error", 500);
  }
}

/**
 * PATCH /api/community-teams/[id]
 * ORG_ADMIN+ — update status, add notes.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as Record<string, unknown>;
    const discordId = user.discordId as string;
    const orgRole = resolveOrgRole({ discordId, orgRole: user.orgRole as string });

    if (!hasRole(orgRole, "ORG_ADMIN")) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    const patch: Record<string, unknown> = {};
    if (body.status) patch.status = body.status;
    if (body.notes !== undefined) patch.notes = body.notes;
    if (body.status === "approved" || body.status === "declined") {
      patch.reviewed_by = discordId;
      patch.reviewed_at = new Date().toISOString();
    }

    const updated = await updateCommunityTeam(id, patch);

    await appendAuditLog({
      actor_discord_id: discordId,
      action_type: "COMMUNITY_TEAM_UPDATE",
      entity_type: "community_team",
      entity_id: id,
      before_val: null,
      after_val: patch as Record<string, unknown>,
    });

    // Send welcome notification when approved
    if (body.status === "approved") {
      sendApprovalNotification(updated).catch((e) => console.error("Discord notify (community team approved):", e));
    }

    return Response.json({ team: updated });
  } catch (e) {
    console.error("PATCH /api/community-teams/[id]", e);
    return apiError("Internal server error", 500);
  }
}

async function sendApprovalNotification(team: CommunityTeam) {
  const channelId = process.env.DISCORD_CHANNEL_COMMUNITY;
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!channelId || !token) return;

  const players = await getCommunityTeamPlayers(team.id);
  const captain = players.find((p) => p.is_captain);
  const gameLabel = (team.games as string[]).map((g) => g === "ow2" ? "OW2" : g === "marvel_rivals" ? "Marvel Rivals" : g).join(", ");

  await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "✅ Community Team Approved",
        description: `**${team.team_name}**${team.team_tag ? ` [${team.team_tag}]` : ""} has been approved! Welcome to the IMPerfect community.`,
        color: 0xc8e400,
        fields: [
          { name: "Game(s)", value: gameLabel, inline: true },
          { name: "Region", value: team.region, inline: true },
          { name: "Players", value: `${players.length} total`, inline: true },
          ...(captain ? [{ name: "Captain", value: `${captain.ign} — ${captain.discord_handle}`, inline: false }] : []),
        ],
        footer: { text: "IMPerfect Team Hub · Community" },
      }],
    }),
  });
}
