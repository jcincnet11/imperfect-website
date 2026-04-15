"use client";

import { useState } from "react";
import type { ScheduleBlock } from "@/lib/db";

const DAY_LABELS: Record<string, string> = {
  MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat", SUN: "Sun",
};

const TIME_LABELS: Record<string, string> = {
  "16:00": "4:00 PM", "17:00": "5:00 PM", "18:00": "6:00 PM",
  "19:00": "7:00 PM", "20:00": "8:00 PM", "21:00": "9:00 PM",
};

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function extractUrls(text: string | undefined): string[] {
  if (!text) return [];
  return text.match(URL_REGEX) ?? [];
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type Props = {
  reviews: ScheduleBlock[];
  canEdit: boolean;
};

export default function VodLibrary({ reviews: initial, canEdit }: Props) {
  const [reviews, setReviews] = useState<ScheduleBlock[]>(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [divisionFilter, setDivisionFilter] = useState<string>("all");

  const divisions = Array.from(new Set(reviews.map((r) => r.division)));
  const filtered = divisionFilter === "all"
    ? reviews
    : reviews.filter((r) => r.division === divisionFilter);

  const startEdit = (block: ScheduleBlock) => {
    setEditing(block.id);
    setDraft(block.notes ?? "");
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft("");
  };

  const saveEdit = async (block: ScheduleBlock) => {
    setSaving(true);
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...block, notes: draft }),
    });
    if (res.ok) {
      const saved = await res.json();
      setReviews((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
      setEditing(null);
      setDraft("");
    }
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-black text-white tracking-wide uppercase">
          <span className="text-[#c5d400]">VOD</span> Library
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Recorded review sessions across all divisions. URLs in notes are auto-linked.
        </p>
      </div>

      {divisions.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", ...divisions].map((d) => {
            const count = d === "all" ? reviews.length : reviews.filter((r) => r.division === d).length;
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
                {d === "all" ? "All" : d} <span className="opacity-50">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">
          No VOD reviews yet. Schedule a VOD_REVIEW block to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((block) => {
            const urls = extractUrls(block.notes);
            const isEditing = editing === block.id;

            return (
              <div
                key={block.id}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold tracking-widest uppercase text-purple-400">
                        VOD Review
                      </span>
                      <span className="text-xs text-white/30">·</span>
                      <span className="text-xs text-white/50">{block.division}</span>
                    </div>
                    <div className="text-sm text-white/70">
                      Week of {formatWeekLabel(block.week_start)} · {DAY_LABELS[block.day] ?? block.day} at {TIME_LABELS[block.time_slot] ?? block.time_slot}
                    </div>
                  </div>
                  {canEdit && !isEditing && (
                    <button
                      onClick={() => startEdit(block)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      {block.notes ? "Edit notes" : "Add notes"}
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Notes, timestamps, takeaways. Paste VOD links — they'll auto-link."
                      rows={5}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg p-3 text-sm text-white placeholder:text-white/20 font-mono focus:border-[#c5d400]/40 focus:outline-none"
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
                        onClick={() => saveEdit(block)}
                        disabled={saving}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#c5d400] text-black hover:bg-[#d4e600] transition-colors disabled:opacity-50"
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                ) : block.notes ? (
                  <div className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                    {linkifyText(block.notes)}
                  </div>
                ) : (
                  <div className="text-sm text-white/30 italic">No notes yet.</div>
                )}

                {urls.length > 0 && !isEditing && (
                  <div className="mt-3 pt-3 border-t border-white/[0.04] flex flex-wrap gap-2">
                    {urls.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-md text-[11px] font-mono text-[#c5d400] bg-[#c5d400]/[0.08] hover:bg-[#c5d400]/[0.15] transition-colors truncate max-w-[300px]"
                      >
                        ▶ {url.replace(/^https?:\/\//, "")}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function linkifyText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  const regex = new RegExp(URL_REGEX);
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#c5d400] hover:underline"
      >
        {match[0]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
