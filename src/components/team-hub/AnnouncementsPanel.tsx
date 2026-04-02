"use client";

import { useState } from "react";
import type { Announcement } from "@/lib/db";
import type { OrgRole } from "@/lib/permissions";

type Props = {
  announcements: Announcement[];
  orgRole: OrgRole;
  canPost: boolean;
  currentDiscordId: string;
};

const AUDIENCE_LABELS: Record<string, string> = {
  ALL: "Everyone",
  IMPERFECT: "IMPerfect",
  SHADOWS: "Shadows",
  ECHOES: "Echoes",
  COACHES: "Coaches",
  MANAGERS: "Managers",
  PLAYERS: "Players",
};

const blankForm = () => ({
  title: "",
  body: "",
  pinned: false,
  target_audience: "ALL" as Announcement["target_audience"],
});

export default function AnnouncementsPanel({ announcements, canPost, currentDiscordId }: Props) {
  const [items, setItems] = useState(announcements);
  const [form, setForm] = useState(blankForm());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleSubmit() {
    setSaving(true);
    if (editingId) {
      const res = await fetch(`/api/announcements/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setItems((prev) => prev.map((a) => a.id === editingId ? { ...a, ...form } : a));
      }
    } else {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json() as Announcement;
        setItems((prev) => [created, ...prev]);
      }
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(blankForm());
  }

  async function handleDelete(id: string) {
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((a) => a.id !== id));
  }

  async function togglePin(item: Announcement) {
    await fetch(`/api/announcements/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !item.pinned }),
    });
    setItems((prev) => prev.map((a) => a.id === item.id ? { ...a, pinned: !a.pinned } : a));
  }

  function openEdit(item: Announcement) {
    setForm({ title: item.title, body: item.body, pinned: item.pinned, target_audience: item.target_audience });
    setEditingId(item.id);
    setShowForm(true);
  }

  const pinned = items.filter((a) => a.pinned);
  const regular = items.filter((a) => !a.pinned);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-white tracking-wide uppercase">
            <span className="text-[#c5d400]">Announcements</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Internal board — visible to team members only</p>
        </div>
        {canPost && (
          <button onClick={() => { setForm(blankForm()); setEditingId(null); setShowForm(true); }}
            className="px-4 py-2 bg-[#c5d400] text-black text-sm font-bold rounded-xl hover:bg-[#d4e500] uppercase tracking-wide transition-colors">
            + Post
          </button>
        )}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16">
          <p className="text-white/20 text-sm">No announcements yet</p>
        </div>
      )}

      {pinned.length > 0 && (
        <section className="mb-6">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">📌 Pinned</p>
          <div className="space-y-3">
            {pinned.map((item) => (
              <AnnouncementCard key={item.id} item={item} canPost={canPost}
                isAuthor={item.author_discord_id === currentDiscordId}
                onEdit={() => openEdit(item)}
                onDelete={() => handleDelete(item.id)}
                onTogglePin={() => togglePin(item)}
              />
            ))}
          </div>
        </section>
      )}

      {regular.length > 0 && (
        <div className="space-y-3">
          {regular.map((item) => (
            <AnnouncementCard key={item.id} item={item} canPost={canPost}
              isAuthor={item.author_discord_id === currentDiscordId}
              onEdit={() => openEdit(item)}
              onDelete={() => handleDelete(item.id)}
              onTogglePin={() => togglePin(item)}
            />
          ))}
        </div>
      )}

      {/* Post/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 max-w-lg w-full">
            <h3 className="font-heading text-xl text-white font-bold mb-4 uppercase">
              {editingId ? "Edit Announcement" : "New Announcement"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">Message</label>
                <textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} rows={4}
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40 resize-none"
                  placeholder="Write your announcement..."
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[8rem]">
                  <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">Audience</label>
                  <select value={form.target_audience} onChange={(e) => setForm((f) => ({ ...f, target_audience: e.target.value as Announcement["target_audience"] }))}
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40">
                    {Object.entries(AUDIENCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.pinned} onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
                      className="w-4 h-4 rounded accent-[#c5d400]"
                    />
                    <span className="text-sm text-white/60">Pin to top</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/50 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
              <button onClick={handleSubmit} disabled={saving || !form.title || !form.body}
                className="flex-1 py-2.5 bg-[#c5d400] text-black text-sm font-bold rounded-xl hover:bg-[#d4e500] disabled:opacity-50 transition-colors uppercase tracking-wide">
                {saving ? "Posting..." : editingId ? "Update" : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnnouncementCard({ item, canPost, isAuthor, onEdit, onDelete, onTogglePin }: {
  item: Announcement; canPost: boolean; isAuthor: boolean;
  onEdit: () => void; onDelete: () => void; onTogglePin: () => void;
}) {
  return (
    <div className={`bg-white/[0.03] border rounded-2xl p-5 ${item.pinned ? "border-[#c5d400]/20" : "border-white/[0.06]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {item.pinned && <span className="text-[10px] text-[#c5d400] font-bold uppercase tracking-widest">📌 Pinned</span>}
            <span className="text-[10px] text-white/20 bg-white/[0.04] px-2 py-0.5 rounded uppercase tracking-wide">{AUDIENCE_LABELS[item.target_audience] ?? item.target_audience}</span>
          </div>
          <h3 className="text-base font-bold text-white">{item.title}</h3>
          <p className="text-sm text-white/60 mt-2 leading-relaxed whitespace-pre-wrap">{item.body}</p>
          <p className="text-xs text-white/20 mt-3">{new Date(item.created_at).toLocaleString()}</p>
        </div>
        {(canPost || isAuthor) && (
          <div className="flex gap-1 flex-shrink-0">
            {canPost && (
              <button onClick={onTogglePin} title={item.pinned ? "Unpin" : "Pin"}
                className="text-white/30 hover:text-[#c5d400] transition-colors p-1.5 rounded">
                📌
              </button>
            )}
            <button onClick={onEdit} className="text-white/30 hover:text-white/70 transition-colors p-1.5 rounded">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            {canPost && (
              <button onClick={onDelete} className="text-red-400/40 hover:text-red-400 transition-colors p-1.5 rounded">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
