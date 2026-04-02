import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mocks ──────────────────────────────────────────────────────────────────

const mockAuth = vi.fn();
vi.mock("@/auth", () => ({ auth: () => mockAuth() }));

const mockGetAvailability = vi.fn();
const mockUpsertAvailability = vi.fn();
const mockGetAllPlayers = vi.fn();
vi.mock("@/lib/db", () => ({
  getAvailability: (w: string, id?: string) => mockGetAvailability(w, id),
  upsertAvailability: (r: unknown) => mockUpsertAvailability(r),
  getAllPlayers: () => mockGetAllPlayers(),
}));

vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: () => true }));

// ── Helpers ────────────────────────────────────────────────────────────────

function makeSession(role: string, discordId = "player_1") {
  return { user: { role, discordId } };
}

function getReq(params?: Record<string, string>) {
  const url = new URL("http://localhost/api/availability");
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url.toString());
}

function postReq(body: unknown) {
  return new NextRequest("http://localhost/api/availability", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("GET /api/availability", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { GET } = await import("@/app/api/availability/route");
    const res = await GET(getReq());
    expect(res.status).toBe(401);
  });

  it("player only sees their own availability", async () => {
    mockAuth.mockResolvedValue(makeSession("player", "player_1"));
    mockGetAvailability.mockResolvedValue([]);
    mockGetAllPlayers.mockResolvedValue([]);
    const { GET } = await import("@/app/api/availability/route");
    await GET(getReq({ week_start: "2026-01-06" }));
    expect(mockGetAvailability).toHaveBeenCalledWith("2026-01-06", "player_1");
  });

  it("coach sees all availability (no discord id filter)", async () => {
    mockAuth.mockResolvedValue(makeSession("coach", "coach_1"));
    mockGetAvailability.mockResolvedValue([]);
    mockGetAllPlayers.mockResolvedValue([]);
    const { GET } = await import("@/app/api/availability/route");
    await GET(getReq({ week_start: "2026-01-06" }));
    expect(mockGetAvailability).toHaveBeenCalledWith("2026-01-06", undefined);
  });

  it("coach response includes players list", async () => {
    mockAuth.mockResolvedValue(makeSession("coach", "coach_1"));
    mockGetAvailability.mockResolvedValue([]);
    mockGetAllPlayers.mockResolvedValue([{ discord_id: "p1", display_name: "Player One" }]);
    const { GET } = await import("@/app/api/availability/route");
    const res = await GET(getReq());
    const body = await res.json();
    expect(body.players).toHaveLength(1);
  });
});

describe("POST /api/availability", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { POST } = await import("@/app/api/availability/route");
    const res = await POST(postReq({}));
    expect(res.status).toBe(401);
  });

  it("player cannot update another player's availability", async () => {
    mockAuth.mockResolvedValue(makeSession("player", "player_1"));
    const { POST } = await import("@/app/api/availability/route");
    const res = await POST(postReq({
      player_discord_id: "other_player",
      week_start: "2026-01-06",
      day: "MON",
      status: "AVAILABLE",
    }));
    expect(res.status).toBe(403);
  });

  it("player can update their own availability", async () => {
    mockAuth.mockResolvedValue(makeSession("player", "player_1"));
    mockUpsertAvailability.mockResolvedValue({
      id: "uuid-1", week_start: "2026-01-06", player_discord_id: "player_1", day: "MON", status: "AVAILABLE",
    });
    const { POST } = await import("@/app/api/availability/route");
    const res = await POST(postReq({
      player_discord_id: "player_1",
      week_start: "2026-01-06",
      day: "MON",
      status: "AVAILABLE",
    }));
    expect(res.status).toBe(200);
    expect(mockUpsertAvailability).toHaveBeenCalled();
  });

  it("coach can update any player's availability", async () => {
    mockAuth.mockResolvedValue(makeSession("coach", "coach_1"));
    mockUpsertAvailability.mockResolvedValue({
      id: "uuid-2", week_start: "2026-01-06", player_discord_id: "player_1", day: "TUE", status: "UNAVAILABLE",
    });
    const { POST } = await import("@/app/api/availability/route");
    const res = await POST(postReq({
      player_discord_id: "player_1",
      week_start: "2026-01-06",
      day: "TUE",
      status: "UNAVAILABLE",
    }));
    expect(res.status).toBe(200);
  });
});
