"use client";

import { useState, useEffect, useCallback } from "react";

type Team = {
  id: string;
  team_name: string;
  team_tag: string | null;
  games: string[];
  platforms: string[];
  region: string;
  discord_server: string | null;
  goals: string[];
  about: string | null;
  status: "pending" | "approved" | "declined" | "active";
  submitted_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  notes: string | null;
};

type Player = {
  id: string;
  is_captain: boolean;
  ign: string;
  discord_handle: string;
  role: string;
  rank: string;
  platform: string;
};

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  pending:  { bg: "rgba(251,191,36,0.1)", text: "#fbbf24", label: "Pending" },
  approved: { bg: "rgba(34,197,94,0.1)", text: "#22c55e", label: "Approved" },
  declined: { bg: "rgba(239,68,68,0.1)", text: "#ef4444", label: "Declined" },
  active:   { bg: "rgba(79,195,247,0.1)", text: "#4FC3F7", label: "Active" },
};

const GAME_LABEL: Record<string, string> = {
  ow2: "OW2",
  marvel_rivals: "MR",
};

export default function CommunityTeamsPanel({ canModify }: { canModify: boolean }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [players, setPlayers] = useState<Record<string, Player[]>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [noteEditing, setNoteEditing] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/community-teams");
    if (res.ok) {
      const { teams: t } = await res.json();
      setTeams(t ?? []);
    }
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const loadPlayers = async (teamId: string) => {
    if (players[teamId]) return;
    const res = await fetch(`/api/community-teams/${teamId}`);
    if (res.ok) {
      const { players: p } = await res.json();
      setPlayers((prev) => ({ ...prev, [teamId]: p ?? [] }));
    }
  };

  const toggleExpand = (teamId: string) => {
    if (expanded === teamId) {
      setExpanded(null);
    } else {
      setExpanded(teamId);
      loadPlayers(teamId);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    const res = await fetch(`/api/community-teams/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const { team } = await res.json();
      setTeams((prev) => prev.map((t) => t.id === id ? team : t));
    }
    setActionLoading(null);
  };

  const saveNote = async (id: string) => {
    await fetch(`/api/community-teams/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: noteText }),
    });
    setTeams((prev) => prev.map((t) => t.id === id ? { ...t, notes: noteText } : t));
    setNoteEditing(null);
  };

  const filtered = filter === "all" ? teams : teams.filter((t) => t.status === filter);

  if (loading) {
    return <p style={{ color: "#555", fontSize: "13px" }}>Loading registrations...</p>;
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["all", "pending", "approved", "declined", "active"].map((f) => {
          const count = f === "all" ? teams.length : teams.filter((t) => t.status === f).length;
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
              }}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "#444", fontSize: "13px", padding: "20px 0" }}>No registrations found.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((team) => {
          const st = STATUS_STYLE[team.status];
          const submitted = new Date(team.submitted_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          });
          const gameLabels = team.games.map((g) => GAME_LABEL[g] ?? g).join(", ");
          const isExpanded = expanded === team.id;
          const teamPlayers = players[team.id] ?? [];

          return (
            <div
              key={team.id}
              style={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "16px 20px",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>
                      {team.team_name}
                    </span>
                    {team.team_tag && (
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#C8E400", background: "rgba(200,228,0,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                        [{team.team_tag}]
                      </span>
                    )}
                    <span style={{
                      fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px",
                      background: st.bg, color: st.text, textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                      {st.label}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#777", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span>{gameLabels}</span>
                    <span>&middot;</span>
                    <span>{team.platforms.join(", ")}</span>
                    <span>&middot;</span>
                    <span>{team.region}</span>
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "#555" }}>{submitted}</span>
              </div>

              {/* Goals */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                {team.goals.map((g) => (
                  <span key={g} style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", color: "#888", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {g}
                  </span>
                ))}
              </div>

              {/* Actions row */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => toggleExpand(team.id)}
                  style={{ padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#888", cursor: "pointer" }}
                >
                  {isExpanded ? "Hide Players" : "View Players"}
                </button>

                {canModify && team.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(team.id, "approved")}
                      disabled={actionLoading === team.id}
                      style={{ padding: "5px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: "none", background: "rgba(34,197,94,0.15)", color: "#22c55e", cursor: "pointer" }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(team.id, "declined")}
                      disabled={actionLoading === team.id}
                      style={{ padding: "5px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", cursor: "pointer" }}
                    >
                      Decline
                    </button>
                  </>
                )}

                {canModify && (
                  <button
                    onClick={() => { setNoteEditing(noteEditing === team.id ? null : team.id); setNoteText(team.notes ?? ""); }}
                    style={{ padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#666", cursor: "pointer", marginLeft: "auto" }}
                  >
                    {team.notes ? "Edit Note" : "Add Note"}
                  </button>
                )}
              </div>

              {/* Note editor */}
              {noteEditing === team.id && canModify && (
                <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                  <input
                    style={{ flex: 1, background: "#222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "12px" }}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Internal note..."
                  />
                  <button
                    onClick={() => saveNote(team.id)}
                    style={{ padding: "8px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: "none", background: "#C8E400", color: "#111", cursor: "pointer" }}
                  >
                    Save
                  </button>
                </div>
              )}
              {team.notes && noteEditing !== team.id && (
                <p style={{ marginTop: "8px", fontSize: "11px", color: "#666", fontStyle: "italic" }}>Note: {team.notes}</p>
              )}

              {/* Expanded player list */}
              {isExpanded && (
                <div style={{ marginTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                  {teamPlayers.length === 0 ? (
                    <p style={{ color: "#555", fontSize: "12px" }}>Loading players...</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {teamPlayers.map((p) => (
                        <div key={p.id} style={{
                          display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
                          background: p.is_captain ? "rgba(200,228,0,0.04)" : "transparent",
                          border: p.is_captain ? "1px solid rgba(200,228,0,0.1)" : "1px solid rgba(255,255,255,0.04)",
                          borderRadius: "8px", padding: "8px 12px", fontSize: "12px",
                        }}>
                          {p.is_captain && <span style={{ fontSize: "10px", fontWeight: 700, color: "#C8E400" }}>CPT</span>}
                          <span style={{ color: "#fff", fontWeight: 600, minWidth: "80px" }}>{p.ign}</span>
                          <CopyField value={p.discord_handle} />
                          <span style={{ color: "#777" }}>{p.role}</span>
                          <span style={{ color: "#666" }}>{p.rank}</span>
                          <span style={{ color: "#555", fontSize: "10px" }}>{p.platform}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <span style={{ color: "#aaa", display: "flex", alignItems: "center", gap: "4px" }}>
      {value}
      <button onClick={copy} style={{ background: "none", border: "none", color: copied ? "#C8E400" : "#555", cursor: "pointer", fontSize: "10px" }}>
        {copied ? "✓" : "Copy"}
      </button>
    </span>
  );
}
