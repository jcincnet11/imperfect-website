"use client";

import { useEffect, useState, useCallback } from "react";

type Block = "available" | "unavailable" | "unset";

type TemplateRow = {
  day_of_week: number;
  morning: Block;
  afternoon: Block;
  evening: Block;
};

type Override = {
  override_date: string;
  morning: Block;
  afternoon: Block;
  evening: Block;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["morning", "afternoon", "evening"] as const;
const SLOT_LABELS: Record<string, string> = {
  morning: "Morning (8 AM–12 PM)",
  afternoon: "Afternoon (12–6 PM)",
  evening: "Evening (6–11 PM)",
};

function nextBlock(b: Block): Block {
  if (b === "unset") return "available";
  if (b === "available") return "unavailable";
  return "unset";
}

const BLOCK_STYLE: Record<Block, { bg: string; border: string; label: string; color: string }> = {
  available:   { bg: "rgba(200,228,0,0.2)", border: "1px solid rgba(200,228,0,0.5)", label: "Available", color: "#C8E400" },
  unavailable: { bg: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", label: "Unavailable", color: "#ef4444" },
  unset:       { bg: "transparent", border: "1px dashed rgba(255,255,255,0.12)", label: "Unset", color: "#555" },
};

function BlockCell({ value, onClick }: { value: Block; onClick: () => void }) {
  const s = BLOCK_STYLE[value];
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: s.bg,
        border: s.border,
        borderRadius: "6px",
        width: "100%",
        height: "36px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: 600,
        color: s.color,
        transition: "all 0.15s",
      }}
    >
      {value === "available" ? "✓" : value === "unavailable" ? "✕" : "—"}
    </button>
  );
}

export default function RecurringScheduleEditor({
  currentDiscordId,
  targetDiscordId,
  isEditingOther,
}: {
  currentDiscordId: string;
  targetDiscordId?: string;
  isEditingOther?: boolean;
}) {
  const effectiveId = targetDiscordId ?? currentDiscordId;

  // Template state
  const [template, setTemplate] = useState<TemplateRow[]>(
    DAYS.map((_, i) => ({ day_of_week: i, morning: "unset", afternoon: "unset", evening: "unset" }))
  );
  const [templateSaving, setTemplateSaving] = useState(false);
  const [templateSaved, setTemplateSaved] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);

  // Override state
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [overrideDate, setOverrideDate] = useState("");
  const [overrideRow, setOverrideRow] = useState<{ morning: Block; afternoon: Block; evening: Block }>({
    morning: "unset", afternoon: "unset", evening: "unset",
  });
  const [overrideSaving, setOverrideSaving] = useState(false);

  // Load template + overrides
  const load = useCallback(async () => {
    const qp = effectiveId !== currentDiscordId ? `?discord_id=${effectiveId}` : "";
    const [tplRes, ovrRes] = await Promise.all([
      fetch(`/api/availability/template${qp}`),
      fetch(`/api/availability/override${qp}`),
    ]);
    if (tplRes.ok) {
      const { templates } = await tplRes.json();
      if (templates.length > 0) {
        setTemplate((prev) =>
          prev.map((row) => {
            const found = templates.find((t: TemplateRow) => t.day_of_week === row.day_of_week);
            return found ? { ...row, morning: found.morning, afternoon: found.afternoon, evening: found.evening } : row;
          })
        );
      }
    }
    if (ovrRes.ok) {
      const { overrides: ovrs } = await ovrRes.json();
      setOverrides(ovrs ?? []);
    }
    setTemplateLoaded(true);
  }, [effectiveId, currentDiscordId]);

  useEffect(() => { load(); }, [load]);

  // When override date changes, pre-fill from template
  useEffect(() => {
    if (!overrideDate) return;
    const d = new Date(overrideDate + "T12:00:00");
    const jsDay = d.getDay();
    const dow = jsDay === 0 ? 6 : jsDay - 1;
    const tpl = template.find((t) => t.day_of_week === dow);
    if (tpl) {
      setOverrideRow({ morning: tpl.morning, afternoon: tpl.afternoon, evening: tpl.evening });
    } else {
      setOverrideRow({ morning: "unset", afternoon: "unset", evening: "unset" });
    }
  }, [overrideDate, template]);

  const toggleTemplate = (dayIdx: number, slot: typeof SLOTS[number]) => {
    setTemplate((prev) =>
      prev.map((row) =>
        row.day_of_week === dayIdx ? { ...row, [slot]: nextBlock(row[slot]) } : row
      )
    );
    setTemplateSaved(false);
  };

  const saveTemplate = async () => {
    setTemplateSaving(true);
    try {
      const body: Record<string, unknown> = { rows: template };
      if (effectiveId !== currentDiscordId) body.discord_id = effectiveId;
      await fetch("/api/availability/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setTemplateSaved(true);
    } finally {
      setTemplateSaving(false);
    }
  };

  const saveOverride = async () => {
    if (!overrideDate) return;
    setOverrideSaving(true);
    try {
      const body: Record<string, unknown> = {
        override_date: overrideDate,
        ...overrideRow,
      };
      if (effectiveId !== currentDiscordId) body.discord_id = effectiveId;
      await fetch("/api/availability/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await load();
      setOverrideDate("");
    } finally {
      setOverrideSaving(false);
    }
  };

  const removeOverride = async (date: string) => {
    const qp = new URLSearchParams({ override_date: date });
    if (effectiveId !== currentDiscordId) qp.set("discord_id", effectiveId);
    await fetch(`/api/availability/override?${qp}`, { method: "DELETE" });
    setOverrides((prev) => prev.filter((o) => o.override_date !== date));
  };

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();

  if (!templateLoaded) {
    return <div style={{ color: "#555", fontSize: "13px", padding: "20px 0" }}>Loading schedule...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* ── Weekly Template ── */}
      <div>
        {isEditingOther && (
          <div style={{
            background: "rgba(200,228,0,0.08)",
            border: "1px solid rgba(200,228,0,0.2)",
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "16px",
            fontSize: "12px",
            color: "#C8E400",
          }}>
            Editing on behalf of another player
          </div>
        )}

        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
          Weekly Template
        </h3>
        <p style={{ fontSize: "12px", color: "#555", marginBottom: "16px" }}>
          Set your default weekly availability. This auto-applies every week. All times in AST (UTC-4).
        </p>

        {/* Grid */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "4px" }}>
            <thead>
              <tr>
                <th style={{ width: "120px", textAlign: "left", fontSize: "10px", color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 4px 6px" }} />
                {DAYS.map((d) => (
                  <th key={d} style={{ textAlign: "center", fontSize: "11px", color: "#888", fontWeight: 600, padding: "0 0 6px" }}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot}>
                  <td style={{ fontSize: "11px", color: "#777", fontWeight: 500, padding: "2px 4px", whiteSpace: "nowrap" }}>
                    {SLOT_LABELS[slot]}
                  </td>
                  {DAYS.map((_, dayIdx) => (
                    <td key={dayIdx} style={{ padding: "2px" }}>
                      <BlockCell
                        value={template[dayIdx][slot]}
                        onClick={() => toggleTemplate(dayIdx, slot)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
          {(["available", "unavailable", "unset"] as Block[]).map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: BLOCK_STYLE[b].color }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: BLOCK_STYLE[b].bg, border: BLOCK_STYLE[b].border }} />
              {BLOCK_STYLE[b].label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
          <button
            onClick={saveTemplate}
            disabled={templateSaving}
            style={{
              background: "#C8E400",
              color: "#111",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: templateSaving ? "not-allowed" : "pointer",
              opacity: templateSaving ? 0.6 : 1,
            }}
          >
            {templateSaving ? "Saving..." : "Save Template"}
          </button>
          {templateSaved && (
            <span style={{ fontSize: "12px", color: "#C8E400" }}>
              Recurring schedule saved. You&apos;re all set.
            </span>
          )}
        </div>
      </div>

      {/* ── One-Off Overrides ── */}
      <div>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
          Exceptions
        </h3>
        <p style={{ fontSize: "12px", color: "#555", marginBottom: "16px" }}>
          Override your template for specific dates that differ from your usual schedule.
        </p>

        {/* Date picker + day editor */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end", marginBottom: "16px" }}>
          <div>
            <label style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "4px" }}>
              Date
            </label>
            <input
              type="date"
              value={overrideDate}
              min={minDate}
              onChange={(e) => setOverrideDate(e.target.value)}
              style={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#fff",
                padding: "8px 12px",
                fontSize: "13px",
                colorScheme: "dark",
              }}
            />
          </div>
          {overrideDate && SLOTS.map((slot) => (
            <div key={slot} style={{ minWidth: "90px" }}>
              <label style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "4px" }}>
                {slot}
              </label>
              <BlockCell
                value={overrideRow[slot]}
                onClick={() => setOverrideRow((prev) => ({ ...prev, [slot]: nextBlock(prev[slot]) }))}
              />
            </div>
          ))}
          {overrideDate && (
            <button
              onClick={saveOverride}
              disabled={overrideSaving}
              style={{
                background: "#C8E400",
                color: "#111",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: overrideSaving ? "not-allowed" : "pointer",
                opacity: overrideSaving ? 0.6 : 1,
                alignSelf: "flex-end",
              }}
            >
              {overrideSaving ? "Saving..." : "Add Override"}
            </button>
          )}
        </div>

        {/* Overrides list */}
        {overrides.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "4px" }}>
              Upcoming Exceptions
            </p>
            {overrides.map((o) => {
              const d = new Date(o.override_date + "T12:00:00");
              const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
              return (
                <div
                  key={o.override_date}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "#fff", fontWeight: 600, minWidth: "90px" }}>{label}</span>
                  {SLOTS.map((slot) => (
                    <span key={slot} style={{ color: BLOCK_STYLE[o[slot]].color, fontWeight: 600, fontSize: "11px" }}>
                      {slot.charAt(0).toUpperCase() + slot.slice(1)} {o[slot] === "available" ? "✓" : o[slot] === "unavailable" ? "✕" : "—"}
                    </span>
                  ))}
                  <button
                    onClick={() => removeOverride(o.override_date)}
                    style={{
                      marginLeft: "auto",
                      background: "transparent",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: "6px",
                      color: "#ef4444",
                      padding: "4px 10px",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
