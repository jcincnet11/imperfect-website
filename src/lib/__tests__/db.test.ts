import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase as unconfigured (null) — tests the JSON fallback path
vi.mock("@/lib/supabase", () => ({ supabase: null }));

import {
  getAllPlayers,
  getPlayerByDiscordId,
  getScheduleBlocks,
  getAvailability,
} from "@/lib/db";

describe("db (JSON fallback mode)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getAllPlayers", () => {
    it("returns an array", async () => {
      const players = await getAllPlayers();
      expect(Array.isArray(players)).toBe(true);
    });

    it("each player has required fields", async () => {
      const players = await getAllPlayers();
      for (const p of players) {
        expect(p).toHaveProperty("discord_id");
        expect(p).toHaveProperty("display_name");
        expect(p).toHaveProperty("role");
        expect(["admin", "coach", "player"]).toContain(p.role);
      }
    });
  });

  describe("getPlayerByDiscordId", () => {
    it("returns null for unknown discord id", async () => {
      const result = await getPlayerByDiscordId("nonexistent_id_00000");
      expect(result).toBeNull();
    });

    it("returns a player when the id exists", async () => {
      const players = await getAllPlayers();
      if (players.length === 0) return; // skip if no seed data
      const first = players[0];
      const found = await getPlayerByDiscordId(first.discord_id);
      expect(found).not.toBeNull();
      expect(found?.discord_id).toBe(first.discord_id);
    });
  });

  describe("getScheduleBlocks", () => {
    it("returns an array for any week/division", async () => {
      const blocks = await getScheduleBlocks("2026-01-06", "IMPerfect");
      expect(Array.isArray(blocks)).toBe(true);
    });

    it("only returns blocks matching the requested division", async () => {
      const blocks = await getScheduleBlocks("2026-01-06", "IMPerfect");
      for (const b of blocks) {
        expect(b.division).toBe("IMPerfect");
      }
    });
  });

  describe("getAvailability", () => {
    it("returns an array", async () => {
      const rows = await getAvailability("2026-01-06");
      expect(Array.isArray(rows)).toBe(true);
    });

    it("filters by discordId when provided", async () => {
      const allRows = await getAvailability("2026-01-06");
      if (allRows.length === 0) return; // skip if no seed data
      const targetId = allRows[0].player_discord_id;
      const filtered = await getAvailability("2026-01-06", targetId);
      expect(filtered.every((r) => r.player_discord_id === targetId)).toBe(true);
    });
  });
});
