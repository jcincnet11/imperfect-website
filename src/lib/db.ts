/**
 * Data access layer — uses Supabase when configured, falls back to JSON files.
 * Connect Supabase by setting SUPABASE_URL and SUPABASE_ANON_KEY in .env.local.
 */
import { supabase } from "./supabase";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(filename: string): T[] {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeJson<T>(filename: string, data: T[]): void {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Player = {
  discord_id: string;
  display_name: string;
  division: string;
  role: "admin" | "coach" | "player";
  is_admin: boolean;
};

export type ScheduleBlock = {
  id: string;
  week_start: string; // ISO date string "YYYY-MM-DD"
  division: string;   // team name e.g. "IMPerfect", "Shadows", "Echoes"
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  time_slot: string; // "16:00", "17:00", etc.
  block_type: "PRACTICE" | "SCRIM" | "VOD_REVIEW" | "MEETING" | "TOURNAMENT" | "FLEX" | "REST";
  notes?: string;
};

export type Availability = {
  id: string;
  week_start: string;
  player_discord_id: string;
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  status: "AVAILABLE" | "UNAVAILABLE" | "UNSURE";
};

// ─── Players ──────────────────────────────────────────────────────────────────

export async function getPlayerByDiscordId(discordId: string): Promise<Player | null> {
  if (supabase) {
    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("discord_id", discordId)
      .single();
    return data as Player | null;
  }
  const players = readJson<Player>("players.json");
  return players.find((p) => p.discord_id === discordId) ?? null;
}

export async function getAllPlayers(): Promise<Player[]> {
  if (supabase) {
    const { data } = await supabase.from("players").select("*").order("display_name");
    return (data as Player[]) ?? [];
  }
  return readJson<Player>("players.json");
}

export async function upsertPlayer(player: Player): Promise<void> {
  if (supabase) {
    await supabase.from("players").upsert(player, { onConflict: "discord_id" });
    return;
  }
  const players = readJson<Player>("players.json");
  const idx = players.findIndex((p) => p.discord_id === player.discord_id);
  if (idx >= 0) players[idx] = player;
  else players.push(player);
  writeJson("players.json", players);
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export async function getScheduleBlocks(weekStart: string, division: string): Promise<ScheduleBlock[]> {
  if (supabase) {
    const { data } = await supabase
      .from("schedule_blocks")
      .select("*")
      .eq("week_start", weekStart)
      .eq("division", division);
    return (data as ScheduleBlock[]) ?? [];
  }
  const blocks = readJson<ScheduleBlock>("schedule.json");
  return blocks.filter((b) => b.week_start === weekStart && b.division === division);
}

export async function upsertScheduleBlock(block: ScheduleBlock): Promise<ScheduleBlock> {
  if (supabase) {
    const { data } = await supabase
      .from("schedule_blocks")
      .upsert(block, { onConflict: "id" })
      .select()
      .single();
    return data as ScheduleBlock;
  }
  const blocks = readJson<ScheduleBlock>("schedule.json");
  const idx = blocks.findIndex((b) => b.id === block.id);
  if (idx >= 0) blocks[idx] = block;
  else blocks.push(block);
  writeJson("schedule.json", blocks);
  return block;
}

export async function deleteScheduleBlock(id: string): Promise<void> {
  if (supabase) {
    await supabase.from("schedule_blocks").delete().eq("id", id);
    return;
  }
  const blocks = readJson<ScheduleBlock>("schedule.json");
  writeJson("schedule.json", blocks.filter((b) => b.id !== id));
}

// ─── Availability ─────────────────────────────────────────────────────────────

export async function getAvailability(weekStart: string, discordId?: string): Promise<Availability[]> {
  if (supabase) {
    let query = supabase.from("availability").select("*").eq("week_start", weekStart);
    if (discordId) query = query.eq("player_discord_id", discordId);
    const { data } = await query;
    return (data as Availability[]) ?? [];
  }
  const rows = readJson<Availability>("availability.json");
  return rows.filter(
    (r) => r.week_start === weekStart && (!discordId || r.player_discord_id === discordId)
  );
}

export async function upsertAvailability(row: Availability): Promise<Availability> {
  if (supabase) {
    const { data } = await supabase
      .from("availability")
      .upsert(row, { onConflict: "week_start,player_discord_id,day" })
      .select()
      .single();
    return data as Availability;
  }
  const rows = readJson<Availability>("availability.json");
  const idx = rows.findIndex(
    (r) =>
      r.week_start === row.week_start &&
      r.player_discord_id === row.player_discord_id &&
      r.day === row.day
  );
  if (idx >= 0) rows[idx] = row;
  else rows.push(row);
  writeJson("availability.json", rows);
  return row;
}
