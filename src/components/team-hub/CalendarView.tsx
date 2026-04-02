"use client";

import { useState } from "react";
import type { ScheduleBlock, Scrim } from "@/lib/db";

// Color spec from requirements
const EVENT_COLORS = {
  SCRIM:      { bg: "bg-[#4FC3F7]/15 border-[#4FC3F7]/30", text: "text-[#4FC3F7]",  dot: "#4FC3F7"  },
  TOURNAMENT: { bg: "bg-[#FFD700]/15 border-[#FFD700]/30", text: "text-[#FFD700]",  dot: "#FFD700"  },
  PRACTICE:   { bg: "bg-[#c5d400]/15 border-[#c5d400]/30", text: "text-[#c5d400]",  dot: "#c5d400"  },
  VOD_REVIEW: { bg: "bg-purple-500/15 border-purple-500/30", text: "text-purple-400", dot: "#a855f7" },
  MEETING:    { bg: "bg-orange-500/15 border-orange-500/30", text: "text-orange-400", dot: "#f97316" },
  FLEX:       { bg: "bg-green-500/15 border-green-500/30",  text: "text-green-400",  dot: "#22c55e" },
  REST:       { bg: "bg-white/[0.06] border-white/[0.08]",  text: "text-white/30",   dot: "#6b7280" },
  DEFAULT:    { bg: "bg-white/[0.06] border-white/[0.08]",  text: "text-white/40",   dot: "#6b7280" },
} as const;

type CalEvent = {
  id: string;
  type: string;
  label: string;
  date: Date;
  timeStr: string;
  division: string;
  detail?: string;
};

type Props = {
  blocks: ScheduleBlock[];
  scrims: Scrim[];
  weekStart: string; // YYYY-MM-DD (Monday)
};

type ViewMode = "week" | "month";

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const BLOCK_DAY_IDX: Record<string, number> = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 };
const BLOCK_LABELS: Record<string, string> = {
  PRACTICE: "Practice", SCRIM: "Scrim", VOD_REVIEW: "VOD Review",
  MEETING: "Meeting", TOURNAMENT: "Tournament", FLEX: "Flex", REST: "Rest",
};

function parseEvents(blocks: ScheduleBlock[], scrims: Scrim[], weekStart: string): CalEvent[] {
  const events: CalEvent[] = [];
  const monday = new Date(weekStart + "T12:00:00");

  // Schedule blocks → map to concrete dates using weekStart + day offset
  for (const b of blocks) {
    const dayOffset = BLOCK_DAY_IDX[b.day] ?? 0;
    const d = new Date(monday);
    d.setDate(d.getDate() + dayOffset);
    events.push({
      id: `block-${b.id}`,
      type: b.block_type,
      label: BLOCK_LABELS[b.block_type] ?? b.block_type,
      date: d,
      timeStr: b.time_slot,
      division: b.division,
      detail: b.notes ?? "",
    });
  }

  // Scrims → already have full timestamps
  for (const s of scrims) {
    if (s.status === "Cancelled") continue;
    const d = new Date(s.scheduled_at);
    events.push({
      id: `scrim-${s.id}`,
      type: "SCRIM",
      label: `vs. ${s.opponent_org}`,
      date: d,
      timeStr: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Puerto_Rico" }),
      division: s.division,
      detail: s.format ?? "",
    });
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = (first.getDay() + 6) % 7; // Mon = 0
  const days: (Date | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function colorFor(type: string) {
  return EVENT_COLORS[type as keyof typeof EVENT_COLORS] ?? EVENT_COLORS.DEFAULT;
}

export default function CalendarView({ blocks, scrims, weekStart }: Props) {
  const [view, setView] = useState<ViewMode>("week");

  // Month navigation starts at the month of weekStart
  const anchor = new Date(weekStart + "T12:00:00");
  const [monthYear, setMonthYear] = useState({ year: anchor.getFullYear(), month: anchor.getMonth() });

  const allEvents = parseEvents(blocks, scrims, weekStart);

  // Week days for week view
  const weekDays: Date[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() + i);
    return d;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      {/* Header controls */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1">
          {(["week", "month"] as ViewMode[]).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === v ? "bg-[#c5d400] text-black" : "text-white/40 hover:text-white"}`}>
              {v}
            </button>
          ))}
        </div>

        {view === "month" && (
          <div className="flex items-center gap-2">
            <button onClick={() => setMonthYear(({ year, month }) => month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 })}
              className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-white text-sm transition-colors">‹</button>
            <span className="text-sm font-semibold text-white min-w-[8rem] text-center">
              {new Date(monthYear.year, monthYear.month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button onClick={() => setMonthYear(({ year, month }) => month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 })}
              className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-white text-sm transition-colors">›</button>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: "Practice", type: "PRACTICE" },
            { label: "Scrim",    type: "SCRIM" },
            { label: "Tournament", type: "TOURNAMENT" },
            { label: "Other",    type: "OTHER" },
          ].map(({ label, type }) => {
            const c = colorFor(type);
            return (
              <div key={type} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.dot }} />
                <span className="text-[10px] text-white/30 uppercase tracking-widest">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Week view */}
      {view === "week" && (
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS_SHORT.map((day) => (
            <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-white/30 pb-2">{day}</div>
          ))}
          {weekDays.map((day, i) => {
            const dayEvents = allEvents.filter((e) => sameDay(e.date, day));
            const isToday = sameDay(day, today);
            return (
              <div key={i} className={`min-h-[7rem] rounded-xl p-2 border transition-colors ${isToday ? "bg-[#c5d400]/5 border-[#c5d400]/20" : "bg-white/[0.02] border-white/[0.05]"}`}>
                <p className={`text-xs font-bold mb-1.5 ${isToday ? "text-[#c5d400]" : "text-white/40"}`}>
                  {day.toLocaleDateString("en-US", { day: "numeric" })}
                </p>
                <div className="space-y-1">
                  {dayEvents.slice(0, 4).map((ev) => {
                    const c = colorFor(ev.type);
                    return (
                      <div key={ev.id} className={`rounded px-1.5 py-1 border text-[10px] leading-tight ${c.bg} ${c.text}`} title={`${ev.label} — ${ev.division} ${ev.timeStr}${ev.detail ? ` — ${ev.detail}` : ""}`}>
                        <p className="font-semibold truncate">{ev.label}</p>
                        <p className="opacity-70 truncate">{ev.timeStr} · {ev.division}</p>
                      </div>
                    );
                  })}
                  {dayEvents.length > 4 && (
                    <p className="text-[10px] text-white/30 pl-1">+{dayEvents.length - 4} more</p>
                  )}
                  {dayEvents.length === 0 && (
                    <p className="text-[10px] text-white/15 pl-0.5">—</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Month view */}
      {view === "month" && (
        <div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_SHORT.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-white/30 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getMonthDays(monthYear.year, monthYear.month).map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="min-h-[5rem] rounded-xl" />;
              const dayEvents = allEvents.filter((e) => sameDay(e.date, day));
              const isToday = sameDay(day, today);
              const isCurrentMonth = true;
              return (
                <div key={i} className={`min-h-[5rem] rounded-xl p-1.5 border transition-colors ${
                  isToday ? "bg-[#c5d400]/5 border-[#c5d400]/20" : isCurrentMonth ? "bg-white/[0.02] border-white/[0.05]" : "bg-transparent border-transparent"
                }`}>
                  <p className={`text-[11px] font-bold mb-1 ${isToday ? "text-[#c5d400]" : "text-white/40"}`}>
                    {day.getDate()}
                  </p>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev) => {
                      const c = colorFor(ev.type);
                      return (
                        <div key={ev.id} className={`flex items-center gap-1 px-1 py-0.5 rounded text-[9px] ${c.bg} ${c.text} border`} title={`${ev.label} — ${ev.division} ${ev.timeStr}`}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.dot }} />
                          <span className="truncate font-medium">{ev.label}</span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <p className="text-[9px] text-white/30 pl-1">+{dayEvents.length - 3}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {allEvents.length === 0 && (
        <p className="text-white/20 text-sm text-center py-8 mt-4">No events scheduled for this period.</p>
      )}
    </div>
  );
}
