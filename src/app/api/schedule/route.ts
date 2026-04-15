import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logRequest } from "@/lib/logger";
import {
  getScheduleBlocks,
  upsertScheduleBlock,
  deleteScheduleBlock,
  type ScheduleBlock,
} from "@/lib/db";
import { notifyBlockAdded, notifyBlockUpdated, notifyBlockDeleted } from "@/lib/discord-notify";
import { randomUUID } from "crypto";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";

export async function GET(request: NextRequest) {
  try {
    const start = Date.now();
    if (!checkRateLimit(request)) return Response.json({ error: "Too many requests" }, { status: 429 });

    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const weekStart = searchParams.get("week_start") ?? currentWeekStart();
    const division = searchParams.get("division") ?? "OW2";

    const blocks = await getScheduleBlocks(weekStart, division);
    const res = Response.json(blocks, {
      headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=600" },
    });
    logRequest(request, res, start);
    return res;
  } catch (e) {
    console.error("GET /api/schedule", e);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as Record<string, unknown>).role as string;
    if (role !== "admin" && role !== "coach") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 });

    const body = await request.json() as Partial<ScheduleBlock>;
    const block: ScheduleBlock = {
      id: body.id ?? randomUUID(),
      week_start: body.week_start!,
      division: body.division!,
      day: body.day!,
      time_slot: body.time_slot!,
      block_type: body.block_type!,
      notes: body.notes,
    };

    const isNew = !body.id;
    const saved = await upsertScheduleBlock(block);
    // Fire-and-forget notification
    if (isNew) notifyBlockAdded(saved).catch((e) => console.error("Discord notify (block added):", e));
    else notifyBlockUpdated(saved).catch((e) => console.error("Discord notify (block updated):", e));
    return Response.json(saved);
  } catch (e) {
    console.error("POST /api/schedule", e);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as Record<string, unknown>).role as string;
    if (role !== "admin" && role !== "coach") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 });

    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

    // Get block before deleting so we can notify
    const [block] = await getScheduleBlocks(currentWeekStart(), "").catch(() => []);
    await deleteScheduleBlock(id);
    if (block) notifyBlockDeleted(block).catch((e) => console.error("Discord notify (block deleted):", e));
    return Response.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/schedule", e);
    return apiError("Internal server error", 500);
  }
}

function currentWeekStart(): string {
  const d = new Date();
  const day = d.getDay(); // 0=Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Mon
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}
