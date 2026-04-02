import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteInvite, appendAuditLog } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  if (!can.manageInvites(role)) {
    return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  }

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

  return new NextResponse(null, { status: 204 });
}
