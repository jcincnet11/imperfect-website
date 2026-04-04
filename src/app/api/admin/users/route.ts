import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllPlayers, updatePlayerRole, appendAuditLog } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import type { OrgRole } from "@/lib/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  if (!can.manageRoles(role)) {
    return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  }

  const players = await getAllPlayers(true); // include archived
  return NextResponse.json(players);
}

/** PATCH /api/admin/users — update a player's org_role */
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  if (!can.manageRoles(role)) {
    return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  }

  const { discord_id, org_role, captain_of } = await req.json() as {
    discord_id: string;
    org_role: OrgRole;
    captain_of?: string | null;
  };

  // Prevent escalating to OWNER via UI
  if (org_role === "OWNER") {
    return NextResponse.json({ error: "OWNER role cannot be assigned via UI" }, { status: 400 });
  }
  // Prevent demoting the owner's own DB record (owner isn't in DB normally, but guard anyway)
  if (discord_id === process.env.OWNER_DISCORD_ID) {
    return NextResponse.json({ error: "Cannot modify the owner's role" }, { status: 400 });
  }

  const players = await getAllPlayers(true);
  const before = players.find((p) => p.discord_id === discord_id);

  await updatePlayerRole(discord_id, org_role, captain_of);

  await appendAuditLog({
    actor_discord_id: session.user.discordId!,
    action_type: "ROLE_CHANGE",
    entity_type: "player",
    entity_id: discord_id,
    before_val: { org_role: before?.org_role, captain_of: before?.captain_of },
    after_val: { org_role, captain_of: captain_of ?? null },
  });

  return NextResponse.json({ ok: true });
}
