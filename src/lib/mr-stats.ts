// ---------------------------------------------------------------------------
// Marvel Rivals player stats — types & helpers
// ---------------------------------------------------------------------------

export type HeroStat = {
  name: string;
  role: "Vanguard" | "Duelist" | "Strategist" | string;
  matchesPlayed: number;
  winRate: number; // 0.0-1.0
  kda: number;
  portraitUrl: string | null;
};

export type PlayerStats = {
  username: string;
  rank: { name: string; tier: string; iconUrl: string | null };
  winRate: number; // 0.0-1.0
  kda: number;
  matchesPlayed: number;
  topHeroes: HeroStat[]; // top 3
  dataSource: "api" | "manual" | "cached";
  lastUpdated: string; // ISO timestamp
};

// ---------------------------------------------------------------------------
// Hero role mapping
// ---------------------------------------------------------------------------

const HERO_ROLES: Record<string, "Vanguard" | "Duelist" | "Strategist"> = {
  magneto: "Vanguard",
  thor: "Vanguard",
  "captain america": "Vanguard",
  hulk: "Vanguard",
  "doctor strange": "Vanguard",
  venom: "Vanguard",
  groot: "Vanguard",
  "peni parker": "Vanguard",

  "spider-man": "Duelist",
  "black panther": "Duelist",
  wolverine: "Duelist",
  hawkeye: "Duelist",
  "star-lord": "Duelist",
  "the punisher": "Duelist",
  "black widow": "Duelist",
  "iron man": "Duelist",
  "human torch": "Duelist",
  psylocke: "Duelist",
  "winter soldier": "Duelist",
  namor: "Duelist",
  "moon knight": "Duelist",
  "scarlet witch": "Duelist",
  "iron fist": "Duelist",
  "squirrel girl": "Duelist",

  mantis: "Strategist",
  "luna snow": "Strategist",
  loki: "Strategist",
  "adam warlock": "Strategist",
  "cloak & dagger": "Strategist",
  "rocket raccoon": "Strategist",
  "jeff the land shark": "Strategist",
  "invisible woman": "Strategist",
};

function heroRole(name: string): "Vanguard" | "Duelist" | "Strategist" | string {
  return HERO_ROLES[name.toLowerCase()] ?? "Unknown";
}

// ---------------------------------------------------------------------------
// Transform raw API response -> PlayerStats
// ---------------------------------------------------------------------------

export function transformApiResponse(
  username: string,
  data: any,
): PlayerStats | null {
  const ranked = data?.overall_stats?.ranked;
  const heroes: any[] = data?.heroes_ranked ?? [];

  // Treat empty data as "no stats available"
  const totalMatches = ranked?.total_matches ?? 0;
  if (totalMatches === 0 && heroes.length === 0) return null;

  const totalWins = ranked?.total_wins ?? 0;
  const totalKills = ranked?.total_kills ?? 0;
  const totalDeaths = ranked?.total_deaths ?? 0;
  const totalAssists = ranked?.total_assists ?? 0;

  const winRate = totalMatches > 0 ? totalWins / totalMatches : 0;
  const kda = (totalKills + totalAssists) / Math.max(totalDeaths, 1);

  // Rank info
  const rankData = data?.player?.rank;
  const rankName = rankData?.rank ?? "Unranked";
  // Derive tier from rank string (e.g. "Diamond 3" -> tier "3", "Eternity" -> "")
  const tierMatch = rankName.match(/\s(\S+)$/);
  const tier = tierMatch ? tierMatch[1] : "";
  const baseName = tier ? rankName.replace(/\s\S+$/, "") : rankName;

  const rank = {
    name: baseName,
    tier,
    iconUrl: rankData?.image ?? null,
  };

  // Top 3 heroes by play_time
  const sorted = [...heroes].sort(
    (a, b) => (b.play_time ?? 0) - (a.play_time ?? 0),
  );

  const topHeroes: HeroStat[] = sorted.slice(0, 3).map((h) => {
    const heroMatches = h.matches ?? 0;
    const heroWins = h.wins ?? 0;
    const heroKills = h.kills ?? 0;
    const heroDeaths = h.deaths ?? 0;
    const heroAssists = h.assists ?? 0;

    return {
      name: h.hero_name ?? "Unknown",
      role: heroRole(h.hero_name ?? ""),
      matchesPlayed: heroMatches,
      winRate: heroMatches > 0 ? heroWins / heroMatches : 0,
      kda: (heroKills + heroAssists) / Math.max(heroDeaths, 1),
      portraitUrl: h.hero_thumbnail
        ? `https://marvelrivalsapi.com${h.hero_thumbnail}`
        : null,
    };
  });

  return {
    username,
    rank,
    winRate,
    kda,
    matchesPlayed: totalMatches,
    topHeroes,
    dataSource: "api",
    lastUpdated: new Date().toISOString(),
  };
}
