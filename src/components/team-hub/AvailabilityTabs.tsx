"use client";

import { useState, type ReactNode } from "react";

const TAB_STYLE = {
  base: {
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 600,
    borderRadius: "8px",
    border: "1px solid transparent",
    cursor: "pointer",
    transition: "all 0.15s",
  } as React.CSSProperties,
  active: {
    background: "rgba(200,228,0,0.12)",
    borderColor: "rgba(200,228,0,0.3)",
    color: "#C8E400",
  } as React.CSSProperties,
  inactive: {
    background: "transparent",
    borderColor: "rgba(255,255,255,0.08)",
    color: "#777",
  } as React.CSSProperties,
};

export default function AvailabilityTabs({
  weeklyGrid,
  mySchedule,
}: {
  weeklyGrid: ReactNode;
  mySchedule: ReactNode;
}) {
  const [tab, setTab] = useState<"grid" | "schedule">("grid");

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          onClick={() => setTab("grid")}
          style={{ ...TAB_STYLE.base, ...(tab === "grid" ? TAB_STYLE.active : TAB_STYLE.inactive) }}
        >
          Weekly Grid
        </button>
        <button
          onClick={() => setTab("schedule")}
          style={{ ...TAB_STYLE.base, ...(tab === "schedule" ? TAB_STYLE.active : TAB_STYLE.inactive) }}
        >
          My Schedule
        </button>
      </div>

      {tab === "grid" ? weeklyGrid : mySchedule}
    </div>
  );
}
