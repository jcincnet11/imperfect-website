"use client";

import { useState, useMemo } from "react";
import { exportToCSV } from "@/lib/export";
import type { Sponsor, Revenue } from "@/lib/management-db";

// ─── Sponsors tab ─────────────────────────────────────────────────────────────

const TIERS = ["Platinum", "Gold", "Silver", "Bronze", "Trade", "Prospect", "Lapsed"];
const CATEGORIES = ["Sponsorship", "Merchandise", "Prize Money", "Content / Streaming", "Events", "Other"];

const TIER_STYLES: Record<string, string> = {
  Platinum: "bg-[#c5d400]/15 text-[#c5d400] border-[#c5d400]/25",
  Gold: "bg-yellow-400/15 text-yellow-400 border-yellow-400/25",
  Silver: "bg-slate-400/15 text-slate-300 border-slate-400/25",
  Bronze: "bg-orange-700/15 text-orange-400 border-orange-700/25",
  Trade: "bg-teal-500/15 text-teal-400 border-teal-500/25",
  Prospect: "bg-white/[0.06] text-white/40 border-white/[0.08]",
  Lapsed: "bg-red-500/10 text-red-400/60 border-red-500/20",
};

const CATEGORY_STYLES: Record<string, string> = {
  Sponsorship: "bg-[#c5d400]/15 text-[#c5d400]",
  Merchandise: "bg-purple-500/15 text-purple-400",
  "Prize Money": "bg-green-500/15 text-green-400",
  "Content / Streaming": "bg-blue-500/15 text-blue-400",
  Events: "bg-orange-500/15 text-orange-400",
  Other: "bg-white/[0.06] text-white/40",
};

const EMPTY_SPONSOR: Omit<Sponsor, "id" | "created_at"> = {
  company_name: "",
  industry: "",
  contact_name: "",
  title: "",
  email: "",
  phone: "",
  tier: "Prospect",
  deal_value: 0,
  contract_start: "",
  contract_end: "",
  deliverables: "",
  paid_to_date: 0,
  status: "Prospect",
  last_contact: "",
  next_followup: "",
  source: "",
  notes: "",
};

const EMPTY_REVENUE: Omit<Revenue, "id" | "created_at"> = {
  date: "",
  category: "Sponsorship",
  description: "",
  invoice_number: "",
  amount: 0,
  cost: 0,
  payment_method: "",
  received: false,
  receipt_ref: "",
  notes: "",
};

type Props = { initialSponsors: Sponsor[]; initialRevenue: Revenue[] };

export default function SponsorsPanel({ initialSponsors, initialRevenue }: Props) {
  const [tab, setTab] = useState<"sponsors" | "revenue">("sponsors");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 bg-[#111] border border-white/[0.07] rounded-xl w-fit">
        {(["sponsors", "revenue"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
              tab === t
                ? "bg-[#c5d400] text-black"
                : "text-white/40 hover:text-white"
            }`}
          >
            {t === "sponsors" ? "Sponsors" : "Revenue"}
          </button>
        ))}
      </div>

      {tab === "sponsors" ? (
        <SponsorsTab initial={initialSponsors} />
      ) : (
        <RevenueTab initial={initialRevenue} />
      )}
    </div>
  );
}

// ─── Sponsors tab ─────────────────────────────────────────────────────────────

function SponsorsTab({ initial }: { initial: Sponsor[] }) {
  const [rows, setRows] = useState<Sponsor[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Sponsor, "id" | "created_at">>(EMPTY_SPONSOR);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function sf(key: keyof typeof EMPTY_SPONSOR) {
    return (v: string | number | boolean) => setForm((f) => ({ ...f, [key]: v }));
  }

  function openAdd() { setForm(EMPTY_SPONSOR); setEditId(null); setModalOpen(true); }
  function openEdit(s: Sponsor) {
    setForm({
      company_name: s.company_name,
      industry: s.industry ?? "",
      contact_name: s.contact_name ?? "",
      title: s.title ?? "",
      email: s.email ?? "",
      phone: s.phone ?? "",
      tier: s.tier,
      deal_value: s.deal_value,
      contract_start: s.contract_start ?? "",
      contract_end: s.contract_end ?? "",
      deliverables: s.deliverables ?? "",
      paid_to_date: s.paid_to_date,
      status: s.status,
      last_contact: s.last_contact ?? "",
      next_followup: s.next_followup ?? "",
      source: s.source ?? "",
      notes: s.notes ?? "",
    });
    setEditId(s.id);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editId) {
        const res = await fetch(`/api/management/sponsors/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json() as Sponsor;
        setRows((r) => r.map((s) => (s.id === editId ? updated : s)));
      } else {
        const res = await fetch("/api/management/sponsors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json() as Sponsor;
        setRows((r) => [created, ...r]);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/management/sponsors/${id}`, { method: "DELETE" });
    setRows((r) => r.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  }

  function handleExport() {
    exportToCSV(
      rows.map((s) => ({
        Company: s.company_name,
        Industry: s.industry ?? "",
        Contact: s.contact_name ?? "",
        Title: s.title ?? "",
        Email: s.email ?? "",
        Tier: s.tier,
        "Deal Value": s.deal_value,
        "Paid to Date": s.paid_to_date,
        Outstanding: Math.max(0, s.deal_value - s.paid_to_date),
        Status: s.status,
        "Next Follow-up": s.next_followup ?? "",
        Notes: s.notes ?? "",
      })),
      "imperfect-sponsors"
    );
  }

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
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
          + Add Sponsor
        </button>
      </div>

      <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 px-5 py-3 border-b border-white/[0.06]">
          {["Company", "Tier", "Deal", "Paid", "Outstanding", "Next Follow-up", ""].map((h) => (
            <span key={h} className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">
              {h}
            </span>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-white/25 text-sm mb-3">No sponsors yet.</p>
            <button
              onClick={openAdd}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#c5d400]/10 text-[#c5d400] hover:bg-[#c5d400]/20 border border-[#c5d400]/20 transition-colors"
            >
              Add your first sponsor
            </button>
          </div>
        ) : (
          rows.map((s) => {
            const outstanding = Math.max(0, s.deal_value - s.paid_to_date);
            const hasOutstanding = outstanding > 0 && s.status !== "Prospect" && s.status !== "Lapsed";
            return (
              <div
                key={s.id}
                className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center px-5 py-3.5 border-b border-white/[0.04] last:border-0 transition-colors ${
                  hasOutstanding ? "bg-amber-500/[0.03] hover:bg-amber-500/[0.05]" : "hover:bg-white/[0.02]"
                }`}
              >
                <div>
                  <p className="text-sm text-white font-medium">{s.company_name}</p>
                  {s.contact_name && (
                    <p className="text-[11px] text-white/30 mt-0.5">{s.contact_name}{s.title ? ` · ${s.title}` : ""}</p>
                  )}
                </div>
                <TierBadge tier={s.tier} />
                <span className="text-xs text-white/60">
                  {s.deal_value > 0 ? `$${s.deal_value.toLocaleString()}` : "—"}
                </span>
                <span className="text-xs text-white/60">
                  {s.paid_to_date > 0 ? `$${s.paid_to_date.toLocaleString()}` : "—"}
                </span>
                <span className={`text-xs font-medium ${hasOutstanding ? "text-amber-400" : "text-white/30"}`}>
                  {outstanding > 0 ? `$${outstanding.toLocaleString()}` : "—"}
                </span>
                <span className="text-xs text-white/40">{s.next_followup ?? "—"}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(s)}
                    className="text-[11px] px-2 py-1 rounded text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(s.id)}
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

      {/* Modal */}
      {modalOpen && (
        <Modal title={editId ? "Edit Sponsor" : "Add Sponsor"} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company *" span><Input value={form.company_name} onChange={sf("company_name") as (v: string) => void} /></Field>
            <Field label="Industry"><Input value={form.industry ?? ""} onChange={sf("industry") as (v: string) => void} /></Field>
            <Field label="Contact Name"><Input value={form.contact_name ?? ""} onChange={sf("contact_name") as (v: string) => void} /></Field>
            <Field label="Title"><Input value={form.title ?? ""} onChange={sf("title") as (v: string) => void} /></Field>
            <Field label="Email"><Input type="email" value={form.email ?? ""} onChange={sf("email") as (v: string) => void} /></Field>
            <Field label="Phone"><Input value={form.phone ?? ""} onChange={sf("phone") as (v: string) => void} /></Field>
            <Field label="Tier">
              <SelectField value={form.tier} options={TIERS} onChange={sf("tier") as (v: string) => void} />
            </Field>
            <Field label="Status"><Input value={form.status} onChange={sf("status") as (v: string) => void} /></Field>
            <Field label="Deal Value ($)"><Input type="number" value={String(form.deal_value)} onChange={(v) => setForm((f) => ({ ...f, deal_value: Number(v) }))} /></Field>
            <Field label="Paid to Date ($)"><Input type="number" value={String(form.paid_to_date)} onChange={(v) => setForm((f) => ({ ...f, paid_to_date: Number(v) }))} /></Field>
            <Field label="Contract Start"><Input type="date" value={form.contract_start ?? ""} onChange={sf("contract_start") as (v: string) => void} /></Field>
            <Field label="Contract End"><Input type="date" value={form.contract_end ?? ""} onChange={sf("contract_end") as (v: string) => void} /></Field>
            <Field label="Last Contact"><Input type="date" value={form.last_contact ?? ""} onChange={sf("last_contact") as (v: string) => void} /></Field>
            <Field label="Next Follow-up"><Input type="date" value={form.next_followup ?? ""} onChange={sf("next_followup") as (v: string) => void} /></Field>
            <Field label="Source"><Input value={form.source ?? ""} onChange={sf("source") as (v: string) => void} placeholder="e.g. Referral, Cold outreach" /></Field>
            <Field label="Deliverables" span>
              <textarea value={form.deliverables ?? ""} onChange={(e) => setForm((f) => ({ ...f, deliverables: e.target.value }))} rows={2} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40 resize-none" />
            </Field>
            <Field label="Notes" span>
              <textarea value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40 resize-none" />
            </Field>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          message="Delete this sponsor? This cannot be undone."
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

// ─── Revenue tab ──────────────────────────────────────────────────────────────

function RevenueTab({ initial }: { initial: Revenue[] }) {
  const [rows, setRows] = useState<Revenue[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Revenue, "id" | "created_at">>(EMPTY_REVENUE);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const summary = useMemo(() => {
    const totalRevenue = rows.reduce((s, r) => s + (r.amount ?? 0), 0);
    const totalCost = rows.reduce((s, r) => s + (r.cost ?? 0), 0);
    const byCategory: Record<string, number> = {};
    for (const r of rows) {
      byCategory[r.category] = (byCategory[r.category] ?? 0) + r.amount;
    }
    return { totalRevenue, totalCost, net: totalRevenue - totalCost, byCategory };
  }, [rows]);

  function openAdd() { setForm(EMPTY_REVENUE); setEditId(null); setModalOpen(true); }
  function openEdit(r: Revenue) {
    setForm({
      date: r.date,
      category: r.category,
      description: r.description ?? "",
      invoice_number: r.invoice_number ?? "",
      amount: r.amount,
      cost: r.cost,
      payment_method: r.payment_method ?? "",
      received: r.received,
      receipt_ref: r.receipt_ref ?? "",
      notes: r.notes ?? "",
    });
    setEditId(r.id);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editId) {
        const res = await fetch(`/api/management/revenue/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json() as Revenue;
        setRows((r) => r.map((e) => (e.id === editId ? updated : e)));
      } else {
        const res = await fetch("/api/management/revenue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json() as Revenue;
        setRows((r) => [created, ...r]);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/management/revenue/${id}`, { method: "DELETE" });
    setRows((r) => r.filter((e) => e.id !== id));
    setDeleteConfirm(null);
  }

  function handleExport() {
    exportToCSV(
      rows.map((r) => ({
        Date: r.date,
        Category: r.category,
        Description: r.description ?? "",
        Invoice: r.invoice_number ?? "",
        Amount: r.amount,
        Cost: r.cost,
        Net: r.amount - r.cost,
        Received: r.received ? "Yes" : "No",
        "Payment Method": r.payment_method ?? "",
        Notes: r.notes ?? "",
      })),
      "imperfect-revenue"
    );
  }

  return (
    <div>
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <SummaryCard label="Total Revenue" value={`$${summary.totalRevenue.toLocaleString()}`} lime />
        <SummaryCard label="Total Costs" value={`$${summary.totalCost.toLocaleString()}`} />
        <SummaryCard label="Net Revenue" value={`$${summary.net.toLocaleString()}`} lime={summary.net >= 0} />
      </div>

      <div className="flex justify-end gap-2 mb-4">
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
          + Add Entry
        </button>
      </div>

      <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 px-5 py-3 border-b border-white/[0.06]">
          {["Date", "Category", "Description", "Amount", "Cost", "Net", ""].map((h) => (
            <span key={h} className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">{h}</span>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-white/25 text-sm mb-3">No revenue entries yet.</p>
            <button onClick={openAdd} className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#c5d400]/10 text-[#c5d400] hover:bg-[#c5d400]/20 border border-[#c5d400]/20 transition-colors">
              Add first entry
            </button>
          </div>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center px-5 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-xs text-white/50">{r.date}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${CATEGORY_STYLES[r.category] ?? "bg-white/[0.06] text-white/40"}`}>
                {r.category}
              </span>
              <span className="text-xs text-white/60 truncate">{r.description || "—"}</span>
              <span className="text-xs text-white/70">{r.amount > 0 ? `$${r.amount.toLocaleString()}` : "—"}</span>
              <span className="text-xs text-white/50">{r.cost > 0 ? `$${r.cost.toLocaleString()}` : "—"}</span>
              <span className={`text-xs font-medium ${r.amount - r.cost >= 0 ? "text-green-400/80" : "text-red-400/80"}`}>
                ${(r.amount - r.cost).toLocaleString()}
              </span>
              <div className="flex gap-1 items-center">
                <span className={`w-1.5 h-1.5 rounded-full ${r.received ? "bg-green-400" : "bg-amber-400"}`} title={r.received ? "Received" : "Pending"} />
                <button onClick={() => openEdit(r)} className="text-[11px] px-2 py-1 rounded text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors">Edit</button>
                <button onClick={() => setDeleteConfirm(r.id)} className="text-[11px] px-2 py-1 rounded text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-colors">Del</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal title={editId ? "Edit Revenue Entry" : "Add Revenue Entry"} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date *"><Input type="date" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} /></Field>
            <Field label="Category *">
              <SelectField value={form.category} options={CATEGORIES} onChange={(v) => setForm((f) => ({ ...f, category: v }))} />
            </Field>
            <Field label="Description" span><Input value={form.description ?? ""} onChange={(v) => setForm((f) => ({ ...f, description: v }))} /></Field>
            <Field label="Invoice #"><Input value={form.invoice_number ?? ""} onChange={(v) => setForm((f) => ({ ...f, invoice_number: v }))} /></Field>
            <Field label="Payment Method"><Input value={form.payment_method ?? ""} onChange={(v) => setForm((f) => ({ ...f, payment_method: v }))} /></Field>
            <Field label="Amount ($)"><Input type="number" value={String(form.amount)} onChange={(v) => setForm((f) => ({ ...f, amount: Number(v) }))} /></Field>
            <Field label="Cost ($)"><Input type="number" value={String(form.cost)} onChange={(v) => setForm((f) => ({ ...f, cost: Number(v) }))} /></Field>
            <Field label="Receipt Ref"><Input value={form.receipt_ref ?? ""} onChange={(v) => setForm((f) => ({ ...f, receipt_ref: v }))} /></Field>
            <Field label="Received?" span>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.received}
                  onChange={(e) => setForm((f) => ({ ...f, received: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#c5d400]"
                />
                <span className="text-sm text-white/60">Payment received</span>
              </label>
            </Field>
            <Field label="Notes" span>
              <textarea value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40 resize-none" />
            </Field>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <ConfirmDialog message="Delete this revenue entry? This cannot be undone." onConfirm={() => handleDelete(deleteConfirm)} onCancel={() => setDeleteConfirm(null)} />
      )}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SummaryCard({ label, value, lime }: { label: string; value: string; lime?: boolean }) {
  return (
    <div className={`bg-[#111] border rounded-xl p-4 ${lime ? "border-[#c5d400]/15" : "border-white/[0.07]"}`}>
      <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-heading font-black text-2xl ${lime ? "text-[#c5d400]" : "text-white"}`}>{value}</p>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const cls = TIER_STYLES[tier] ?? "bg-white/[0.06] text-white/40 border-white/[0.08]";
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border w-fit ${cls}`}>{tier}</span>
  );
}

function Modal({ title, onClose, onSave, saving, children }: {
  title: string; onClose: () => void; onSave: () => void; saving: boolean; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="font-heading font-bold text-lg text-white">{title}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 text-xl leading-none">×</button>
        </div>
        <div className="overflow-y-auto p-6 flex-1">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="text-sm font-medium px-4 py-2 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-colors">Cancel</button>
          <button onClick={onSave} disabled={saving} className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#c5d400] text-black hover:bg-[#d4e400] disabled:opacity-50 transition-colors">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#141414] border border-white/[0.08] rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <p className="text-sm text-white/80 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="text-sm px-4 py-2 rounded-lg border border-white/[0.08] text-white/50 hover:text-white transition-colors">Cancel</button>
          <button onClick={onConfirm} className="text-sm font-semibold px-4 py-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
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

function SelectField({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
