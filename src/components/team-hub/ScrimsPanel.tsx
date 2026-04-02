"use client";

import { useState } from "react";
import type { Scrim, Player, Availability } from "@/lib/db";
import type { OrgRole } from "@/lib/permissions";

type Props = {
  scrims: Scrim[];
  players: Player[];
  availability: Availability[];
  orgRole: OrgRole;
  currentDiscordId: string;
  canManage: boolean;
};

const STATUS_COLORS: Record<Scrim["status"], string> = {
  Pending:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Confirmed: "text-green-400 bg-green-400/10 border-green-400/20",
  Cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  Completed: "text-white/40 bg-white/[0.04] border-white/[0.08]",
};

const RESULT_COLORS: Record<string, string> = {
  W:    "text-green-400",
  L:    "text-red-400",
  Draw: "text-yellow-400",
};

const DAYS = ["MON","TUE","WED","THU","FRI","SAT","SUN"] as const;

type ScrimFormData = {
  game: "OW2" | "MR";
  division: string;
  opponent_org: string;
  scheduled_at: string;
  format: string;
  status: Scrim["status"];
  notes: string;
};

const blankForm = (): ScrimFormData => ({
  game: "MR",
  division: "IMPerfect",
  opponent_org: "",
  scheduled_at: "",
  format: "Best of 3",
  status: "Pending",
  notes: "",
});

export default function ScrimsPanel({ scrims, players, availability, orgRole, currentDiscordId, canManage }: Props) {
  const [localScrims, setLocalScrims] = useState(scrims);
  const [form, setForm] = useState<ScrimFormData>(blankForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logModal, setLogModal] = useState<Scrim | null>(null);
  const [logResult, setLogResult] = useState<{ result: Scrim["result"]; score: string; notes: string }>({ result: "W", score: "", notes: "" });

  const upcoming = localScrims.filter((s) => s.status !== "Cancelled" && s.status !== "Completed");
  const past = localScrims.filter((s) => s.status === "Completed" || s.status === "Cancelled");

  function openEdit(scrim: Scrim) {
    setForm({
      game: scrim.game,
      division: scrim.division,
      opponent_org: scrim.opponent_org,
      scheduled_at: scrim.scheduled_at.slice(0, 16), // datetime-local format
      format: scrim.format ?? "",
      status: scrim.status,
      notes: scrim.notes ?? "",
    });
    setEditingId(scrim.id);
    setShowForm(true);
  }

  function openCreate() {
    setForm(blankForm());
    setEditingId(null);
    setShowForm(true);
  }

  async function handleSubmit() {
    setSaving(true);
    const payload = { ...form, scheduled_at: new Date(form.scheduled_at).toISOString() };

    if (editingId) {
      const res = await fetch(`/api/scrims/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json() as Scrim;
        setLocalScrims((prev) => prev.map((s) => s.id === editingId ? updated : s));
      }
    } else {
      const res = await fetch("/api/scrims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json() as Scrim;
        setLocalScrims((prev) => [...prev, created]);
      }
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/scrims/${id}`, { method: "DELETE" });
    setLocalScrims((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleLogResult() {
    if (!logModal) return;
    setSaving(true);
    const res = await fetch(`/api/scrims/${logModal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: logResult.result, score: logResult.score, notes: logResult.notes, status: "Completed" }),
    });
    if (res.ok) {
      const updated = await res.json() as Scrim;
      setLocalScrims((prev) => prev.map((s) => s.id === logModal.id ? updated : s));
    }
    setSaving(false);
    setLogModal(null);
  }

  // Availability overlay for form date
  const getAvailabilityForDate = (dateStr: string) => {
    if (!dateStr || !players.length) return null;
    const date = new Date(dateStr);
    const dayIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const dayKey = DAYS[dayIdx];
    const available = availability.filter((a) => a.day === dayKey && a.status === "AVAILABLE").length;
    const total = players.length;
    return { available, total };
  };

  function exportCSV() {
    const rows = [
      ["Date", "Time (AST)", "Opponent", "Game", "Team", "Format", "Status", "Result", "Score", "Notes"],
      ...localScrims.map((s) => {
        const dt = new Date(s.scheduled_at);
        return [
          dt.toLocaleDateString("en-US", { timeZone: "America/Puerto_Rico" }),
          dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "America/Puerto_Rico" }),
          s.opponent_org, s.game, s.division, s.format ?? "", s.status, s.result ?? "", s.score ?? "", s.notes ?? "",
        ];
      }),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "imperfect-scrims.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const availInfo = showForm ? getAvailabilityForDate(form.scheduled_at) : null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-white tracking-wide uppercase">
            <span className="text-[#c5d400]">Scrim</span> Schedule
          </h1>
          <p className="text-white/40 text-sm mt-1">All times displayed in Puerto Rico time (AST/UTC-4)</p>
        </div>
        <div className="flex gap-2">
          {canManage && (
            <>
              <button onClick={exportCSV} className="px-3 py-2 border border-white/[0.08] text-white/50 hover:text-white text-sm font-semibold rounded-xl transition-colors">
                Export CSV
              </button>
              <button onClick={openCreate} className="px-4 py-2 bg-[#c5d400] text-black text-sm font-bold rounded-xl hover:bg-[#d4e500] uppercase tracking-wide transition-colors">
                + New Scrim
              </button>
            </>
          )}
        </div>
      </div>

      {/* Upcoming */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Upcoming ({upcoming.length})</h2>
        {upcoming.length === 0 && <p className="text-white/20 text-sm py-4">No upcoming scrims scheduled.</p>}
        <div className="space-y-3">
          {upcoming.map((scrim) => (
            <ScrimCard key={scrim.id} scrim={scrim} canManage={canManage}
              onEdit={() => openEdit(scrim)}
              onDelete={() => handleDelete(scrim.id)}
              onLogResult={() => { setLogModal(scrim); setLogResult({ result: "W", score: "", notes: "" }); }}
            />
          ))}
        </div>
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">History ({past.length})</h2>
          <div className="space-y-2 opacity-70">
            {past.map((scrim) => (
              <ScrimCard key={scrim.id} scrim={scrim} canManage={canManage}
                onEdit={() => openEdit(scrim)}
                onDelete={() => handleDelete(scrim.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Create/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-heading text-xl text-white font-bold mb-4 uppercase">
              {editingId ? "Edit Scrim" : "New Scrim"}
            </h3>

            {/* Availability hint */}
            {availInfo && (
              <div className={`mb-4 px-3 py-2 rounded-lg text-xs font-medium border ${availInfo.available >= availInfo.total * 0.7 ? "bg-green-400/5 border-green-400/20 text-green-400" : "bg-yellow-400/5 border-yellow-400/20 text-yellow-400"}`}>
                {availInfo.available}/{availInfo.total} players available on this day
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormSelect label="Game" value={form.game} onChange={(v) => setForm((f) => ({ ...f, game: v as "OW2" | "MR" }))}>
                  <option value="MR">Marvel Rivals</option>
                  <option value="OW2">Overwatch 2</option>
                </FormSelect>
                <FormSelect label="Team" value={form.division} onChange={(v) => setForm((f) => ({ ...f, division: v }))}>
                  <option value="IMPerfect">IMPerfect</option>
                  <option value="Shadows">Shadows</option>
                  <option value="Echoes">Echoes</option>
                </FormSelect>
              </div>
              <FormField label="Opponent Org" value={form.opponent_org} onChange={(v) => setForm((f) => ({ ...f, opponent_org: v }))} placeholder="Org name" />
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">Date & Time (AST)</label>
                <input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))}
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40"
                />
              </div>
              <FormField label="Format" value={form.format} onChange={(v) => setForm((f) => ({ ...f, format: v }))} placeholder="Best of 3" />
              <FormSelect label="Status" value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v as Scrim["status"] }))}>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </FormSelect>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/50 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
              <button onClick={handleSubmit} disabled={saving || !form.opponent_org || !form.scheduled_at}
                className="flex-1 py-2.5 bg-[#c5d400] text-black text-sm font-bold rounded-xl disabled:opacity-50 hover:bg-[#d4e500] transition-colors uppercase tracking-wide">
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log result modal */}
      {logModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-heading text-xl text-white font-bold mb-4 uppercase">Log Result</h3>
            <p className="text-white/40 text-sm mb-4">vs. <strong className="text-white">{logModal.opponent_org}</strong></p>
            <div className="space-y-3">
              <div className="flex gap-2">
                {(["W", "L", "Draw"] as const).map((r) => (
                  <button key={r} onClick={() => setLogResult((l) => ({ ...l, result: r }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${logResult.result === r ? `${RESULT_COLORS[r]} border-current bg-current/10` : "border-white/[0.08] text-white/40 hover:text-white"}`}>
                    {r}
                  </button>
                ))}
              </div>
              <FormField label="Score" value={logResult.score} onChange={(v) => setLogResult((l) => ({ ...l, score: v }))} placeholder="e.g. 2-1" />
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">Notes</label>
                <textarea value={logResult.notes} onChange={(e) => setLogResult((l) => ({ ...l, notes: e.target.value }))} rows={2}
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setLogModal(null)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/50 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
              <button onClick={handleLogResult} disabled={saving}
                className="flex-1 py-2.5 bg-[#c5d400] text-black text-sm font-bold rounded-xl hover:bg-[#d4e500] disabled:opacity-50 transition-colors uppercase tracking-wide">
                {saving ? "Saving..." : "Log Result"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScrimCard({ scrim, canManage, onEdit, onDelete, onLogResult }: {
  scrim: Scrim; canManage: boolean;
  onEdit: () => void; onDelete: () => void; onLogResult?: () => void;
}) {
  const dt = new Date(scrim.scheduled_at);
  const dateStr = dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Puerto_Rico" });
  const timeStr = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Puerto_Rico" });

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex items-start gap-4 flex-wrap hover:border-white/[0.1] transition-colors">
      {/* Date block */}
      <div className="text-center min-w-[3.5rem]">
        <p className="text-[10px] text-white/30 uppercase tracking-widest">{dateStr.split(",")[0]}</p>
        <p className="text-lg font-black text-white leading-none">{dt.toLocaleDateString("en-US", { day: "numeric", timeZone: "America/Puerto_Rico" })}</p>
        <p className="text-[10px] text-white/40">{timeStr}</p>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-white">vs. {scrim.opponent_org}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${STATUS_COLORS[scrim.status]}`}>
            {scrim.status}
          </span>
          {scrim.result && (
            <span className={`text-[10px] font-black ${RESULT_COLORS[scrim.result]}`}>
              {scrim.result} {scrim.score}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs text-white/40">{scrim.game} · {scrim.division}</span>
          {scrim.format && <span className="text-xs text-white/30">{scrim.format}</span>}
        </div>
        {scrim.notes && <p className="text-xs text-white/30 mt-1">{scrim.notes}</p>}
      </div>

      {/* Actions */}
      {canManage && (
        <div className="flex gap-2 flex-shrink-0">
          {scrim.status === "Completed" || scrim.status === "Cancelled" ? null : (
            onLogResult && (
              <button onClick={onLogResult} className="text-xs text-white/40 hover:text-white border border-white/[0.08] px-2.5 py-1.5 rounded-lg transition-colors">
                Log result
              </button>
            )
          )}
          <button onClick={onEdit} className="text-xs text-white/40 hover:text-white border border-white/[0.08] px-2.5 py-1.5 rounded-lg transition-colors">Edit</button>
          <button onClick={onDelete} className="text-xs text-red-400/50 hover:text-red-400 border border-white/[0.06] px-2.5 py-1.5 rounded-lg transition-colors">×</button>
        </div>
      )}
    </div>
  );
}

function FormField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40"
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40">
        {children}
      </select>
    </div>
  );
}
