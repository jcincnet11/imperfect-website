/**
 * Tests for resolveAvailability() in db.ts.
 *
 * Strategy: mock the supabase client so we can control what getTemplates
 * and the override query return, then verify the override > template > unset
 * resolution logic.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase before importing db.ts
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockGte = vi.fn();
const mockLte = vi.fn();
const mockOrder = vi.fn();

vi.mock("../supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { resolveAvailability } from "../db";
import { supabase } from "../supabase";

const mockFrom = vi.mocked(supabase!.from);

/**
 * Helper: wire up a Supabase chain mock for a given table.
 * Returns a ref whose `.data` you can set to control query results.
 */
function mockSupabaseChain() {
  // Each chain call returns itself so .from().select().eq()... works
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  const result = { data: [] as unknown[], error: null };

  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (prop === "then") return undefined; // not a promise
      if (prop === "data") return result.data;
      if (prop === "error") return result.error;
      return (..._args: unknown[]) => new Proxy({}, handler);
    },
  };

  const proxy = new Proxy({}, handler);
  return { proxy, result };
}

// Track which table each from() call targets and return different results
let templateResult: { data: unknown[] };
let overrideResult: { data: unknown[] };

beforeEach(() => {
  vi.clearAllMocks();

  const templateChain = mockSupabaseChain();
  const overrideChain = mockSupabaseChain();

  templateResult = templateChain.result;
  overrideResult = overrideChain.result;

  mockFrom.mockImplementation((table: string) => {
    if (table === "availability_templates") return templateChain.proxy as never;
    if (table === "availability_overrides") return overrideChain.proxy as never;
    return templateChain.proxy as never;
  });
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("resolveAvailability", () => {
  it("returns unset for all slots when neither template nor override exists", async () => {
    templateResult.data = [];
    overrideResult.data = [];

    const result = await resolveAvailability("player1", "2026-04-06", "2026-04-06");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      date: "2026-04-06",
      morning: "unset",
      afternoon: "unset",
      evening: "unset",
      source: "none",
    });
  });

  it("returns template values when no override exists", async () => {
    // 2026-04-06 is a Monday (day_of_week = 0 in the 0=Mon scheme)
    templateResult.data = [
      {
        id: "t1",
        player_discord_id: "player1",
        day_of_week: 0, // Monday
        morning: "available",
        afternoon: "unavailable",
        evening: "available",
        updated_at: "2026-01-01",
      },
    ];
    overrideResult.data = [];

    const result = await resolveAvailability("player1", "2026-04-06", "2026-04-06");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      date: "2026-04-06",
      morning: "available",
      afternoon: "unavailable",
      evening: "available",
      source: "template",
    });
  });

  it("returns override values when an override exists", async () => {
    templateResult.data = [];
    overrideResult.data = [
      {
        id: "o1",
        player_discord_id: "player1",
        override_date: "2026-04-06",
        morning: "unavailable",
        afternoon: "available",
        evening: "unavailable",
        created_at: "2026-04-05",
      },
    ];

    const result = await resolveAvailability("player1", "2026-04-06", "2026-04-06");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      date: "2026-04-06",
      morning: "unavailable",
      afternoon: "available",
      evening: "unavailable",
      source: "override",
    });
  });

  it("override takes precedence over template for the same date", async () => {
    // Monday template says available across the board
    templateResult.data = [
      {
        id: "t1",
        player_discord_id: "player1",
        day_of_week: 0, // Monday
        morning: "available",
        afternoon: "available",
        evening: "available",
        updated_at: "2026-01-01",
      },
    ];
    // Override for that specific Monday says unavailable
    overrideResult.data = [
      {
        id: "o1",
        player_discord_id: "player1",
        override_date: "2026-04-06",
        morning: "unavailable",
        afternoon: "unavailable",
        evening: "unavailable",
        created_at: "2026-04-05",
      },
    ];

    const result = await resolveAvailability("player1", "2026-04-06", "2026-04-06");

    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("override");
    expect(result[0].morning).toBe("unavailable");
    expect(result[0].afternoon).toBe("unavailable");
    expect(result[0].evening).toBe("unavailable");
  });

  it("template correctly maps day_of_week to actual dates across a week", async () => {
    // Set templates for Monday (0) and Wednesday (2)
    templateResult.data = [
      {
        id: "t1",
        player_discord_id: "player1",
        day_of_week: 0, // Monday
        morning: "available",
        afternoon: "available",
        evening: "available",
        updated_at: "2026-01-01",
      },
      {
        id: "t2",
        player_discord_id: "player1",
        day_of_week: 2, // Wednesday
        morning: "unavailable",
        afternoon: "available",
        evening: "unavailable",
        updated_at: "2026-01-01",
      },
    ];
    overrideResult.data = [];

    // 2026-04-06 (Mon) through 2026-04-08 (Wed)
    const result = await resolveAvailability("player1", "2026-04-06", "2026-04-08");

    expect(result).toHaveLength(3);

    // Monday — has template
    expect(result[0].date).toBe("2026-04-06");
    expect(result[0].source).toBe("template");
    expect(result[0].morning).toBe("available");

    // Tuesday — no template
    expect(result[1].date).toBe("2026-04-07");
    expect(result[1].source).toBe("none");
    expect(result[1].morning).toBe("unset");

    // Wednesday — has template
    expect(result[2].date).toBe("2026-04-08");
    expect(result[2].source).toBe("template");
    expect(result[2].morning).toBe("unavailable");
  });

  it("handles a multi-day range with mixed sources", async () => {
    // Template for Tuesday (day_of_week 1)
    templateResult.data = [
      {
        id: "t1",
        player_discord_id: "player1",
        day_of_week: 1, // Tuesday
        morning: "available",
        afternoon: "available",
        evening: "available",
        updated_at: "2026-01-01",
      },
    ];
    // Override for Monday 2026-04-06
    overrideResult.data = [
      {
        id: "o1",
        player_discord_id: "player1",
        override_date: "2026-04-06",
        morning: "unavailable",
        afternoon: "unavailable",
        evening: "available",
        created_at: "2026-04-05",
      },
    ];

    // Mon-Wed
    const result = await resolveAvailability("player1", "2026-04-06", "2026-04-08");

    expect(result).toHaveLength(3);
    expect(result[0].source).toBe("override"); // Mon — override
    expect(result[1].source).toBe("template"); // Tue — template
    expect(result[2].source).toBe("none");     // Wed — nothing
  });
});
