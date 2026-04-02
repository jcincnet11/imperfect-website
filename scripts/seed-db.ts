#!/usr/bin/env npx tsx
/**
 * Seed the Supabase database with local JSON dev data.
 * Run: npx tsx scripts/seed-db.ts
 *
 * Requires SUPABASE_URL and SUPABASE_ANON_KEY in your environment
 * (reads from .env.local automatically via dotenv).
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

function readJson<T>(filename: string): T[] {
  try {
    const raw = readFileSync(resolve(process.cwd(), "data", filename), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    console.warn(`  ⚠ Could not read data/${filename} — skipping`);
    return [];
  }
}

async function seed() {
  console.log("Seeding Supabase from data/*.json...\n");

  // Players
  const players = readJson("players.json");
  if (players.length) {
    const { error } = await supabase
      .from("players")
      .upsert(players, { onConflict: "discord_id" });
    if (error) console.error("  ✗ players:", error.message);
    else console.log(`  ✓ players: ${players.length} rows upserted`);
  }

  // Schedule blocks
  const schedule = readJson("schedule.json");
  if (schedule.length) {
    const { error } = await supabase
      .from("schedule_blocks")
      .upsert(schedule, { onConflict: "id" });
    if (error) console.error("  ✗ schedule_blocks:", error.message);
    else console.log(`  ✓ schedule_blocks: ${schedule.length} rows upserted`);
  }

  // Availability
  const availability = readJson("availability.json");
  if (availability.length) {
    const { error } = await supabase
      .from("availability")
      .upsert(availability, { onConflict: "week_start,player_discord_id,day" });
    if (error) console.error("  ✗ availability:", error.message);
    else console.log(`  ✓ availability: ${availability.length} rows upserted`);
  }

  console.log("\nDone.");
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
