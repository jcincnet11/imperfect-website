import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mocks ──────────────────────────────────────────────────────────────────

const mockAuth = vi.fn();
vi.mock("@/auth", () => ({ auth: () => mockAuth() }));

const mockGetAllPlayers = vi.fn();
const mockUpsertPlayer = vi.fn();
vi.mock("@/lib/db", () => ({
  getAllPlayers: () => mockGetAllPlayers(),
  upsertPlayer: (p: unknown) => mockUpsertPlayer(p),
}));

// Always pass rate limit in unit tests
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: () => true }));

// ── Helpers ────────────────────────────────────────────────────────────────

function makeSession(role: string) {
  return { user: { role, discordId: "test_discord_id" } };
}

function req(method = "GET", body?: unknown) {
  return new NextRequest("http://localhost/api/players", {
    method,
    ...(body ? { body: JSON.stringify(body), headers: { "content-type": "application/json" } } : {}),
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("GET /api/players", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { GET } = await import("@/app/api/players/route");
    const res = await GET(req());
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ error: "Unauthorized" });
  });

  it("returns 403 when role is player", async () => {
    mockAuth.mockResolvedValue(makeSession("player"));
    const { GET } = await import("@/app/api/players/route");
    const res = await GET(req());
    expect(res.status).toBe(403);
  });

  it("returns 200 with players for coach role", async () => {
    mockAuth.mockResolvedValue(makeSession("coach"));
    mockGetAllPlayers.mockResolvedValue([{ discord_id: "abc", display_name: "TestPlayer", role: "player" }]);
    const { GET } = await import("@/app/api/players/route");
    const res = await GET(req());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0].discord_id).toBe("abc");
  });

  it("returns 200 with players for admin role", async () => {
    mockAuth.mockResolvedValue(makeSession("admin"));
    mockGetAllPlayers.mockResolvedValue([]);
    const { GET } = await import("@/app/api/players/route");
    const res = await GET(req());
    expect(res.status).toBe(200);
  });
});

describe("POST /api/players", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { POST } = await import("@/app/api/players/route");
    const res = await POST(req("POST", { discord_id: "abc" }));
    expect(res.status).toBe(401);
  });

  it("returns 403 when role is coach", async () => {
    mockAuth.mockResolvedValue(makeSession("coach"));
    const { POST } = await import("@/app/api/players/route");
    const res = await POST(req("POST", { discord_id: "abc" }));
    expect(res.status).toBe(403);
  });

  it("returns 200 and calls upsertPlayer when admin", async () => {
    mockAuth.mockResolvedValue(makeSession("admin"));
    mockUpsertPlayer.mockResolvedValue(undefined);
    const { POST } = await import("@/app/api/players/route");
    const player = { discord_id: "xyz", display_name: "New", role: "player", division: "MR", is_admin: false };
    const res = await POST(req("POST", player));
    expect(res.status).toBe(200);
    expect(mockUpsertPlayer).toHaveBeenCalledWith(player);
  });
});
