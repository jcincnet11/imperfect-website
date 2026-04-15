"use client";

import { useState, useMemo, type ReactElement } from "react";
import Link from "next/link";
import type { Scrim, Lineup, LineupSlot } from "@/lib/db";
import { rolesForGame, expectedSlotRoles, type Game } from "@/lib/lineup-rules";

type RosterPlayer = {
  discord_id: string;
  display_name: string;
  in_game_role: string | null;
};

type Props = {
  scrim: Scrim;
  players: RosterPlayer[];
  initialLineup: Lineup | null;
  canEdit: boolean;
};

function formatScrimDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Puerto_Rico" })} at ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "America/Puerto_Rico" })} AST`;
}

export default function LineupBuilder({ scrim, players, initialLineup, canEdit }: Props) {
  const game = scrim.game as Game;
  const roles = rolesForGame(game);
  const expected = expectedSlotRoles(game);

  // Slot state: array of LineupSlot (or empty placeholders) aligned with expected roles
  const [slots, setSlots] = useState<(LineupSlot | null)[]>(() => {
    if (initialLineup && initialLineup.slots.length === expected.length) {
      return initialLineup.slots;
    }
    return expected.map((role) => ({ player_discord_id: "", role }));
  });

  const [notes, setNotes] = useState<string>(initialLineup?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSlotPlayer = (index: number, discordId: string) => {
    setSlots((prev) => prev.map((s, i) =>
      i === index ? { ...(s ?? { role: expected[index] }), player_discord_id: discordId } as LineupSlot : s,
    ));
    setSaved(false);
  };

  const usedPlayers = useMemo(
    () => new Set(slots.map((s) => s?.player_discord_id).filter(Boolean) as string[]),
    [slots],
  );

  const isComplete = slots.every((s) => s && s.player_discord_id);
  const hasDuplicates = (() => {
    const ids = slots.map((s) => s?.player_discord_id).filter(Boolean) as string[];
    return new Set(ids).size !== ids.length;
  })();

  const submit = async () => {
    setError(null);
    if (!isComplete) {
      setError("Fill all slots before submitting.");
      return;
    }
    if (hasDuplicates) {
      setError("A player can't fill two slots.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/lineups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scrim_id: scrim.id,
        slots,
        notes: notes.trim() || null,
        status: "submitted",
      }),
    });
    if (res.ok) {
      setSaved(true);
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Failed to save lineup.");
    }
    setSaving(false);
  };

  // Render slots grouped by role so the UI shows "1 Tank, 2 DPS, 2 Support" structure
  let flatIndex = 0;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/team-hub/scrims"
          className="text-[11px] font-semibold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          ← Back to Scrims
        </Link>
        <h1 className="font-heading text-3xl font-black text-white tracking-wide uppercase mt-2">
          <span className="text-[#c5d400]">Lineup</span> Builder
        </h1>
        <div className="mt-2 flex flex-wrap gap-2 items-center text-sm text-white/60">
          <span className="font-semibold text-white">vs {scrim.opponent_org}</span>
          <span className="text-white/30">·</span>
          <span>{game === "OW2" ? "Overwatch 2" : "Marvel Rivals"}</span>
          <span className="text-white/30">·</span>
          <span>{scrim.division}</span>
          {scrim.format && <><span className="text-white/30">·</span><span>{scrim.format}</span></>}
        </div>
        <p className="text-xs text-white/40 mt-1">{formatScrimDateTime(scrim.scheduled_at)}</p>
      </div>

      {initialLineup?.status === "approved" && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/25 text-green-400 text-sm font-semibold">
          ✓ Lineup approved
        </div>
      )}

      {/* Role groups */}
      <div className="flex flex-col gap-5 mb-6">
        {roles.map((role) => {
          const slotsForRole: ReactElement[] = [];
          for (let i = 0; i < role.count; i++) {
            const idx = flatIndex++;
            const current = slots[idx]?.player_discord_id ?? "";
            slotsForRole.push(
              <div key={idx} className="flex items-center gap-3">
                <div className="w-20 text-[11px] font-bold tracking-widest uppercase text-white/40">
                  Slot {idx + 1}
                </div>
                <select
                  value={current}
                  onChange={(e) => setSlotPlayer(idx, e.target.value)}
                  disabled={!canEdit || saving}
                  className="flex-1 bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:border-[#c5d400]/40 focus:outline-none disabled:opacity-60"
                >
                  <option value="">— Select player —</option>
                  {players.map((p) => {
                    const isUsedElsewhere = usedPlayers.has(p.discord_id) && p.discord_id !== current;
                    const roleNote = p.in_game_role && p.in_game_role !== role.key
                      ? ` (usually ${p.in_game_role})`
                      : "";
                    return (
                      <option
                        key={p.discord_id}
                        value={p.discord_id}
                        disabled={isUsedElsewhere}
                      >
                        {p.display_name}{roleNote}{isUsedElsewhere ? " — already used" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>,
            );
          }
          return (
            <div
              key={role.key}
              className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5"
            >
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  {role.label}
                </h3>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/30">
                  {role.count} slot{role.count > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">{slotsForRole}</div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-[11px] font-bold tracking-widest uppercase text-white/40 mb-2">
          Notes <span className="text-white/25">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
          disabled={!canEdit || saving}
          rows={3}
          maxLength={2000}
          placeholder="Hero preferences, map-specific swaps, strategy notes…"
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#c5d400]/40 focus:outline-none disabled:opacity-60"
        />
      </div>

      {error && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-[#c5d400]/10 border border-[#c5d400]/25 text-[#c5d400] text-sm font-semibold">
          Lineup saved and posted to Discord.
        </div>
      )}

      {canEdit && (
        <div className="flex gap-3 justify-end">
          <Link
            href="/team-hub/scrims"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={submit}
            disabled={saving || !isComplete}
            className="px-5 py-2 rounded-lg text-sm font-bold bg-[#c5d400] text-black hover:bg-[#d4e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : initialLineup ? "Update Lineup" : "Submit Lineup"}
          </button>
        </div>
      )}

      {!canEdit && (
        <p className="text-center text-sm text-white/40 italic">
          Read-only — only Captains, Head Coaches, and higher can edit lineups.
        </p>
      )}
    </div>
  );
}
