"use client";

import { useState, useCallback } from "react";
import type { ScheduleBlock } from "@/lib/db";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const DAY_LABELS: Record<string, string> = {
  MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat", SUN: "Sun",
};
const TIME_SLOTS = ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
const TIME_LABELS: Record<string, string> = {
  "16:00": "4 PM", "17:00": "5 PM", "18:00": "6 PM",
  "19:00": "7 PM", "20:00": "8 PM", "21:00": "9 PM",
};

export const BLOCK_TYPES = [
  { value: "PRACTICE",   label: "Practice",    color: "#c5d400" },
  { value: "SCRIM",      label: "Scrim",        color: "#3A7BD5" },
  { value: "VOD_REVIEW", label: "VOD Review",   color: "#9B59B6" },
  { value: "MEETING",    label: "Meeting",      color: "#E67E22" },
  { value: "TOURNAMENT", label: "Tournament",   color: "#E74C3C" },
  { value: "FLEX",       label: "Flex",         color: "#27AE60" },
  { value: "REST",       label: "Rest / Off",   color: "#7F8C8D" },
] as const;

type BlockType = (typeof BLOCK_TYPES)[number]["value"];

function blockColor(type: string): string {
  return BLOCK_TYPES.find((b) => b.value === type)?.color ?? "#7F8C8D";
}
function blockLabel(type: string): string {
  return BLOCK_TYPES.find((b) => b.value === type)?.label ?? type;
}

type Props = {
  initialBlocks: ScheduleBlock[];
  weekStart: string;
  division: "OW2" | "MR";
  canEdit: boolean;
};

type EditState = {
  day: string;
  time_slot: string;
  block?: ScheduleBlock;
} | null;

export default function ScheduleGrid({ initialBlocks, weekStart, division, canEdit }: Props) {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(initialBlocks);
  const [editing, setEditing] = useState<EditState>(null);
  const [saving, setSaving] = useState(false);

  const getBlock = useCallback(
    (day: string, time_slot: string) =>
      blocks.find((b) => b.day === day && b.time_slot === time_slot),
    [blocks]
  );

  async function handleSave(day: string, time_slot: string, block_type: BlockType, notes: string, existingId?: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: existingId,
          week_start: weekStart,
          division,
          day,
          time_slot,
          block_type,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved: ScheduleBlock = await res.json();
      setBlocks((prev) => {
        const next = prev.filter((b) => !(b.day === day && b.time_slot === time_slot));
        return [...next, saved];
      });
    } finally {
      setSaving(false);
      setEditing(null);
    }
  }

  async function handleDelete(id: string, day: string, time_slot: string) {
    setSaving(true);
    try {
      await fetch(`/api/schedule?id=${id}`, { method: "DELETE" });
      setBlocks((prev) => prev.filter((b) => !(b.day === day && b.time_slot === time_slot)));
    } finally {
      setSaving(false);
      setEditing(null);
    }
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {BLOCK_TYPES.map((bt) => (
          <div key={bt.value} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: bt.color }} />
            <span className="text-[11px] text-white/40">{bt.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[580px]">
          {/* Header row */}
          <div className="grid" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
            <div />
            {DAYS.map((day) => (
              <div key={day} className="text-center text-[11px] font-semibold text-white/35 uppercase tracking-wider pb-2">
                {DAY_LABELS[day]}
              </div>
            ))}
          </div>

          {/* Time rows */}
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot}
              className="grid border-t border-white/[0.05]"
              style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}
            >
              <div className="text-[11px] text-white/25 flex items-center pr-3 font-medium">
                {TIME_LABELS[slot]}
              </div>
              {DAYS.map((day) => {
                const block = getBlock(day, slot);
                return (
                  <Cell
                    key={day}
                    block={block}
                    canEdit={canEdit}
                    onEdit={() => setEditing({ day, time_slot: slot, block })}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <EditModal
          editing={editing}
          saving={saving}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function Cell({
  block,
  canEdit,
  onEdit,
}: {
  block?: ScheduleBlock;
  canEdit: boolean;
  onEdit: () => void;
}) {
  const color = block ? blockColor(block.block_type) : null;

  return (
    <div
      className={`h-14 mx-0.5 my-0.5 rounded flex flex-col items-center justify-center text-[10px] font-bold transition-all ${
        canEdit ? "cursor-pointer" : ""
      } ${block ? "opacity-100" : "opacity-100"}`}
      style={
        block
          ? {
              backgroundColor: `${color}18`,
              border: `1px solid ${color}40`,
              color: color ?? undefined,
            }
          : {
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }
      }
      onClick={canEdit ? onEdit : undefined}
    >
      {block ? (
        <>
          <span className="truncate px-1 text-center leading-tight">{blockLabel(block.block_type)}</span>
          {block.notes && (
            <span className="text-[9px] opacity-60 truncate px-1 max-w-full">{block.notes}</span>
          )}
        </>
      ) : canEdit ? (
        <span className="text-white/10 text-lg">+</span>
      ) : null}
    </div>
  );
}

function EditModal({
  editing,
  saving,
  onSave,
  onDelete,
  onClose,
}: {
  editing: EditState;
  saving: boolean;
  onSave: (day: string, time_slot: string, type: BlockType, notes: string, id?: string) => Promise<void>;
  onDelete: (id: string, day: string, time_slot: string) => Promise<void>;
  onClose: () => void;
}) {
  if (!editing) return null;
  const [blockType, setBlockType] = useState<BlockType>(
    (editing.block?.block_type as BlockType) ?? "PRACTICE"
  );
  const [notes, setNotes] = useState(editing.block?.notes ?? "");

  const DAY_LABEL_FULL: Record<string, string> = {
    MON: "Monday", TUE: "Tuesday", WED: "Wednesday",
    THU: "Thursday", FRI: "Friday", SAT: "Saturday", SUN: "Sunday",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#1a1a1a] border border-white/[0.1] rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-heading font-bold text-white text-lg">
              {editing.block ? "Edit Block" : "Add Block"}
            </h3>
            <p className="text-xs text-white/35 mt-0.5">
              {DAY_LABEL_FULL[editing.day]} · {TIME_LABELS[editing.time_slot]}
            </p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 text-xl transition-colors">×</button>
        </div>

        {/* Block type selector */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {BLOCK_TYPES.map((bt) => (
            <button
              key={bt.value}
              onClick={() => setBlockType(bt.value)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all border"
              style={
                blockType === bt.value
                  ? { backgroundColor: `${bt.color}20`, borderColor: `${bt.color}60`, color: bt.color }
                  : { backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }
              }
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bt.color }} />
              {bt.label}
            </button>
          ))}
        </div>

        {/* Notes */}
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-[#c5d400]/40 transition-colors mb-4"
          maxLength={80}
        />

        {/* Actions */}
        <div className="flex gap-2">
          {editing.block && (
            <button
              onClick={() => onDelete(editing.block!.id, editing.day, editing.time_slot)}
              disabled={saving}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-colors disabled:opacity-50"
            >
              Remove
            </button>
          )}
          <button
            onClick={() => onSave(editing.day, editing.time_slot, blockType, notes, editing.block?.id)}
            disabled={saving}
            className="flex-1 py-2 rounded-lg text-sm font-bold text-dark transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#c5d400" }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
