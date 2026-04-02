import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getInvites, createInvite, appendAuditLog } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import type { OrgRole } from "@/lib/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  if (!can.manageInvites(role)) {
    return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  }

  const invites = await getInvites();
  return NextResponse.json(invites);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  if (!can.manageInvites(role)) {
    return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  }

  const { org_role } = await req.json() as { org_role: OrgRole };

  if (org_role === "OWNER") {
    return NextResponse.json({ error: "Cannot create invite for OWNER role" }, { status: 400 });
  }

  const invite = await createInvite(org_role, session.user.discordId!);

  await appendAuditLog({
    actor_discord_id: session.user.discordId!,
    action_type: "INVITE_CREATE",
    entity_type: "invite",
    entity_id: invite.id,
    before_val: null,
    after_val: { org_role, token: invite.token },
  });

  return NextResponse.json(invite, { status: 201 });
}
