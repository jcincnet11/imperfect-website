import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateAnnouncement, deleteAnnouncement, appendAuditLog } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  if (!can.postAnnouncements(role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { id } = await params;
  const patch = await req.json();
  await updateAnnouncement(id, patch);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  if (!can.postAnnouncements(role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { id } = await params;
  await deleteAnnouncement(id);

  await appendAuditLog({
    actor_discord_id: session.user.discordId!,
    action_type: "ANNOUNCEMENT_DELETE",
    entity_type: "announcement",
    entity_id: id,
    before_val: null,
    after_val: null,
  });

  return new NextResponse(null, { status: 204 });
}
