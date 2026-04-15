import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { getTournaments, createTournament } from "@/lib/management-db";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { missingField, safeNumber, invalidEnum } from "@/lib/validate";
import { apiError } from "@/lib/api-error";
import { logRequest } from "@/lib/logger";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if (!isOrgAdmin(session)) return apiError("Forbidden", 403);

    const data = await getTournaments();
    return Response.json(data);
  } catch (e) {
    console.error("GET /api/management/tournaments", e);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const start = Date.now();
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if (!isOrgAdmin(session)) return apiError("Forbidden", 403);
    if (!verifyCsrfOrigin(request)) return apiError("Invalid origin", 403);

    const body = await request.json() as Record<string, unknown>;
    const missing = missingField(body, ["name", "game"]);
    if (missing) return apiError(`Missing required field: ${missing}`, 400);
    const badGame = invalidEnum("game", body.game, ["OW2", "MR", "Both"]);
    if (badGame) return apiError(badGame, 400);
    const badStatus = invalidEnum("status", body.status, ["Upcoming", "Ongoing", "Completed", "Cancelled"]);
    if (badStatus) return apiError(badStatus, 400);

    const tournament = await createTournament({
      name: body.name as string,
      game: body.game as string,
      organizer: (body.organizer as string) ?? null,
      format: (body.format as string) ?? null,
      date_start: (body.date_start as string) ?? null,
      date_end: (body.date_end as string) ?? null,
      reg_deadline: (body.reg_deadline as string) ?? null,
      entry_fee: safeNumber(body.entry_fee),
      prize_pool: safeNumber(body.prize_pool),
      placement: (body.placement as string) ?? null,
      prize_won: safeNumber(body.prize_won),
      wins: safeNumber(body.wins),
      losses: safeNumber(body.losses),
      status: (body.status as string) ?? "Upcoming",
      notes: (body.notes as string) ?? null,
    });
    const res = Response.json(tournament, { status: 201 });
    logRequest(request, res, start, { userId: session.user.discordId ?? "" });
    return res;
  } catch (e) {
    console.error("POST /api/management/tournaments", e);
    return apiError("Internal server error", 500);
  }
}
