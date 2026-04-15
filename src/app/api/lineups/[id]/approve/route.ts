import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  approveLineup,
  getScrims,
  appendAuditLog,
} from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { apiError } from "@/lib/api-error";

/**
 * POST /api/lineups/[id]/approve
 * ORG_ADMIN+ only — approve a submitted lineup.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const orgRole = resolveOrgRole(session.user);
    if (!can.approveLineups(orgRole)) return apiError("Forbidden", 403);

    if (!verifyCsrfOrigin(request)) return apiError("Invalid origin", 403);

    const { id } = await params;
    const approverId = (session.user as { discordId?: string }).discordId ?? "";

    const lineup = await approveLineup(id, approverId);

    await appendAuditLog({
      actor_discord_id: approverId,
      action_type: "LINEUP_APPROVE",
      entity_type: "lineup",
      entity_id: id,
      before_val: null,
      after_val: { scrim_id: lineup.scrim_id } as Record<string, unknown>,
    });

    // Fire-and-forget Discord notification
    const scrims = await getScrims();
    const scrim = scrims.find((s) => s.id === lineup.scrim_id);
    if (scrim) {
      const { notifyLineupApproved } = await import("@/lib/discord-notify");
      const approverName = (session.user as { name?: string }).name ?? approverId;
      notifyLineupApproved(lineup, scrim, approverName)
        .catch((err) => console.error("Discord notify (lineup approved):", err));
    }

    return Response.json({ lineup });
  } catch (e) {
    console.error("POST /api/lineups/[id]/approve", e);
    return apiError("Internal server error", 500);
  }
}
