"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Types (mirrors the API response shape from /api/marvel-rivals/player/[ign])
// ---------------------------------------------------------------------------

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
  winRate: number;
  kda: number;
  matchesPlayed: number;
  topHeroes: HeroStat[];
  dataSource: "api" | "manual" | "cached";
  lastUpdated: string;
};

// ---------------------------------------------------------------------------
// Shimmer skeleton
// ---------------------------------------------------------------------------

const shimmerStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #2A2A2A 25%, #333333 50%, #2A2A2A 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
  borderRadius: "3px",
};

function Skeleton({ width, height }: { width: string; height: string }) {
  return <div style={{ ...shimmerStyle, width, height }} />;
}

// ---------------------------------------------------------------------------
// PlayerStatsSection
// ---------------------------------------------------------------------------

export default function PlayerStatsSection({
  ign,
  division,
}: {
  ign: string;
  division: "OW2" | "MR";
}) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (division !== "MR") {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch(`/api/marvel-rivals/player/${encodeURIComponent(ign)}`);
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        if (!cancelled) {
          setStats(json.stats ?? null);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, [ign, division]);

  // Don't render anything for OW2
  if (division !== "MR") return null;

  // Loading state
  if (loading) {
    return (
      <>
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
        <div style={{ borderTop: "1px solid #2A2A2A", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <Skeleton width="70%" height="12px" />
          <Skeleton width="50%" height="12px" />
          <Skeleton width="40%" height="10px" />
        </div>
      </>
    );
  }

  // Error or no stats — graceful degradation
  if (error || !stats) return null;

  const winPct = Math.round(stats.winRate * 100);
  const kdaStr = stats.kda.toFixed(1);
  const trackerHref = `https://tracker.gg/marvel-rivals/profile/ign/${encodeURIComponent(ign)}/overview`;

  const updatedAt = stats.lastUpdated
    ? new Date(stats.lastUpdated).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div
        style={{
          borderTop: "1px solid #2A2A2A",
          paddingTop: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* ── Summary line ── */}
        <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.4 }}>
          <span style={{ color: "#C8E400", fontWeight: 700 }}>{winPct}% WR</span>
          <span style={{ color: "#555555" }}> &middot; </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>{kdaStr} KDA</span>
          <span style={{ color: "#555555" }}> &middot; </span>
          <span style={{ color: "#888888" }}>{stats.matchesPlayed} matches</span>
        </p>

        {/* ── Top 3 heroes (live) ── */}
        {stats.topHeroes.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {stats.topHeroes.slice(0, 3).map((hero) => (
              <div
                key={hero.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {hero.portraitUrl ? (
                  <Image
                    src={hero.portraitUrl}
                    alt={hero.name}
                    width={20}
                    height={20}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                    unoptimized
                  />
                ) : (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "#2A2A2A",
                      flexShrink: 0,
                    }}
                  />
                )}
                <span style={{ fontSize: "11px", color: "#888888", flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {hero.name}
                </span>
                <span style={{ fontSize: "11px", color: "#C8E400", fontWeight: 700, whiteSpace: "nowrap" }}>
                  {Math.round(hero.winRate * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer: tracker link + data source ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a
            href={trackerHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "10px",
              color: "#555555",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#C8E400"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#555555"; }}
          >
            View on tracker.gg &rarr;
          </a>
          <span style={{ fontSize: "10px", color: "#444444" }}>
            {stats.dataSource === "cached" ? "Cached" : "Live"}
            {updatedAt && <> &middot; {updatedAt}</>}
          </span>
        </div>
      </div>
    </>
  );
}
