"use client";

import { useState, useMemo } from "react";
import type { Scrim } from "@/lib/db";

const GAME_LABEL: Record<string, string> = { OW2: "Overwatch 2", MR: "Marvel Rivals" };

type Props = { scrims: Scrim[] };

type H2H = {
  opponent: string;
  total: number;
  wins: number;
  losses: number;
  draws: number;
  lastPlayed: string;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function buildH2H(scrims: Scrim[]): H2H[] {
  const map = new Map<string, H2H>();
  for (const s of scrims) {
    const key = s.opponent_org.trim();
    if (!map.has(key)) {
      map.set(key, { opponent: key, total: 0, wins: 0, losses: 0, draws: 0, lastPlayed: s.scheduled_at });
    }
    const h = map.get(key)!;
    h.total += 1;
    if (s.result === "W") h.wins += 1;
    else if (s.result === "L") h.losses += 1;
    else if (s.result === "Draw") h.draws += 1;
    if (new Date(s.scheduled_at) > new Date(h.lastPlayed)) h.lastPlayed = s.scheduled_at;
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total || b.wins - a.wins);
}

export default function MatchHistory({ scrims }: Props) {
  const [gameFilter, setGameFilter] = useState<"all" | "OW2" | "MR">("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");

  const divisions = useMemo(
    () => Array.from(new Set(scrims.map((s) => s.division))),
    [scrims],
  );

  const filtered = useMemo(() => {
    return scrims.filter((s) => {
      if (gameFilter !== "all" && s.game !== gameFilter) return false;
      if (divisionFilter !== "all" && s.division !== divisionFilter) return false;
      return true;
    }).sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
  }, [scrims, gameFilter, divisionFilter]);

  const record = useMemo(() => {
    const r = { wins: 0, losses: 0, draws: 0 };
    for (const s of filtered) {
      if (s.result === "W") r.wins += 1;
      else if (s.result === "L") r.losses += 1;
      else if (s.result === "Draw") r.draws += 1;
    }
    return r;
  }, [filtered]);

  const h2h = useMemo(() => buildH2H(filtered), [filtered]);

  const totalDecided = record.wins + record.losses + record.draws;
  const winRate = totalDecided > 0 ? Math.round((record.wins / totalDecided) * 100) : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-black text-white tracking-wide uppercase">
          <span className="text-[#c5d400]">Match</span> History
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Completed scrims and head-to-head records. All times in Puerto Rico (AST).
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "OW2", "MR"] as const).map((g) => {
          const count = g === "all" ? scrims.length : scrims.filter((s) => s.game === g).length;
          const active = gameFilter === g;
          return (
            <button
              key={g}
              onClick={() => setGameFilter(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-colors ${
                active
                  ? "bg-[#c5d400]/15 text-[#c5d400] border border-[#c5d400]/30"
                  : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white/80"
              }`}
            >
              {g === "all" ? "All Games" : GAME_LABEL[g]} <span className="opacity-50">({count})</span>
            </button>
          );
        })}
        {divisions.length > 1 && (
          <>
            <div className="w-px bg-white/10 mx-1" />
            {["all", ...divisions].map((d) => {
              const active = divisionFilter === d;
              return (
                <button
                  key={d}
                  onClick={() => setDivisionFilter(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-colors ${
                    active
                      ? "bg-[#c5d400]/15 text-[#c5d400] border border-[#c5d400]/30"
                      : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white/80"
                  }`}
                >
                  {d === "all" ? "All Divisions" : d}
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* Record summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Record" value={`${record.wins}-${record.losses}${record.draws > 0 ? `-${record.draws}` : ""}`} />
        <StatCard label="Win Rate" value={totalDecided > 0 ? `${winRate}%` : "—"} />
        <StatCard label="Total Matches" value={String(filtered.length)} />
        <StatCard label="Opponents" value={String(h2h.length)} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">
          No completed matches in this filter.
        </div>
      ) : (
        <>
          {/* H2H */}
          <section className="mb-10">
            <h2 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3">
              Head-to-Head
            </h2>
            <div className="flex flex-col gap-1.5">
              {h2h.map((h) => {
                const decided = h.wins + h.losses + h.draws;
                const wr = decided > 0 ? Math.round((h.wins / decided) * 100) : 0;
                return (
                  <div
                    key={h.opponent}
                    className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{h.opponent}</div>
                      <div className="text-[11px] text-white/30 mt-0.5">Last played {formatDate(h.lastPlayed)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono tabular-nums">
                        <span className="text-green-400">{h.wins}</span>
                        <span className="text-white/30">-</span>
                        <span className="text-red-400">{h.losses}</span>
                        {h.draws > 0 && (
                          <>
                            <span className="text-white/30">-</span>
                            <span className="text-white/50">{h.draws}</span>
                          </>
                        )}
                      </div>
                      <div className="text-[11px] text-white/40 mt-0.5">
                        {decided > 0 ? `${wr}% WR` : "No result"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Match list */}
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3">
              All Matches
            </h2>
            <div className="flex flex-col gap-1.5">
              {filtered.map((s) => (
                <MatchRow key={s.id} scrim={s} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
      <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-1">{label}</div>
      <div className="text-2xl font-black text-white tabular-nums">{value}</div>
    </div>
  );
}

function MatchRow({ scrim }: { scrim: Scrim }) {
  const resultStyle = scrim.result === "W"
    ? "text-green-400 bg-green-500/10"
    : scrim.result === "L"
    ? "text-red-400 bg-red-500/10"
    : scrim.result === "Draw"
    ? "text-white/60 bg-white/[0.05]"
    : "text-white/30 bg-white/[0.02]";

  const resultLabel = scrim.result ?? "—";

  return (
    <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black ${resultStyle}`}>
        {resultLabel}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">
          vs {scrim.opponent_org}
        </div>
        <div className="text-[11px] text-white/40 mt-0.5">
          {GAME_LABEL[scrim.game]} · {scrim.division}
          {scrim.format ? ` · ${scrim.format}` : ""}
          {" · "}{formatDate(scrim.scheduled_at)}
        </div>
      </div>
      {scrim.score && (
        <div className="text-sm font-mono text-white/70 tabular-nums">{scrim.score}</div>
      )}
    </div>
  );
}
