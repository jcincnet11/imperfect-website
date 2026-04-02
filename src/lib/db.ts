/**
 * Data access layer — uses Supabase when configured, falls back to JSON files.
 * Connect Supabase by setting SUPABASE_URL and SUPABASE_ANON_KEY in .env.local.
 */
import { supabase } from "./supabase";
import type { OrgRole } from "./permissions";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

let _jsonFallbackWarned = false;

function readJson<T>(filename: string): T[] {
  if (process.env.NODE_ENV === "production" && !_jsonFallbackWarned) {
    _jsonFallbackWarned = true;
    console.error(
      "[db] CRITICAL: Supabase is not configured in production. " +
      "Serving stale static JSON data — this is NOT suitable for production use. " +
      "Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables."
    );
  }
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
  discord_id:   string;
  display_name: string;
  division:     string;
  role:         "admin" | "coach" | "player";
  is_admin:     boolean;
  // New fields (added in role_system migration)
  org_role:     OrgRole;
  game:         "OW2" | "MR" | "BOTH" | null;
  in_game_role: string | null;
  rank:         string | null;
  captain_of:   string | null;
  archived:     boolean;
};

export type ScheduleBlock = {
  id:         string;
  week_start: string;
  division:   string;
  day:        "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  time_slot:  string;
  block_type: "PRACTICE" | "SCRIM" | "VOD_REVIEW" | "MEETING" | "TOURNAMENT" | "FLEX" | "REST";
  notes?:     string;
};

export type Availability = {
  id:                string;
  week_start:        string;
  player_discord_id: string;
  day:               "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  status:            "AVAILABLE" | "UNAVAILABLE" | "UNSURE";
};

export type Scrim = {
  id:           string;
  game:         "OW2" | "MR";
  division:     string;
  opponent_org: string;
  scheduled_at: string; // ISO timestamp
  format:       string | null;
  status:       "Pending" | "Confirmed" | "Cancelled" | "Completed";
  result:       "W" | "L" | "Draw" | null;
  score:        string | null;
  notes:        string | null;
  created_by:   string;
  created_at:   string;
  updated_at:   string;
};

export type Announcement = {
  id:                string;
  title:             string;
  body:              string;
  author_discord_id: string;
  pinned:            boolean;
  target_audience:   "ALL" | "IMPERFECT" | "SHADOWS" | "ECHOES" | "COACHES" | "MANAGERS" | "PLAYERS";
  created_at:        string;
  updated_at:        string;
};

export type AuditEntry = {
  id:               string;
  actor_discord_id: string;
  action_type:      string;
  entity_type:      string;
  entity_id:        string;
  before_val:       Record<string, unknown> | null;
  after_val:        Record<string, unknown> | null;
  created_at:       string;
};

export type Invite = {
  id:         string;
  token:      string;
  org_role:   OrgRole;
  created_by: string;
  used_by:    string | null;
  used_at:    string | null;
  expires_at: string;
  created_at: string;
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

export async function getAllPlayers(includeArchived = false): Promise<Player[]> {
  if (supabase) {
    let q = supabase.from("players").select("*").order("display_name");
    if (!includeArchived) q = q.eq("archived", false);
    const { data } = await q;
    return (data as Player[]) ?? [];
  }
  const players = readJson<Player>("players.json");
  return includeArchived ? players : players.filter((p) => !p.archived);
}

export async function upsertPlayer(player: Partial<Player> & { discord_id: string }): Promise<void> {
  if (supabase) {
    await supabase.from("players").upsert(player, { onConflict: "discord_id" });
    return;
  }
  const players = readJson<Player>("players.json");
  const idx = players.findIndex((p) => p.discord_id === player.discord_id);
  if (idx >= 0) players[idx] = { ...players[idx], ...player };
  else players.push(player as Player);
  writeJson("players.json", players);
}

export async function archivePlayer(discordId: string): Promise<void> {
  if (supabase) {
    await supabase.from("players").update({ archived: true }).eq("discord_id", discordId);
    return;
  }
  const players = readJson<Player>("players.json");
  const idx = players.findIndex((p) => p.discord_id === discordId);
  if (idx >= 0) players[idx].archived = true;
  writeJson("players.json", players);
}

export async function updatePlayerRole(discordId: string, orgRole: OrgRole, captainOf?: string | null): Promise<void> {
  if (supabase) {
    await supabase
      .from("players")
      .update({ org_role: orgRole, captain_of: captainOf ?? null })
      .eq("discord_id", discordId);
    return;
  }
  const players = readJson<Player>("players.json");
  const idx = players.findIndex((p) => p.discord_id === discordId);
  if (idx >= 0) {
    players[idx].org_role = orgRole;
    players[idx].captain_of = captainOf ?? null;
  }
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

// ─── Scrims ───────────────────────────────────────────────────────────────────

export async function getScrims(division?: string): Promise<Scrim[]> {
  if (!supabase) return [];
  let q = supabase.from("scrims").select("*").order("scheduled_at", { ascending: true });
  if (division) q = q.eq("division", division);
  const { data } = await q;
  return (data as Scrim[]) ?? [];
}

export async function createScrim(scrim: Omit<Scrim, "id" | "created_at" | "updated_at">): Promise<Scrim> {
  if (!supabase) throw new Error("Supabase required for scrims");
  const { data, error } = await supabase.from("scrims").insert(scrim).select().single();
  if (error) throw error;
  return data as Scrim;
}

export async function updateScrim(id: string, patch: Partial<Scrim>): Promise<Scrim> {
  if (!supabase) throw new Error("Supabase required for scrims");
  const { data, error } = await supabase
    .from("scrims")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Scrim;
}

export async function deleteScrim(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase required for scrims");
  await supabase.from("scrims").delete().eq("id", id);
}

// ─── Announcements ────────────────────────────────────────────────────────────

export async function getAnnouncements(audience?: string): Promise<Announcement[]> {
  if (!supabase) return [];
  let q = supabase
    .from("announcements")
    .select("*")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (audience && audience !== "ALL") {
    q = q.in("target_audience", ["ALL", audience]);
  }
  const { data } = await q;
  return (data as Announcement[]) ?? [];
}

export async function createAnnouncement(a: Omit<Announcement, "id" | "created_at" | "updated_at">): Promise<Announcement> {
  if (!supabase) throw new Error("Supabase required for announcements");
  const { data, error } = await supabase.from("announcements").insert(a).select().single();
  if (error) throw error;
  return data as Announcement;
}

export async function updateAnnouncement(id: string, patch: Partial<Announcement>): Promise<void> {
  if (!supabase) throw new Error("Supabase required for announcements");
  await supabase.from("announcements").update(patch).eq("id", id);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase required for announcements");
  await supabase.from("announcements").delete().eq("id", id);
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export async function appendAuditLog(entry: Omit<AuditEntry, "id" | "created_at">): Promise<void> {
  if (!supabase) return; // no-op without DB
  await supabase.from("audit_log").insert(entry);
}

export async function getAuditLog(limit = 100): Promise<AuditEntry[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as AuditEntry[]) ?? [];
}

// ─── Invites ──────────────────────────────────────────────────────────────────

export async function getInvites(): Promise<Invite[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("invites")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Invite[]) ?? [];
}

export async function createInvite(orgRole: OrgRole, createdBy: string): Promise<Invite> {
  if (!supabase) throw new Error("Supabase required for invites");
  const { data, error } = await supabase
    .from("invites")
    .insert({ org_role: orgRole, created_by: createdBy })
    .select()
    .single();
  if (error) throw error;
  return data as Invite;
}

export async function getInviteByToken(token: string): Promise<Invite | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("invites")
    .select("*")
    .eq("token", token)
    .single();
  return data as Invite | null;
}

export async function redeemInvite(token: string, discordId: string): Promise<OrgRole | null> {
  if (!supabase) return null;
  const invite = await getInviteByToken(token);
  if (!invite) return null;
  if (invite.used_by) return null; // already used
  if (new Date(invite.expires_at) < new Date()) return null; // expired

  await supabase
    .from("invites")
    .update({ used_by: discordId, used_at: new Date().toISOString() })
    .eq("token", token);

  return invite.org_role;
}

export async function deleteInvite(id: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("invites").delete().eq("id", id);
}
