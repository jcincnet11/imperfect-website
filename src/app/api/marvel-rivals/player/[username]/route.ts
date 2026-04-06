import { NextRequest, NextResponse } from "next/server";
import { transformApiResponse, mrHeroPortrait, PlayerStats } from "@/lib/mr-stats";
import { getStatsOverride } from "@/lib/db";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// In-memory cache  (username -> { data, expires })
// ---------------------------------------------------------------------------

const cache = new Map<string, { data: PlayerStats; expires: number }>();
const TTL =
  parseInt(process.env.STATS_CACHE_TTL_SECONDS || "3600", 10) * 1000;

// Rate-limit: track last external fetch per username (1 req / min / username)
const lastFetch = new Map<string, number>();
const RATE_LIMIT_MS = 60_000; // 1 minute

// ---------------------------------------------------------------------------
// GET /api/marvel-rivals/player/[username]
// ---------------------------------------------------------------------------

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json(
      { stats: null, error: "Missing username" },
      { status: 400 },
    );
  }

  const key = username.toLowerCase();
  const forceRefresh = request.nextUrl.searchParams.get("force") === "true";
  const discordId = request.nextUrl.searchParams.get("discord_id");

  // ----- Check for manual stats override -----
  if (discordId) {
    const override = await getStatsOverride(discordId);
    if (override?.use_override) {
      const manualStats: PlayerStats = {
        username,
        rank: {
          name: override.rank_name ?? "Unranked",
          tier: "",
          iconUrl: null,
        },
        winRate: (override.win_rate ?? 0) / 100,
        kda: override.kda ?? 0,
        matchesPlayed: override.matches ?? 0,
        topHeroes: (override.top_heroes ?? []).map((h) => ({
          name: h.name,
          role: h.role,
          matchesPlayed: h.matchesPlayed,
          winRate: h.winRate / 100,
          kda: h.kda,
          portraitUrl: mrHeroPortrait(h.name),
        })),
        dataSource: "manual",
        lastUpdated: new Date().toISOString(),
      };
      return NextResponse.json({ stats: manualStats });
    }
  }

  // ----- Check cache (unless force) -----
  if (!forceRefresh) {
    const cached = cache.get(key);
    if (cached && cached.expires > Date.now()) {
      const stats: PlayerStats = { ...cached.data, dataSource: "cached" };
      return NextResponse.json({ stats });
    }
  }

  // ----- Rate-limit check -----
  const lastTime = lastFetch.get(key) ?? 0;
  if (Date.now() - lastTime < RATE_LIMIT_MS) {
    // Serve stale cache if available, otherwise null
    const stale = cache.get(key);
    if (stale) {
      const stats: PlayerStats = { ...stale.data, dataSource: "cached" };
      return NextResponse.json({ stats });
    }
    return NextResponse.json({ stats: null });
  }

  // ----- Fetch from external API -----
  const apiKey = process.env.MARVEL_RIVALS_API_KEY;
  const apiBase =
    process.env.MARVEL_RIVALS_API_BASE || "https://marvelrivalsapi.com/api/v1";

  if (!apiKey) {
    console.error("[mr-stats] MARVEL_RIVALS_API_KEY is not set");
    return NextResponse.json(
      { stats: null, error: "Server misconfigured" },
      { status: 500 },
    );
  }

  try {
    lastFetch.set(key, Date.now());

    const res = await fetch(`${apiBase}/player/${encodeURIComponent(username)}`, {
      headers: { "x-api-key": apiKey },
      // Don't let Next.js cache the upstream fetch; we manage our own cache
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        `[mr-stats] API returned ${res.status} for ${username}`,
      );
      return NextResponse.json({ stats: null });
    }

    const data = await res.json();
    const stats = transformApiResponse(username, data);

    if (!stats) {
      return NextResponse.json({ stats: null });
    }

    // Store in cache
    cache.set(key, { data: stats, expires: Date.now() + TTL });

    return NextResponse.json({ stats });
  } catch (err) {
    console.error("[mr-stats] Fetch failed:", err);
    // Fall back to stale cache if available
    const stale = cache.get(key);
    if (stale) {
      const stats: PlayerStats = { ...stale.data, dataSource: "cached" };
      return NextResponse.json({ stats });
    }
    return NextResponse.json({ stats: null });
  }
}
