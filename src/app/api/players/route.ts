import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAllPlayers, upsertPlayer, appendAuditLog, type Player } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/rate-limit";
import { logRequest } from "@/lib/logger";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";
import {
  missingField, invalidEnum, tooLong,
  DIVISIONS, PLAYER_ROLES, ORG_ROLES, PLAYER_GAMES,
} from "@/lib/validate";

const DISPLAY_NAME_MAX = 80;

/** Validate the non-privileged, user-editable player fields. Returns an error message or null. */
function validatePlayerFields(body: Partial<Player>): string | null {
  return (
    tooLong("display_name", body.display_name, DISPLAY_NAME_MAX) ||
    invalidEnum("division", body.division, DIVISIONS) ||
    invalidEnum("game", body.game, PLAYER_GAMES) ||
    tooLong("in_game_role", body.in_game_role, 40) ||
    tooLong("rank", body.rank, 40)
  );
}

export async function GET(request: NextRequest) {
  try {
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
  } catch (e) {
    console.error("GET /api/players", e);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const role = resolveOrgRole(session.user);
    if (!can.editPlayerProfiles(role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 });

    const body = await request.json() as Player;

    const missing = missingField(body, ["discord_id"]);
    if (missing) return apiError(`Missing required field: ${missing}`, 400);

    const fieldErr =
      validatePlayerFields(body) ||
      invalidEnum("role", body.role, PLAYER_ROLES) ||
      invalidEnum("org_role", body.org_role, ORG_ROLES);
    if (fieldErr) return apiError(fieldErr, 400);

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
  } catch (e) {
    console.error("POST /api/players", e);
    return apiError("Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    if (!verifyCsrfOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 });

    const role = resolveOrgRole(session.user);
    const body = await request.json() as Partial<Player> & { discord_id: string };

    const missing = missingField(body, ["discord_id"]);
    if (missing) return apiError(`Missing required field: ${missing}`, 400);

    // Players can only edit their own profile (non-role fields)
    const isSelf = session.user.discordId === body.discord_id;
    if (!isSelf && !can.editPlayerProfiles(role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Strip privileged fields unless the caller can edit profiles (admin path).
    // Self-edits never carry role/admin/archived changes — those go through the
    // dedicated admin route (updatePlayerRole / archivePlayer).
    if (!can.editPlayerProfiles(role)) {
      delete body.role;
      delete body.is_admin;
      delete body.org_role;
      delete body.archived;
    } else {
      // Admin path: validate the privileged enums when present.
      const privErr =
        invalidEnum("role", body.role, PLAYER_ROLES) ||
        invalidEnum("org_role", body.org_role, ORG_ROLES);
      if (privErr) return apiError(privErr, 400);
    }

    const fieldErr = validatePlayerFields(body);
    if (fieldErr) return apiError(fieldErr, 400);

    await upsertPlayer(body);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("PATCH /api/players", e);
    return apiError("Internal server error", 500);
  }
}
