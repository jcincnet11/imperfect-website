import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { updateTournament, deleteTournament } from "@/lib/management-db";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { missingField, safeNumber } from "@/lib/validate";
import { apiError } from "@/lib/api-error";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if (!isOrgAdmin(session)) return apiError("Forbidden", 403);
    if (!verifyCsrfOrigin(request)) return apiError("Invalid origin", 403);

    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;
    const missing = missingField(body, ["name", "game"]);
    if (missing) return apiError(`Missing required field: ${missing}`, 400);

    const updated = await updateTournament(id, {
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
    if (!updated) return apiError("Tournament not found", 404);
    return Response.json(updated);
  } catch (e) {
    console.error("PUT /api/management/tournaments/[id]", e);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if (!isOrgAdmin(session)) return apiError("Forbidden", 403);
    if (!verifyCsrfOrigin(request)) return apiError("Invalid origin", 403);

    const { id } = await params;
    await deleteTournament(id);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/management/tournaments/[id]", e);
    return apiError("Internal server error", 500);
  }
}
