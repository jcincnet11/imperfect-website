import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { updateTournament, deleteTournament } from "@/lib/management-db";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const updated = await updateTournament(id, {
    name: body.name,
    game: body.game,
    organizer: body.organizer ?? null,
    format: body.format ?? null,
    date_start: body.date_start ?? null,
    date_end: body.date_end ?? null,
    reg_deadline: body.reg_deadline ?? null,
    entry_fee: Number(body.entry_fee ?? 0),
    prize_pool: Number(body.prize_pool ?? 0),
    placement: body.placement ?? null,
    prize_won: Number(body.prize_won ?? 0),
    wins: Number(body.wins ?? 0),
    losses: Number(body.losses ?? 0),
    status: body.status ?? "Upcoming",
    notes: body.notes ?? null,
  });
  return Response.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await deleteTournament(id);
  return Response.json({ ok: true });
}
