"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MRPlayer = {
  discordId: string;
  displayName: string;
  division: string;
  inGameRole: string | null;
  rank: string | null;
};

type HeroStat = {
  name: string;
  role: string;
  matchesPlayed: number;
  winRate: number;
  kda: number;
  portraitUrl: string | null;
};

type PlayerStats = {
  username: string;
  rank?: { name: string; tier: string; iconUrl: string | null };
  winRate: number;
  kda: number;
  matchesPlayed: number;
  topHeroes: HeroStat[];
  dataSource: "api" | "manual" | "cached";
  lastUpdated: string;
};

type CardState = {
  stats: PlayerStats | null;
  loading: boolean;
  error: boolean;
  refreshing: boolean;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlayerStatsAdmin({ players }: { players: MRPlayer[] }) {
  const [cards, setCards] = useState<Record<string, CardState>>({});

  // Fetch stats for a single player
  const fetchStats = useCallback(
    async (displayName: string, force = false) => {
      const key = displayName;

      setCards((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] ?? { stats: null, loading: true, error: false, refreshing: false }),
          loading: !force,
          refreshing: force,
          error: false,
        },
      }));

      try {
        const url = `/api/marvel-rivals/player/${encodeURIComponent(displayName)}${force ? "?force=true" : ""}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        setCards((prev) => ({
          ...prev,
          [key]: { stats: json.stats ?? null, loading: false, error: false, refreshing: false },
        }));
      } catch {
        setCards((prev) => ({
          ...prev,
          [key]: { ...prev[key], loading: false, error: true, refreshing: false },
        }));
      }
    },
    [],
  );

  // Initial fetch for all players
  useEffect(() => {
    players.forEach((p) => fetchStats(p.displayName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh all
  function handleRefreshAll() {
    players.forEach((p) => fetchStats(p.displayName, true));
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">
            Admin
          </p>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">
            <span className="text-[#c5d400]">Player Stats</span> Management
          </h1>
          <p className="text-white/35 text-sm mt-1">
            {players.length} Marvel Rivals player{players.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={handleRefreshAll}
          className="px-4 py-2 rounded-xl border border-[#c5d400]/30 text-[#c5d400] text-sm font-bold uppercase tracking-widest hover:bg-[#c5d400]/10 transition-colors self-start"
        >
          Refresh All
        </button>
      </div>

      {/* Player cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => {
          const state = cards[player.displayName] ?? {
            stats: null,
            loading: true,
            error: false,
            refreshing: false,
          };

          return (
            <PlayerCard
              key={player.discordId}
              player={player}
              state={state}
              onRefresh={() => fetchStats(player.displayName, true)}
            />
          );
        })}
      </div>

      {players.length === 0 && (
        <div className="text-center py-16">
          <p className="text-white/30 text-sm">No Marvel Rivals players found.</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PlayerCard
// ---------------------------------------------------------------------------

function PlayerCard({
  player,
  state,
  onRefresh,
}: {
  player: MRPlayer;
  state: CardState;
  onRefresh: () => void;
}) {
  const { stats, loading, error, refreshing } = state;

  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-4">
      {/* Player header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#c5d400]/10 flex items-center justify-center text-[#c5d400] text-sm font-bold flex-shrink-0">
          {player.displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{player.displayName}</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 font-mono">{player.division}</span>
            {player.inGameRole && (
              <span className="text-[10px] text-white/20">{player.inGameRole}</span>
            )}
            {player.rank && (
              <span className="text-[10px] text-[#c5d400]/60 font-medium">{player.rank}</span>
            )}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col gap-2">
          <Skeleton width="70%" height="12px" />
          <Skeleton width="50%" height="12px" />
          <Skeleton width="40%" height="10px" />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <p className="text-red-400/60 text-xs">Failed to load stats</p>
      )}

      {/* Stats display */}
      {!loading && !error && stats && (
        <div className="flex flex-col gap-3">
          {/* Summary line */}
          <p className="text-xs leading-relaxed">
            <span className="text-[#C8E400] font-bold">{Math.round(stats.winRate * 100)}% WR</span>
            <span className="text-white/20"> · </span>
            <span className="text-white font-semibold">{stats.kda.toFixed(1)} KDA</span>
            <span className="text-white/20"> · </span>
            <span className="text-white/50">{stats.matchesPlayed} matches</span>
          </p>

          {/* Rank badge if present */}
          {stats.rank && (
            <div className="flex items-center gap-2">
              {stats.rank.iconUrl && (
                <Image
                  src={stats.rank.iconUrl}
                  alt={stats.rank.name}
                  width={18}
                  height={18}
                  unoptimized
                />
              )}
              <span className="text-xs text-white/60 font-medium">
                {stats.rank.name} {stats.rank.tier}
              </span>
            </div>
          )}

          {/* Top heroes */}
          {stats.topHeroes.length > 0 && (
            <div className="flex flex-col gap-1">
              {stats.topHeroes.slice(0, 3).map((hero) => (
                <div key={hero.name} className="flex items-center gap-2">
                  {hero.portraitUrl ? (
                    <Image
                      src={hero.portraitUrl}
                      alt={hero.name}
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/[0.06] flex-shrink-0" />
                  )}
                  <span className="text-[11px] text-white/50 flex-1 min-w-0 truncate">
                    {hero.name}
                  </span>
                  <span className="text-[11px] text-[#C8E400] font-bold whitespace-nowrap">
                    {Math.round(hero.winRate * 100)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No stats returned */}
      {!loading && !error && !stats && (
        <p className="text-white/20 text-xs">No stats available</p>
      )}

      {/* Footer: last updated + refresh */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
        <span className="text-[10px] text-white/20">
          {stats?.dataSource === "cached" ? "Cached" : stats ? "Live" : "—"}
          {stats?.lastUpdated && (
            <>
              {" · "}
              {new Date(stats.lastUpdated).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </>
          )}
        </span>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="text-[10px] text-white/30 hover:text-[#c5d400] transition-colors disabled:opacity-40 font-medium uppercase tracking-widest"
        >
          {refreshing ? "Refreshing..." : "Force Refresh"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

const shimmerStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #2A2A2A 25%, #333333 50%, #2A2A2A 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
  borderRadius: "3px",
};

function Skeleton({ width, height }: { width: string; height: string }) {
  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ ...shimmerStyle, width, height }} />
    </>
  );
}
