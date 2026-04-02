import { describe, it, expect, vi } from "vitest";

// Mock Supabase as unconfigured — tests the "not configured" fallback paths
vi.mock("@/lib/supabase", () => ({ supabase: null }));

import {
  getTournaments,
  getSponsors,
  getRevenue,
  getChecklist,
  getManagementStats,
  createTournament,
  createSponsor,
} from "@/lib/management-db";

describe("management-db (no Supabase configured)", () => {
  describe("read functions return empty defaults", () => {
    it("getTournaments returns []", async () => {
      expect(await getTournaments()).toEqual([]);
    });

    it("getSponsors returns []", async () => {
      expect(await getSponsors()).toEqual([]);
    });

    it("getRevenue returns []", async () => {
      expect(await getRevenue()).toEqual([]);
    });

    it("getChecklist returns []", async () => {
      expect(await getChecklist()).toEqual([]);
    });
  });

  describe("getManagementStats returns default stats", () => {
    it("returns zeroed stats object", async () => {
      const stats = await getManagementStats();
      expect(stats.totalWins).toBe(0);
      expect(stats.totalLosses).toBe(0);
      expect(stats.totalSponsorshipRevenue).toBe(0);
      expect(stats.outstandingInvoices).toBe(0);
      expect(stats.nextTournamentDate).toBeNull();
      expect(stats.nextTournamentName).toBeNull();
    });
  });

  describe("mutation functions throw when Supabase not configured", () => {
    it("createTournament throws 'Supabase not configured'", async () => {
      await expect(
        createTournament({
          name: "Test Cup",
          game: "Marvel Rivals",
          entry_fee: 0,
          prize_pool: 0,
          prize_won: 0,
          wins: 0,
          losses: 0,
          status: "Upcoming",
        })
      ).rejects.toThrow("Supabase not configured");
    });

    it("createSponsor throws 'Supabase not configured'", async () => {
      await expect(
        createSponsor({
          company_name: "Test Corp",
          tier: "Associate",
          deal_value: 0,
          paid_to_date: 0,
          status: "Prospect",
        })
      ).rejects.toThrow("Supabase not configured");
    });
  });
});
