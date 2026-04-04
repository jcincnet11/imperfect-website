import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { notifyReminder } from "@/lib/discord-notify";
import type { ScheduleBlock } from "@/lib/db";

export const dynamic = "force-dynamic";

function currentWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

/** Returns the UTC Date for a block's day+time_slot in the given week */
function blockDateTime(weekStart: string, day: string, timeSlot: string): Date {
  const base = new Date(weekStart + "T00:00:00Z");
  const dayOffset = ["MON","TUE","WED","THU","FRI","SAT","SUN"].indexOf(day);
  base.setUTCDate(base.getUTCDate() + dayOffset);
  const [h, m] = timeSlot.split(":").map(Number);
  // Assume sessions are in Puerto Rico time (UTC-4)
  base.setUTCHours(h + 4, m, 0, 0);
  return base;
}

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return Response.json({ skipped: "no supabase" });
  }

  const now = new Date();
  const weekStart = currentWeekStart();
  const teams = ["IMPerfect", "Shadows", "Echoes"];
  const notified: string[] = [];

  for (const team of teams) {
    const { data: blocks } = await supabase
      .from("schedule_blocks")
      .select("*")
      .eq("week_start", weekStart)
      .eq("division", team);

    if (!blocks) continue;

    for (const block of blocks as ScheduleBlock[]) {
      const sessionTime = blockDateTime(weekStart, block.day, block.time_slot);
      const msUntil = sessionTime.getTime() - now.getTime();
      const minutesUntil = msUntil / 60000;

      // Send 1h reminder (between 55–65 min window)
      if (minutesUntil >= 55 && minutesUntil <= 65) {
        const alreadySent = await reminderAlreadySent(block.id, "1h");
        if (!alreadySent) {
          await notifyReminder(block, 60);
          await markReminderSent(block.id, "1h");
          notified.push(`${team} ${block.day} ${block.time_slot} (1h)`);
        }
      }

      // Send 15min reminder (between 10–20 min window)
      if (minutesUntil >= 10 && minutesUntil <= 20) {
        const alreadySent = await reminderAlreadySent(block.id, "15m");
        if (!alreadySent) {
          await notifyReminder(block, 15);
          await markReminderSent(block.id, "15m");
          notified.push(`${team} ${block.day} ${block.time_slot} (15m)`);
        }
      }
    }
  }

  return Response.json({ ok: true, notified });
}

async function reminderAlreadySent(blockId: string, type: string): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase
    .from("reminders_sent")
    .select("id")
    .eq("block_id", blockId)
    .eq("type", type)
    .single();
  return Boolean(data);
}

async function markReminderSent(blockId: string, type: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("reminders_sent").upsert(
    { block_id: blockId, type },
    { onConflict: "block_id,type" }
  );
}
