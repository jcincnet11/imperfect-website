"use client";

import { useState } from "react";
import type { Tournament } from "@/lib/management-db";

const GAME_LABEL: Record<string, string> = {
  OW2: "Overwatch 2",
  MR: "Marvel Rivals",
  Both: "OW2 + MR",
};

function formatDate(iso: string | undefined): string {
  if (!iso) return "TBD";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function countdown(iso: string | undefined): { label: string; urgency: "past" | "soon" | "normal" | "tbd" } {
  if (!iso) return { label: "Date TBD", urgency: "tbd" };
  const target = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMs < 0) return { label: `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""} ago`, urgency: "past" };
  if (diffDays === 0) return { label: "Today", urgency: "soon" };
  if (diffDays === 1) return { label: "Tomorrow", urgency: "soon" };
  if (diffDays <= 7) return { label: `In ${diffDays} days`, urgency: "soon" };
  return { label: `In ${diffDays} days`, urgency: "normal" };
}

type Props = {
  active: Tournament[];
  completed: Tournament[];
  canEditNotes: boolean;
};

export default function TournamentPrep({ active: initialActive, completed, canEditNotes }: Props) {
  const [active, setActive] = useState<Tournament[]>(initialActive);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (t: Tournament) => {
    setEditing(t.id);
    setDraft(t.notes ?? "");
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft("");
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    const res = await fetch(`/api/team-hub/tournaments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: draft }),
    });
    if (res.ok) {
      const updated = await res.json();
      setActive((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditing(null);
      setDraft("");
    }
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-black text-white tracking-wide uppercase">
          <span className="text-[#c5d400]">Tournament</span> Prep
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Upcoming events, registration deadlines, and team prep notes.
        </p>
      </div>

      {active.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">
          No upcoming tournaments. Check back when an event is on the calendar.
        </div>
      ) : (
        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3">
            Upcoming &amp; Ongoing
          </h2>
          <div className="flex flex-col gap-3">
            {active.map((t) => {
              const cd = countdown(t.date_start);
              const regCd = t.reg_deadline ? countdown(t.reg_deadline) : null;
              const isEditing = editing === t.id;

              return (
                <div
                  key={t.id}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${
                          t.status === "Ongoing"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-[#c5d400]/15 text-[#c5d400]"
                        }`}>
                          {t.status}
                        </span>
                        <span className="text-[11px] text-white/40">{GAME_LABEL[t.game] ?? t.game}</span>
                        {t.format && <span className="text-[11px] text-white/40">· {t.format}</span>}
                      </div>
                      <h3 className="text-lg font-bold text-white truncate">{t.name}</h3>
                      {t.organizer && (
                        <p className="text-[12px] text-white/40 mt-0.5">by {t.organizer}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold tabular-nums ${
                        cd.urgency === "soon"
                          ? "text-[#c5d400]"
                          : cd.urgency === "past"
                          ? "text-white/30"
                          : "text-white"
                      }`}>
                        {cd.label}
                      </div>
                      <div className="text-[11px] text-white/40 mt-0.5">
                        {formatDate(t.date_start)}
                        {t.date_end && t.date_end !== t.date_start && ` — ${formatDate(t.date_end)}`}
                      </div>
                    </div>
                  </div>

                  {/* Key dates + prize */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {regCd && (
                      <Stat
                        label="Reg Deadline"
                        value={regCd.label}
                        sublabel={formatDate(t.reg_deadline)}
                        urgent={regCd.urgency === "soon"}
                      />
                    )}
                    {t.prize_pool > 0 && (
                      <Stat
                        label="Prize Pool"
                        value={`$${t.prize_pool.toLocaleString()}`}
                      />
                    )}
                    {t.entry_fee > 0 && (
                      <Stat
                        label="Entry Fee"
                        value={`$${t.entry_fee.toLocaleString()}`}
                      />
                    )}
                  </div>

                  {/* Prep notes */}
                  <div className="border-t border-white/[0.04] pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[11px] font-bold tracking-widest uppercase text-white/50">
                        Prep Notes
                      </h4>
                      {canEditNotes && !isEditing && (
                        <button
                          onClick={() => startEdit(t)}
                          className="text-[11px] font-semibold text-white/50 hover:text-white transition-colors"
                        >
                          {t.notes ? "Edit" : "Add"}
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder="Study targets, opponent notes, comp plans, VOD links…"
                          rows={6}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg p-3 text-sm text-white placeholder:text-white/20 focus:border-[#c5d400]/40 focus:outline-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={cancelEdit}
                            disabled={saving}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/50 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(t.id)}
                            disabled={saving}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#c5d400] text-black hover:bg-[#d4e600] transition-colors disabled:opacity-50"
                          >
                            {saving ? "Saving…" : "Save"}
                          </button>
                        </div>
                      </div>
                    ) : t.notes ? (
                      <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{t.notes}</p>
                    ) : (
                      <p className="text-sm text-white/30 italic">No prep notes yet.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3">
            Recent Results
          </h2>
          <div className="flex flex-col gap-1.5">
            {completed.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{t.name}</div>
                  <div className="text-[11px] text-white/40 mt-0.5">
                    {GAME_LABEL[t.game] ?? t.game} · {formatDate(t.date_start)}
                  </div>
                </div>
                {t.placement && (
                  <div className="text-sm font-mono text-[#c5d400] tabular-nums">{t.placement}</div>
                )}
                {(t.wins > 0 || t.losses > 0) && (
                  <div className="text-sm font-mono text-white/70 tabular-nums">
                    {t.wins}-{t.losses}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, sublabel, urgent }: { label: string; value: string; sublabel?: string; urgent?: boolean }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3">
      <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-1">{label}</div>
      <div className={`text-sm font-bold tabular-nums ${urgent ? "text-[#c5d400]" : "text-white"}`}>{value}</div>
      {sublabel && <div className="text-[11px] text-white/40 mt-0.5">{sublabel}</div>}
    </div>
  );
}
