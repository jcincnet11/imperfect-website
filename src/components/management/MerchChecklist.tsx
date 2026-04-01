"use client";

import { useState } from "react";
import type { ChecklistItem } from "@/lib/management-db";

type Props = { initial: ChecklistItem[] };

export default function MerchChecklist({ initial }: Props) {
  const [items, setItems] = useState<ChecklistItem[]>(initial);
  const [saving, setSaving] = useState<string | null>(null);

  const bySection = items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    (acc[item.section] ??= []).push(item);
    return acc;
  }, {});

  const total = items.length;
  const done = items.filter((i) => i.completed).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  async function toggle(item: ChecklistItem) {
    setSaving(item.id);
    try {
      const res = await fetch("/api/management/checklist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, completed: !item.completed }),
      });
      const updated = await res.json() as ChecklistItem;
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6 bg-[#111] border border-white/[0.07] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Pre-Launch Progress</p>
          <span className="font-heading font-black text-2xl text-[#c5d400]">{pct}%</span>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c5d400] rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-white/30 mt-2">{done} of {total} tasks complete</p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {Object.entries(bySection).map(([section, sectionItems]) => {
          const sectionDone = sectionItems.filter((i) => i.completed).length;
          return (
            <div key={section} className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                <h3 className="font-heading font-bold text-base text-white">{section}</h3>
                <span className="text-[11px] font-semibold text-white/30">
                  {sectionDone}/{sectionItems.length}
                </span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {sectionItems.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors ${
                      item.completed
                        ? "bg-[#c5d400]/[0.03] hover:bg-[#c5d400]/[0.05]"
                        : "hover:bg-white/[0.02]"
                    } ${saving === item.id ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggle(item)}
                      className="mt-0.5 w-4 h-4 rounded accent-[#c5d400] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-sm leading-relaxed ${
                          item.completed ? "text-white/35 line-through" : "text-white/80"
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.completed && item.completed_by && (
                        <p className="text-[10px] text-white/20 mt-0.5">
                          Completed by {item.completed_by}
                          {item.completed_at
                            ? ` · ${new Date(item.completed_at).toLocaleDateString()}`
                            : ""}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <div className="text-center py-12 text-white/25 text-sm">
          No checklist items found. Run the Supabase seed SQL to populate the checklist.
        </div>
      )}
    </div>
  );
}
