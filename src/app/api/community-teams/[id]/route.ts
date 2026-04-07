import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { updateCommunityTeam, getCommunityTeamPlayers, appendAuditLog } from "@/lib/db";
import { resolveOrgRole, hasRole } from "@/lib/permissions";

/**
 * GET /api/community-teams/[id]
 * Manager+ — returns team players.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
}

/**
 * PATCH /api/community-teams/[id]
 * ORG_ADMIN+ — update status, add notes.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const discordId = user.discordId as string;
  const orgRole = resolveOrgRole({ discordId, orgRole: user.orgRole as string });

  if (!hasRole(orgRole, "ORG_ADMIN")) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

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

  return Response.json({ team: updated });
}
