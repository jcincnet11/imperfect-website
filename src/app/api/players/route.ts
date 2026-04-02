import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAllPlayers, upsertPlayer, appendAuditLog, type Player } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/rate-limit";
import { logRequest } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const start = Date.now();
  if (!checkRateLimit(request)) return Response.json({ error: "Too many requests" }, { status: 429 });

  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  if (!can.viewAllRosters(role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const players = await getAllPlayers();
  const res = Response.json(players, {
    headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" },
  });
  logRequest(request, res, start, { userId: session.user.discordId ?? "" });
  return res;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  if (!can.editPlayerProfiles(role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json() as Player;
  await upsertPlayer(body);

  await appendAuditLog({
    actor_discord_id: session.user.discordId!,
    action_type: "PLAYER_UPSERT",
    entity_type: "player",
    entity_id: body.discord_id,
    before_val: null,
    after_val: body as unknown as Record<string, unknown>,
  });

  return Response.json({ ok: true });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const role = resolveOrgRole(session.user);
  const body = await request.json() as Partial<Player> & { discord_id: string };

  // Players can only edit their own profile (non-role fields)
  const isSelf = session.user.discordId === body.discord_id;
  if (!isSelf && !can.editPlayerProfiles(role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Prevent self-escalation of roles
  if (body.org_role && !can.editPlayerProfiles(role)) {
    delete body.org_role;
  }

  await upsertPlayer(body);
  return Response.json({ ok: true });
}
