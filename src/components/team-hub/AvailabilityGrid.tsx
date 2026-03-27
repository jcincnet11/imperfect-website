"use client";

import { useState, useCallback } from "react";
import type { Availability, Player } from "@/lib/db";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Status = "AVAILABLE" | "UNAVAILABLE" | "UNSURE";

const STATUS_CONFIG: Record<Status, { label: string; emoji: string; bg: string; border: string; text: string }> = {
  AVAILABLE:   { label: "Available",   emoji: "✓", bg: "rgba(39,174,96,0.15)",  border: "rgba(39,174,96,0.4)",  text: "#27AE60" },
  UNAVAILABLE: { label: "Unavailable", emoji: "✕", bg: "rgba(231,76,60,0.12)",  border: "rgba(231,76,60,0.35)", text: "#E74C3C" },
  UNSURE:      { label: "Unsure",      emoji: "?", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.35)" },
};

const STATUS_CYCLE: Status[] = ["AVAILABLE", "UNAVAILABLE", "UNSURE"];

type Props = {
  initialAvailability: Availability[];
  players: Player[];
  weekStart: string;
  currentDiscordId: string;
  isCoachOrAdmin: boolean;
};

export default function AvailabilityGrid({
  initialAvailability,
  players,
  weekStart,
  currentDiscordId,
  isCoachOrAdmin,
}: Props) {
  const [availability, setAvailability] = useState<Availability[]>(initialAvailability);
  const [saving, setSaving] = useState<string | null>(null); // key = `discordId-day`

  const getStatus = useCallback(
    (discordId: string, day: string): Status =>
      (availability.find(
        (a) => a.player_discord_id === discordId && a.day === day
      )?.status as Status) ?? "UNSURE",
    [availability]
  );

  async function toggleStatus(discordId: string, day: string) {
    if (!isCoachOrAdmin && discordId !== currentDiscordId) return;
    const key = `${discordId}-${day}`;
    setSaving(key);

    const current = getStatus(discordId, day);
    const nextStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
    const existing = availability.find(
      (a) => a.player_discord_id === discordId && a.day === day
    );

    // Optimistic update
    setAvailability((prev) => {
      const next = prev.filter(
        (a) => !(a.player_discord_id === discordId && a.day === day)
      );
      return [...next, {
        id: existing?.id ?? crypto.randomUUID(),
        week_start: weekStart,
        player_discord_id: discordId,
        day: day as Availability["day"],
        status: nextStatus,
      }];
    });

    try {
      await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: existing?.id,
          week_start: weekStart,
          player_discord_id: discordId,
          day,
          status: nextStatus,
        }),
      });
    } catch {
      // Revert on error
      setAvailability((prev) => {
        const next = prev.filter(
          (a) => !(a.player_discord_id === discordId && a.day === day)
        );
        if (existing) return [...next, existing];
        return next;
      });
    } finally {
      setSaving(null);
    }
  }

  // For players, show only their own row
  const displayPlayers = isCoachOrAdmin
    ? players
    : players.filter((p) => p.discord_id === currentDiscordId);

  // If player isn't in the players table yet, show a synthetic row
  const selfInList = displayPlayers.some((p) => p.discord_id === currentDiscordId);
  const rows = !isCoachOrAdmin && !selfInList
    ? [{ discord_id: currentDiscordId, display_name: "You", division: "—", role: "player" as const, is_admin: false }]
    : displayPlayers;

  return (
    <div>
      {/* Summary legend */}
      <div className="flex flex-wrap gap-4 mb-5">
        {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div key={s} className="flex items-center gap-1.5">
              <span
                className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
              >
                {cfg.emoji}
              </span>
              <span className="text-xs text-white/40">{cfg.label}</span>
            </div>
          );
        })}
        <span className="text-xs text-white/25 ml-auto">Click to toggle · Auto-saves</span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          {/* Header */}
          <div
            className="grid mb-1"
            style={{ gridTemplateColumns: isCoachOrAdmin ? "160px repeat(7, 1fr)" : "1fr repeat(7, 1fr)" }}
          >
            {isCoachOrAdmin && <div />}
            {DAYS.map((day, i) => (
              <div key={day} className="text-center text-[11px] font-semibold text-white/35 uppercase tracking-wider pb-2">
                {DAY_LABELS[i]}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((player) => (
            <div
              key={player.discord_id}
              className="grid items-center border-t border-white/[0.05]"
              style={{ gridTemplateColumns: isCoachOrAdmin ? "160px repeat(7, 1fr)" : "1fr repeat(7, 1fr)" }}
            >
              {isCoachOrAdmin && (
                <div className="py-2 pr-3">
                  <p className="text-xs text-white/70 font-medium truncate">{player.display_name}</p>
                  <p className="text-[10px] text-white/25 capitalize">{player.role} · {player.division}</p>
                </div>
              )}
              {DAYS.map((day) => {
                const status = getStatus(player.discord_id, day);
                const cfg = STATUS_CONFIG[status];
                const key = `${player.discord_id}-${day}`;
                const isSaving = saving === key;
                const canToggle = isCoachOrAdmin || player.discord_id === currentDiscordId;

                return (
                  <div key={day} className="flex items-center justify-center py-1.5 px-0.5">
                    <button
                      onClick={() => toggleStatus(player.discord_id, day)}
                      disabled={!canToggle || isSaving}
                      className="w-full h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all disabled:cursor-default"
                      style={{
                        backgroundColor: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        color: cfg.text,
                        opacity: isSaving ? 0.5 : 1,
                      }}
                      title={canToggle ? `Click to change: ${cfg.label}` : cfg.label}
                    >
                      {isSaving ? (
                        <span className="animate-spin text-xs">◌</span>
                      ) : (
                        cfg.emoji
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Summary row for coaches */}
      {isCoachOrAdmin && rows.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <p className="text-[11px] text-white/30 font-semibold uppercase tracking-widest mb-2">Availability summary</p>
          <div className="grid" style={{ gridTemplateColumns: "160px repeat(7, 1fr)" }}>
            <div className="text-xs text-white/25">Players available</div>
            {DAYS.map((day) => {
              const count = rows.filter((p) => getStatus(p.discord_id, day) === "AVAILABLE").length;
              const total = rows.length;
              return (
                <div key={day} className="text-center">
                  <span
                    className="text-xs font-bold"
                    style={{ color: count >= total * 0.7 ? "#27AE60" : count >= total * 0.4 ? "#E67E22" : "#E74C3C" }}
                  >
                    {count}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
