import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { getTournaments, createTournament } from "@/lib/management-db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const data = await getTournaments();
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const tournament = await createTournament({
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
  return Response.json(tournament, { status: 201 });
}
