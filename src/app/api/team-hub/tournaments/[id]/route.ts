import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { updateTournament } from "@/lib/management-db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { apiError } from "@/lib/api-error";
import { appendAuditLog } from "@/lib/db";

/**
 * PATCH /api/team-hub/tournaments/[id]
 * HEAD_COACH+ only — update prep notes on a tournament.
 * Intentionally scoped to `notes` only; wider edits go through the
 * management tournaments endpoint.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const orgRole = resolveOrgRole(session.user);
    if (!can.addVodNotes(orgRole)) return apiError("Forbidden", 403);

    if (!verifyCsrfOrigin(request)) return apiError("Invalid origin", 403);

    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;
    const notes = typeof body.notes === "string" ? body.notes.slice(0, 5000) : null;

    const updated = await updateTournament(id, { notes: notes ?? undefined });
    if (!updated) return apiError("Tournament not found", 404);

    await appendAuditLog({
      actor_discord_id: (session.user as { discordId?: string }).discordId ?? "",
      action_type: "TOURNAMENT_NOTES_UPDATE",
      entity_type: "tournament",
      entity_id: id,
      before_val: null,
      after_val: { notes } as Record<string, unknown>,
    });

    return Response.json(updated);
  } catch (e) {
    console.error("PATCH /api/team-hub/tournaments/[id]", e);
    return apiError("Internal server error", 500);
  }
}
