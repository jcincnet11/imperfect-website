import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { archivePlayer as archivePlayerDb, appendAuditLog, getAllPlayers } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";

/** DELETE /api/admin/users/[discord_id] — archive a member */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ discord_id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  if (!can.deletePlayer(role)) {
    return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  }

  const { discord_id } = await params;

  if (discord_id === process.env.OWNER_DISCORD_ID) {
    return NextResponse.json({ error: "Cannot remove the owner" }, { status: 400 });
  }

  const players = await getAllPlayers(true);
  const before = players.find((p) => p.discord_id === discord_id);

  await archivePlayerDb(discord_id);

  await appendAuditLog({
    actor_discord_id: session.user.discordId!,
    action_type: "PLAYER_ARCHIVE",
    entity_type: "player",
    entity_id: discord_id,
    before_val: before as unknown as Record<string, unknown>,
    after_val: { archived: true },
  });

  return new NextResponse(null, { status: 204 });
}
