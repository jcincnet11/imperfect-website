"use client";

import { useEffect, useState } from "react";

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
  rank?: { name: string; tier: string; iconUrl: string | null };
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
  discordId,
}: {
  ign: string;
  division: "OW2" | "MR";
  discordId?: string;
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
        const qp = discordId ? `?discord_id=${encodeURIComponent(discordId)}` : "";
        const res = await fetch(`/api/marvel-rivals/player/${encodeURIComponent(ign)}${qp}`);
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
  }, [ign, division, discordId]);

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
        {/* ── Rank badge ── */}
        {stats.rank && stats.rank.name && stats.rank.name !== "Unranked" && (
          <span style={{
            display: "inline-block",
            background: "#C8E400",
            color: "#111111",
            borderRadius: "999px",
            fontSize: "10px",
            fontWeight: 700,
            fontFamily: "var(--font-barlow), sans-serif",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "2px 8px",
            width: "fit-content",
          }}>
            {stats.rank.name}
          </span>
        )}

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
          <div>
            <p style={{
              fontSize: "10px",
              color: "#C8E400",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 700,
              fontFamily: "var(--font-barlow), sans-serif",
              marginBottom: "8px",
              margin: 0,
              marginTop: "4px",
            }}>
              Top Heroes
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
              {stats.topHeroes.slice(0, 3).map((hero, i) => (
                <div
                  key={hero.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    paddingLeft: i === 0 ? "8px" : "0",
                    borderLeft: i === 0 ? "3px solid #C8E400" : "3px solid transparent",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.portraitUrl ?? ""}
                    alt={hero.name}
                    width={i === 0 ? 28 : 24}
                    height={i === 0 ? 28 : 24}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      objectPosition: "top",
                      flexShrink: 0,
                      background: "#2A2A2A",
                    }}
                    onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                  />
                  <span className="font-heading font-bold" style={{
                    fontSize: i === 0 ? "13px" : "11px",
                    color: "#FFFFFF",
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textTransform: "capitalize",
                  }}>
                    {hero.name}
                  </span>
                  <span style={{ fontSize: "10px", color: "#555555", whiteSpace: "nowrap" }}>
                    {hero.matchesPlayed}m
                  </span>
                  <span style={{
                    fontSize: "11px",
                    color: "#C8E400",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-barlow), sans-serif",
                    minWidth: "30px",
                    textAlign: "right",
                  }}>
                    {Math.round(hero.winRate * 100)}%
                  </span>
                </div>
              ))}
            </div>
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
