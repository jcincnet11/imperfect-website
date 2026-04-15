import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteInvite, appendAuditLog } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { logRequest } from "@/lib/logger";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const start = Date.now();
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = resolveOrgRole(session.user);
    if (!can.manageInvites(role)) {
      return NextResponse.json({ error: "Owner access required" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(req)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });

    const { id } = await params;
    await deleteInvite(id);

    await appendAuditLog({
      actor_discord_id: session.user.discordId!,
      action_type: "INVITE_DELETE",
      entity_type: "invite",
      entity_id: id,
      before_val: null,
      after_val: null,
    });

    const res = new NextResponse(null, { status: 204 });
    logRequest(req, res, start, { userId: session.user.discordId ?? "" });
    return res;
  } catch (e) {
    console.error("DELETE /api/admin/invites/[id]", e);
    return apiError("Internal server error", 500);
  }
}
