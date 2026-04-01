"use client";

import { useState, useMemo } from "react";
import { exportToCSV } from "@/lib/export";
import type { Tournament } from "@/lib/management-db";

const GAMES = ["All", "OW2", "Marvel Rivals"];
const STATUSES = ["All", "Upcoming", "Registered", "In Progress", "Completed"];

const STATUS_COLORS: Record<string, string> = {
  Completed: "bg-green-500/15 text-green-400 border-green-500/20",
  Upcoming: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "In Progress": "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Registered: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

const EMPTY_FORM: Omit<Tournament, "id" | "created_at"> = {
  name: "",
  game: "Marvel Rivals",
  organizer: "",
  format: "",
  date_start: "",
  date_end: "",
  reg_deadline: "",
  entry_fee: 0,
  prize_pool: 0,
  placement: "",
  prize_won: 0,
  wins: 0,
  losses: 0,
  status: "Upcoming",
  notes: "",
};

type Props = { initial: Tournament[] };

export default function TournamentsTable({ initial }: Props) {
  const [rows, setRows] = useState<Tournament[]>(initial);
  const [filterGame, setFilterGame] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Tournament, "id" | "created_at">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filterGame !== "All" && r.game !== filterGame) return false;
      if (filterStatus !== "All" && r.status !== filterStatus) return false;
      return true;
    });
  }, [rows, filterGame, filterStatus]);

  const completed = rows.filter((r) => r.status === "Completed");
  const totalWins = completed.reduce((s, r) => s + (r.wins ?? 0), 0);
  const totalLosses = completed.reduce((s, r) => s + (r.losses ?? 0), 0);
  const totalGames = totalWins + totalLosses;
  const winPct = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
  const totalPrize = completed.reduce((s, r) => s + (r.prize_won ?? 0), 0);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setModalOpen(true);
  }

  function openEdit(t: Tournament) {
    setForm({
      name: t.name,
      game: t.game,
      organizer: t.organizer ?? "",
      format: t.format ?? "",
      date_start: t.date_start ?? "",
      date_end: t.date_end ?? "",
      reg_deadline: t.reg_deadline ?? "",
      entry_fee: t.entry_fee,
      prize_pool: t.prize_pool,
      placement: t.placement ?? "",
      prize_won: t.prize_won,
      wins: t.wins,
      losses: t.losses,
      status: t.status,
      notes: t.notes ?? "",
    });
    setEditId(t.id);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editId) {
        const res = await fetch(`/api/management/tournaments/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json() as Tournament;
        setRows((r) => r.map((t) => (t.id === editId ? updated : t)));
      } else {
        const res = await fetch("/api/management/tournaments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json() as Tournament;
        setRows((r) => [created, ...r]);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/management/tournaments/${id}`, { method: "DELETE" });
    setRows((r) => r.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  }

  function handleExport() {
    exportToCSV(
      filtered.map((t) => ({
        Name: t.name,
        Game: t.game,
        Organizer: t.organizer ?? "",
        Format: t.format ?? "",
        "Date Start": t.date_start ?? "",
        "Date End": t.date_end ?? "",
        "Entry Fee": t.entry_fee,
        "Prize Pool": t.prize_pool,
        Placement: t.placement ?? "",
        "Prize Won": t.prize_won,
        W: t.wins,
        L: t.losses,
        "Win%": t.wins + t.losses > 0
          ? `${Math.round((t.wins / (t.wins + t.losses)) * 100)}%`
          : "—",
        Status: t.status,
        Notes: t.notes ?? "",
      })),
      "imperfect-tournaments"
    );
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <SummaryCard label="Total Tournaments" value={String(rows.length)} />
        <SummaryCard label="Overall Win%" value={`${winPct}%`} sub={`${totalWins}W – ${totalLosses}L`} />
        <SummaryCard
          label="Total Prize Money"
          value={`$${totalPrize.toLocaleString()}`}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* Filters + actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            label="Game"
            value={filterGame}
            options={GAMES}
            onChange={setFilterGame}
          />
          <FilterSelect
            label="Status"
            value={filterStatus}
            options={STATUSES}
            onChange={setFilterStatus}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={openAdd}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-[#c5d400] text-black hover:bg-[#d4e400] transition-colors"
          >
            + Add Tournament
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 px-5 py-3 border-b border-white/[0.06]">
          {["Tournament", "Game", "Date", "Placement", "Prize", "W/L", "Status", ""].map((h) => (
            <span key={h} className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState onAdd={openAdd} message="No tournaments yet." cta="Add your first tournament" />
        ) : (
          filtered.map((t) => {
            const games = t.wins + t.losses;
            const wp = games > 0 ? Math.round((t.wins / games) * 100) : null;
            return (
              <div
                key={t.id}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center px-5 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <p className="text-sm text-white font-medium">{t.name}</p>
                  {t.organizer && (
                    <p className="text-[11px] text-white/30 mt-0.5">{t.organizer}</p>
                  )}
                </div>
                <span className="text-xs text-white/50 bg-white/[0.05] px-2 py-0.5 rounded-full w-fit">
                  {t.game}
                </span>
                <span className="text-xs text-white/50">{t.date_start ?? "—"}</span>
                <span className="text-xs text-white/70">{t.placement || "—"}</span>
                <span className="text-xs text-white/70">
                  {t.prize_won > 0 ? `$${t.prize_won.toLocaleString()}` : "—"}
                </span>
                <span className="text-xs text-white/60">
                  {games > 0 ? `${t.wins}W ${t.losses}L` : "—"}
                  {wp !== null && (
                    <span className="text-white/30 ml-1">{wp}%</span>
                  )}
                </span>
                <StatusBadge status={t.status} />
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(t)}
                    className="text-[11px] px-2 py-1 rounded text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(t.id)}
                    className="text-[11px] px-2 py-1 rounded text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Del
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <Modal
          title={editId ? "Edit Tournament" : "Add Tournament"}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          saving={saving}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name *" span>
              <Input value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            </Field>
            <Field label="Game *">
              <Select
                value={form.game}
                options={["OW2", "Marvel Rivals"]}
                onChange={(v) => setForm((f) => ({ ...f, game: v }))}
              />
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                options={["Upcoming", "Registered", "In Progress", "Completed"]}
                onChange={(v) => setForm((f) => ({ ...f, status: v }))}
              />
            </Field>
            <Field label="Organizer">
              <Input value={form.organizer ?? ""} onChange={(v) => setForm((f) => ({ ...f, organizer: v }))} />
            </Field>
            <Field label="Format">
              <Input value={form.format ?? ""} onChange={(v) => setForm((f) => ({ ...f, format: v }))} />
            </Field>
            <Field label="Date Start">
              <Input type="date" value={form.date_start ?? ""} onChange={(v) => setForm((f) => ({ ...f, date_start: v }))} />
            </Field>
            <Field label="Date End">
              <Input type="date" value={form.date_end ?? ""} onChange={(v) => setForm((f) => ({ ...f, date_end: v }))} />
            </Field>
            <Field label="Reg Deadline">
              <Input type="date" value={form.reg_deadline ?? ""} onChange={(v) => setForm((f) => ({ ...f, reg_deadline: v }))} />
            </Field>
            <Field label="Entry Fee ($)">
              <Input type="number" value={String(form.entry_fee)} onChange={(v) => setForm((f) => ({ ...f, entry_fee: Number(v) }))} />
            </Field>
            <Field label="Prize Pool ($)">
              <Input type="number" value={String(form.prize_pool)} onChange={(v) => setForm((f) => ({ ...f, prize_pool: Number(v) }))} />
            </Field>
            <Field label="Placement">
              <Input value={form.placement ?? ""} onChange={(v) => setForm((f) => ({ ...f, placement: v }))} placeholder="e.g. 1st, Top 4" />
            </Field>
            <Field label="Prize Won ($)">
              <Input type="number" value={String(form.prize_won)} onChange={(v) => setForm((f) => ({ ...f, prize_won: Number(v) }))} />
            </Field>
            <Field label="Wins">
              <Input type="number" value={String(form.wins)} onChange={(v) => setForm((f) => ({ ...f, wins: Number(v) }))} />
            </Field>
            <Field label="Losses">
              <Input type="number" value={String(form.losses)} onChange={(v) => setForm((f) => ({ ...f, losses: Number(v) }))} />
            </Field>
            <Field label="Notes" span>
              <textarea
                value={form.notes ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40 resize-none"
              />
            </Field>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <ConfirmDialog
          message="Delete this tournament? This cannot be undone."
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  sub,
  className = "",
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={`bg-[#111] border border-white/[0.07] rounded-xl p-4 ${className}`}>
      <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mb-1">{label}</p>
      <p className="font-heading font-black text-2xl text-white">{value}</p>
      {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] ?? "bg-white/[0.06] text-white/40 border-white/[0.08]";
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border w-fit ${cls}`}>
      {status}
    </span>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#1a1a1a] border border-white/[0.08] text-white/70 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#c5d400]/40"
      aria-label={label}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "All" ? `${label}: All` : o}
        </option>
      ))}
    </select>
  );
}

function EmptyState({ onAdd, message, cta }: { onAdd: () => void; message: string; cta: string }) {
  return (
    <div className="px-5 py-16 flex flex-col items-center gap-3 text-center">
      <p className="text-white/25 text-sm">{message}</p>
      <button
        onClick={onAdd}
        className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#c5d400]/10 text-[#c5d400] hover:bg-[#c5d400]/20 border border-[#c5d400]/20 transition-colors"
      >
        {cta}
      </button>
    </div>
  );
}

function Modal({
  title,
  onClose,
  onSave,
  saving,
  children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="font-heading font-bold text-lg text-white">{title}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 text-xl leading-none">
            ×
          </button>
        </div>
        <div className="overflow-y-auto p-6 flex-1">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#c5d400] text-black hover:bg-[#d4e400] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#141414] border border-white/[0.08] rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <p className="text-sm text-white/80 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="text-sm px-4 py-2 rounded-lg border border-white/[0.08] text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  span,
}: {
  label: string;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40"
    />
  );
}

function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
