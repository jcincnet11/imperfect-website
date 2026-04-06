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
  // Vanguard
  magneto: "Vanguard",
  thor: "Vanguard",
  "captain america": "Vanguard",
  hulk: "Vanguard",
  "doctor strange": "Vanguard",
  venom: "Vanguard",
  groot: "Vanguard",
  "peni parker": "Vanguard",
  "emma frost": "Vanguard",
  "the thing": "Vanguard",
  ultron: "Vanguard",

  // Duelist
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
  blade: "Duelist",
  "mister fantastic": "Duelist",
  magik: "Duelist",
  hela: "Duelist",
  storm: "Duelist",
  "captain marvel": "Duelist",
  "the hood": "Duelist",
  "white fox": "Duelist",
  daredevil: "Duelist",
  gambit: "Duelist",
  "black bolt": "Duelist",
  "mr. negative": "Duelist",
  taskmaster: "Duelist",

  // Strategist
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

/** Build a reliable portrait URL from a hero name using the card image endpoint. */
export function mrHeroPortrait(heroName: string): string {
  const slug = heroName.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-");
  return `https://marvelrivalsapi.com/rivals/heroes/card/${slug}.png`;
}

function rankFromLevel(level: number): string {
  if (level >= 25) return "One Above All";
  if (level >= 21) return "Eternity";
  if (level >= 18) return "Celestial";
  if (level >= 15) return "Grandmaster";
  if (level >= 12) return "Diamond";
  if (level >= 9) return "Platinum";
  if (level >= 6) return "Gold";
  if (level >= 3) return "Silver";
  if (level >= 1) return "Bronze";
  return "Unranked";
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

  // Rank info — decode from season data since rankData.rank is often "Invalid level"
  const rankData = data?.player?.rank;
  const seasons = data?.player?.info?.rank_game_season ?? {};
  const latestSeason = Object.keys(seasons).sort().pop();
  const seasonData = latestSeason ? seasons[latestSeason] : null;
  const maxLevel = seasonData?.max_level ?? 0;

  const rank = {
    name: rankFromLevel(maxLevel),
    tier: maxLevel > 0 ? String(maxLevel) : "",
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
      portraitUrl: h.hero_name ? mrHeroPortrait(h.hero_name) : null,
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
