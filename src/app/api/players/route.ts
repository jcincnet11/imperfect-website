import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAllPlayers, upsertPlayer, type Player } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as Record<string, unknown>).role as string;
  if (role !== "admin" && role !== "coach") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const players = await getAllPlayers();
  return Response.json(players);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as Record<string, unknown>).role as string;
  if (role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json() as Player;
  await upsertPlayer(body);
  return Response.json({ ok: true });
}
