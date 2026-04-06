"use client";

import { useState, useEffect, useCallback } from "react";

type Application = {
  id: string;
  team_name: string;
  discord_invite: string | null;
  captain_name: string;
  captain_discord: string;
  region: string;
  game: "ow2" | "marvel_rivals" | "both";
  format: string;
  rank_range: string;
  preferred_days: string[];
  preferred_blocks: string[];
  earliest_date: string;
  message: string | null;
  status: "pending" | "accepted" | "declined" | "scheduled";
  linked_scrim_id: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  submitted_at: string;
};

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  pending:   { bg: "rgba(251,191,36,0.1)", text: "#fbbf24", label: "Pending" },
  accepted:  { bg: "rgba(34,197,94,0.1)", text: "#22c55e", label: "Accepted" },
  declined:  { bg: "rgba(239,68,68,0.1)", text: "#ef4444", label: "Declined" },
  scheduled: { bg: "rgba(79,195,247,0.1)", text: "#4FC3F7", label: "Scheduled" },
};

const GAME_LABEL: Record<string, string> = {
  ow2: "Overwatch 2",
  marvel_rivals: "Marvel Rivals",
  both: "Both",
};

const DAY_LABELS: Record<string, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

export default function ScrimApplicationsPanel() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/scrim-applications");
    if (res.ok) {
      const { applications } = await res.json();
      setApps(applications ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    const res = await fetch(`/api/scrim-applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const { application } = await res.json();
      setApps((prev) => prev.map((a) => a.id === id ? application : a));
    }
    setActionLoading(null);
  };

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  if (loading) {
    return <p style={{ color: "#555", fontSize: "13px", padding: "20px 0" }}>Loading applications...</p>;
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["all", "pending", "accepted", "declined", "scheduled"].map((f) => {
          const count = f === "all" ? apps.length : apps.filter((a) => a.status === f).length;
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: isActive ? "1px solid rgba(200,228,0,0.4)" : "1px solid rgba(255,255,255,0.08)",
                background: isActive ? "rgba(200,228,0,0.1)" : "transparent",
                color: isActive ? "#C8E400" : "#666",
                transition: "all 0.15s",
              }}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "#444", fontSize: "13px", padding: "20px 0" }}>No applications found.</p>
      )}

      {/* Application Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((app) => {
          const st = STATUS_STYLE[app.status];
          const submitted = new Date(app.submitted_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
          });
          const days = (app.preferred_days as string[]).map((d) => DAY_LABELS[d] ?? d).join(", ");
          const blocks = (app.preferred_blocks as string[]).map((b) => b.charAt(0).toUpperCase() + b.slice(1)).join(", ");

          return (
            <div
              key={app.id}
              style={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "16px 20px",
              }}
            >
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>{app.team_name}</span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      background: st.bg,
                      color: st.text,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>
                      {st.label}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    {GAME_LABEL[app.game]} &middot; {app.format} &middot; {app.region}
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "#555" }}>Submitted {submitted}</span>
              </div>

              {/* Details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px", marginBottom: "12px" }}>
                <Detail label="Captain" value={app.captain_name} />
                <Detail
                  label="Discord"
                  value={app.captain_discord}
                  copyable
                />
                <Detail label="Rank Range" value={app.rank_range} />
                <Detail label="Earliest Date" value={new Date(app.earliest_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
                <Detail label="Days" value={days} />
                <Detail label="Time Blocks" value={blocks} />
              </div>

              {app.message && (
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "10px 12px", marginBottom: "12px", fontSize: "12px", color: "#888", fontStyle: "italic" }}>
                  &ldquo;{app.message}&rdquo;
                </div>
              )}

              {/* Actions */}
              {app.status === "pending" && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => updateStatus(app.id, "accepted")}
                    disabled={actionLoading === app.id}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      background: "rgba(34,197,94,0.15)",
                      color: "#22c55e",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(app.id, "declined")}
                    disabled={actionLoading === app.id}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      background: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                    }}
                  >
                    Decline
                  </button>
                </div>
              )}
              {app.status === "accepted" && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => updateStatus(app.id, "scheduled")}
                    disabled={actionLoading === app.id}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      background: "rgba(79,195,247,0.15)",
                      color: "#4FC3F7",
                    }}
                  >
                    Mark Scheduled
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div style={{ fontSize: "10px", color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>
        {label}
      </div>
      <div style={{ fontSize: "13px", color: "#ccc", display: "flex", alignItems: "center", gap: "6px" }}>
        {value}
        {copyable && (
          <button
            onClick={copy}
            style={{ background: "none", border: "none", color: copied ? "#C8E400" : "#555", cursor: "pointer", fontSize: "11px" }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
