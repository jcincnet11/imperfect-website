import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getLineupForScrim,
  upsertLineup,
  getScrims,
  appendAuditLog,
  type LineupSlot,
} from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { apiError } from "@/lib/api-error";
import {
  slotCountForGame,
  isValidRole,
  type Game,
} from "@/lib/lineup-rules";
import { notifyLineupSubmitted } from "@/lib/discord-notify";

/**
 * GET /api/lineups?scrim_id=X
 * Authenticated — any team member can view the lineup for a scrim.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const scrimId = request.nextUrl.searchParams.get("scrim_id");
    if (!scrimId) return apiError("scrim_id required", 400);

    const lineup = await getLineupForScrim(scrimId);
    return Response.json({ lineup });
  } catch (e) {
    console.error("GET /api/lineups", e);
    return apiError("Internal server error", 500);
  }
}

/**
 * POST /api/lineups
 * HEAD_COACH+ or CAPTAIN — create or update lineup for a scrim.
 * Body: { scrim_id, slots: LineupSlot[], notes?: string, status?: "draft" | "submitted" }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const orgRole = resolveOrgRole(session.user);
    if (!can.submitLineup(orgRole)) {
      // CAPTAINs on their own division can also submit — we'll allow any CAPTAIN here
      // for simplicity; finer-grained "captain of this division" check lives in UI
      if (orgRole !== "CAPTAIN") return apiError("Forbidden", 403);
    }

    if (!verifyCsrfOrigin(request)) return apiError("Invalid origin", 403);

    const body = await request.json() as Record<string, unknown>;
    const scrimId = body.scrim_id as string | undefined;
    const slots = body.slots as LineupSlot[] | undefined;
    const notes = typeof body.notes === "string" ? body.notes.slice(0, 2000) : null;
    const status = (body.status === "draft" || body.status === "submitted")
      ? body.status
      : "submitted";

    if (!scrimId) return apiError("scrim_id required", 400);
    if (!Array.isArray(slots)) return apiError("slots must be an array", 400);

    // Look up scrim to validate slot count + roles against its game
    const scrims = await getScrims();
    const scrim = scrims.find((s) => s.id === scrimId);
    if (!scrim) return apiError("Scrim not found", 404);

    const game = scrim.game as Game;
    const expected = slotCountForGame(game);
    if (slots.length !== expected) {
      return apiError(`${game} lineup requires exactly ${expected} slots`, 400);
    }
    for (const s of slots) {
      if (!s.player_discord_id || !s.role) {
        return apiError("Each slot requires player_discord_id and role", 400);
      }
      if (!isValidRole(game, s.role)) {
        return apiError(`Invalid role "${s.role}" for ${game}`, 400);
      }
    }

    // Guard against duplicate players in the same lineup
    const ids = new Set<string>();
    for (const s of slots) {
      if (ids.has(s.player_discord_id)) {
        return apiError("A player cannot fill two slots in the same lineup", 400);
      }
      ids.add(s.player_discord_id);
    }

    const submitterId = (session.user as { discordId?: string }).discordId ?? "";
    const existing = await getLineupForScrim(scrimId);
    const lineup = await upsertLineup({
      id: existing?.id,
      scrim_id: scrimId,
      status,
      slots,
      notes,
      submitted_by: submitterId,
    });

    await appendAuditLog({
      actor_discord_id: submitterId,
      action_type: existing ? "LINEUP_UPDATE" : "LINEUP_CREATE",
      entity_type: "lineup",
      entity_id: lineup.id,
      before_val: null,
      after_val: { scrim_id: scrimId, status, slot_count: slots.length } as Record<string, unknown>,
    });

    // Fire Discord notification on submit (not on draft saves)
    if (status === "submitted" && !existing) {
      notifyLineupSubmitted(lineup, scrim, (session.user as { name?: string }).name ?? submitterId)
        .catch((err) => console.error("Discord notify (lineup submitted):", err));
    }

    return Response.json({ lineup });
  } catch (e) {
    console.error("POST /api/lineups", e);
    return apiError("Internal server error", 500);
  }
}
