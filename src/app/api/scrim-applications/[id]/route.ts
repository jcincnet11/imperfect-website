import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { updateScrimApplication } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { appendAuditLog } from "@/lib/db";

/**
 * PATCH /api/scrim-applications/[id]
 * Manager+ only — update application status, link to scrim, etc.
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

  if (!can.manageScrim(orgRole)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const patch: Record<string, unknown> = {};
  if (body.status) patch.status = body.status;
  if (body.linked_scrim_id) patch.linked_scrim_id = body.linked_scrim_id;
  if (body.status === "accepted" || body.status === "declined" || body.status === "scheduled") {
    patch.reviewed_by = discordId;
    patch.reviewed_at = new Date().toISOString();
  }

  const updated = await updateScrimApplication(id, patch);

  await appendAuditLog({
    actor_discord_id: discordId,
    action_type: "SCRIM_APP_UPDATE",
    entity_type: "scrim_application",
    entity_id: id,
    before_val: null,
    after_val: patch as Record<string, unknown>,
  });

  return Response.json({ application: updated });
}
