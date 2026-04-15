"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
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
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

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

  const divisions = Array.from(new Set(players.map((p) => p.division))).sort();
  const roles = Array.from(
    new Set(players.map((p) => p.inGameRole).filter((r): r is string => Boolean(r))),
  ).sort();

  const filteredPlayers = players.filter((p) => {
    if (divisionFilter !== "all" && p.division !== divisionFilter) return false;
    if (roleFilter !== "all" && p.inGameRole !== roleFilter) return false;
    return true;
  });

  function handleExportCsv() {
    const header = [
      "Player", "Division", "Role", "Rank Tier", "Rank Name",
      "Win Rate %", "KDA", "Matches Played", "Data Source", "Last Updated",
      "Hero 1", "Hero 1 WR %", "Hero 1 KDA", "Hero 1 Matches",
      "Hero 2", "Hero 2 WR %", "Hero 2 KDA", "Hero 2 Matches",
      "Hero 3", "Hero 3 WR %", "Hero 3 KDA", "Hero 3 Matches",
    ];
    const rows = filteredPlayers.map((p) => {
      const s = cards[p.displayName]?.stats;
      const heroCells = (idx: number) => {
        const h = s?.topHeroes?.[idx];
        return h
          ? [h.name, (h.winRate * 100).toFixed(1), h.kda.toFixed(2), String(h.matchesPlayed)]
          : ["", "", "", ""];
      };
      return [
        p.displayName,
        p.division,
        p.inGameRole ?? "",
        s?.rank?.tier ?? "",
        s?.rank?.name ?? "",
        s ? (s.winRate * 100).toFixed(1) : "",
        s ? s.kda.toFixed(2) : "",
        s ? String(s.matchesPlayed) : "",
        s?.dataSource ?? "",
        s?.lastUpdated ?? "",
        ...heroCells(0),
        ...heroCells(1),
        ...heroCells(2),
      ];
    });
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `imperfect-mr-stats-${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            Showing {filteredPlayers.length} of {players.length} Marvel Rivals player{players.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-2 self-start">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl border border-white/15 text-white/70 text-sm font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={handleRefreshAll}
            className="px-4 py-2 rounded-xl border border-[#c5d400]/30 text-[#c5d400] text-sm font-bold uppercase tracking-widest hover:bg-[#c5d400]/10 transition-colors"
          >
            Refresh All
          </button>
        </div>
      </div>

      {/* Filters */}
      {(divisions.length > 1 || roles.length > 1) && (
        <div className="flex flex-wrap gap-4 mb-6">
          {divisions.length > 1 && (
            <FilterGroup
              label="Division"
              options={["all", ...divisions]}
              value={divisionFilter}
              onChange={setDivisionFilter}
            />
          )}
          {roles.length > 1 && (
            <FilterGroup
              label="Role"
              options={["all", ...roles]}
              value={roleFilter}
              onChange={setRoleFilter}
            />
          )}
        </div>
      )}

      {/* Player cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlayers.map((player) => {
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

type OverrideHero = { name: string; role: string; matchesPlayed: number; winRate: number; kda: number };

type OverrideForm = {
  use_override: boolean;
  rank_name: string;
  win_rate: string;
  kda: string;
  matches: string;
  top_heroes: OverrideHero[];
};

const EMPTY_HERO: OverrideHero = { name: "", role: "Duelist", matchesPlayed: 0, winRate: 0, kda: 0 };

function defaultOverrideForm(): OverrideForm {
  return {
    use_override: false,
    rank_name: "",
    win_rate: "",
    kda: "",
    matches: "",
    top_heroes: [{ ...EMPTY_HERO }, { ...EMPTY_HERO }, { ...EMPTY_HERO }],
  };
}

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
  const [showOverride, setShowOverride] = useState(false);
  const [form, setForm] = useState<OverrideForm>(defaultOverrideForm);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  function updateHero(idx: number, field: keyof OverrideHero, value: string | number) {
    setForm((prev) => {
      const heroes = [...prev.top_heroes];
      heroes[idx] = { ...heroes[idx], [field]: value };
      return { ...prev, top_heroes: heroes };
    });
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch("/api/admin/stats-override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discord_id: player.discordId,
          mr_username: player.displayName,
          use_override: form.use_override,
          rank_name: form.rank_name || null,
          win_rate: form.win_rate ? parseFloat(form.win_rate) : null,
          kda: form.kda ? parseFloat(form.kda) : null,
          matches: form.matches ? parseInt(form.matches, 10) : null,
          top_heroes: form.top_heroes.filter((h) => h.name.trim() !== ""),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaveMsg("Saved");
    } catch {
      setSaveMsg("Error saving override");
    } finally {
      setSaving(false);
    }
  }

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

          {/* Data source badge */}
          {stats.dataSource === "manual" && (
            <span className="text-[10px] text-orange-400/70 font-medium">Manual Override Active</span>
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
          {stats?.dataSource === "cached" ? "Cached" : stats?.dataSource === "manual" ? "Manual" : stats ? "Live" : "—"}
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

      {/* Override toggle */}
      <div className="pt-2 border-t border-white/[0.06]">
        <button
          onClick={() => setShowOverride((v) => !v)}
          className="text-[11px] text-white/40 hover:text-[#c5d400] transition-colors font-medium uppercase tracking-widest"
        >
          {showOverride ? "Hide Override" : "Manual Override"}
        </button>
      </div>

      {/* Override form */}
      {showOverride && (
        <form onSubmit={handleSave} className="flex flex-col gap-3 pt-2 border-t border-white/[0.06]">
          {/* Use override toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.use_override}
              onChange={(e) => setForm((f) => ({ ...f, use_override: e.target.checked }))}
              className="accent-[#c5d400]"
            />
            <span className="text-xs text-white/60">Use Manual Override</span>
          </label>

          {form.use_override && (
            <>
              {/* Core stats */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">Rank</label>
                  <input
                    type="text"
                    placeholder="e.g. Diamond 3"
                    value={form.rank_name}
                    onChange={(e) => setForm((f) => ({ ...f, rank_name: e.target.value }))}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#c5d400]/40"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">Win Rate %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="e.g. 58.5"
                    value={form.win_rate}
                    onChange={(e) => setForm((f) => ({ ...f, win_rate: e.target.value }))}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#c5d400]/40"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">KDA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 3.2"
                    value={form.kda}
                    onChange={(e) => setForm((f) => ({ ...f, kda: e.target.value }))}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#c5d400]/40"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">Matches</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 200"
                    value={form.matches}
                    onChange={(e) => setForm((f) => ({ ...f, matches: e.target.value }))}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#c5d400]/40"
                  />
                </div>
              </div>

              {/* Top Heroes */}
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-2">Top Heroes</label>
                <div className="flex flex-col gap-2">
                  {form.top_heroes.map((hero, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-1.5 items-end">
                      <input
                        type="text"
                        placeholder="Hero name"
                        value={hero.name}
                        onChange={(e) => updateHero(i, "name", e.target.value)}
                        className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#c5d400]/40"
                      />
                      <select
                        value={hero.role}
                        onChange={(e) => updateHero(i, "role", e.target.value)}
                        className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-1.5 py-1.5 text-xs text-white outline-none focus:border-[#c5d400]/40"
                      >
                        <option value="Vanguard">Vanguard</option>
                        <option value="Duelist">Duelist</option>
                        <option value="Strategist">Strategist</option>
                      </select>
                      <input
                        type="number"
                        min="0"
                        placeholder="WR%"
                        value={hero.winRate || ""}
                        onChange={(e) => updateHero(i, "winRate", parseFloat(e.target.value) || 0)}
                        className="w-16 bg-white/[0.05] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#c5d400]/40"
                      />
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="KDA"
                        value={hero.kda || ""}
                        onChange={(e) => updateHero(i, "kda", parseFloat(e.target.value) || 0)}
                        className="w-16 bg-white/[0.05] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#c5d400]/40"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <button
                type="submit"
                disabled={saving}
                className="mt-1 px-4 py-2 rounded-xl bg-[#c5d400]/20 border border-[#c5d400]/30 text-[#c5d400] text-xs font-bold uppercase tracking-widest hover:bg-[#c5d400]/30 transition-colors disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save Override"}
              </button>
              {saveMsg && (
                <p className={`text-[11px] ${saveMsg === "Saved" ? "text-green-400/70" : "text-red-400/70"}`}>
                  {saveMsg}
                </p>
              )}
            </>
          )}
        </form>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter pill group
// ---------------------------------------------------------------------------

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                active
                  ? "bg-[#c5d400]/15 text-[#c5d400] border border-[#c5d400]/30"
                  : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white/80"
              }`}
            >
              {opt === "all" ? "All" : opt}
            </button>
          );
        })}
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
