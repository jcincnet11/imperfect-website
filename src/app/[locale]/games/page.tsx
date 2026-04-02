"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { m } from "framer-motion";

const GAMES = [
  {
    name: "Marvel Rivals", short: "MR", color: "#C8E400", status: "Active", format: "6v6", region: "PR #1", teams: 3,
    description: "Marvel's explosive hero shooter — built around teamwork, synergy, and split-second reads. IMPerfect fielded three teams from day one and immediately established Puerto Rico's dominant presence.",
    roles: [
      { name: "Duelist",    color: "#E74C3C", desc: "High-damage fraggers who create space and secure eliminations." },
      { name: "Vanguard",   color: "#3A7BD5", desc: "Frontline tanks who anchor the team and create opportunities." },
      { name: "Strategist", color: "#C8E400", desc: "Support players who sustain teammates and control the flow of fights." },
    ],
    highlights: ["3 active rosters — IMPerfect, Shadows, Echoes", "Puerto Rico's top-ranked organization", "Full coaching staff across all three teams"],
  },
  {
    name: "Overwatch 2", short: "OW2", color: "#F99E1A", status: "Building", format: "5v5", region: "PR", teams: 0,
    description: "Blizzard's flagship hero shooter with one of the most established competitive ecosystems in esports. IMPerfect competed in OW2 since the org's early days and is actively rebuilding its roster.",
    roles: [
      { name: "Tank",    color: "#F99E1A", desc: "The anchor — controls space and enables the team." },
      { name: "DPS",     color: "#E74C3C", desc: "Damage dealers who create picks and win duels." },
      { name: "Support", color: "#27AE60", desc: "Keep the team alive and boost their effectiveness." },
    ],
    highlights: ["20+ tournaments competed historically", "Strong alumni network", "Roster reconstruction underway"],
  },
];

export default function GamesPage() {
  const locale = useLocale();

  return (
    <main style={{ background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <section style={{ padding: "120px 24px 64px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <Link href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#555555", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "32px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8E400")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}>
            ← Back
          </Link>
          <span className="eyebrow">Competitive</span>
          <h1 className="font-heading font-black uppercase text-white" style={{ fontSize: "clamp(48px, 10vw, 88px)", lineHeight: 0.92, marginBottom: "16px" }}>Our Games</h1>
          <p style={{ fontSize: "15px", color: "#888888", maxWidth: "400px", lineHeight: 1.65 }}>
            Hero shooters are our home. We compete where the competition is hardest.
          </p>
        </div>
      </section>

      {/* Game sections */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {GAMES.map((game, gi) => (
          <m.div
            key={game.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
            style={{ background: "#222222", border: "1px solid #2A2A2A", borderRadius: "8px", overflow: "hidden", position: "relative" }}
          >
            {/* Top accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: game.color }} />

            <div style={{ padding: "32px" }}>
              {/* Header row */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6" style={{ marginBottom: "32px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span
                      className="font-heading font-bold uppercase"
                      style={{ fontSize: "10px", letterSpacing: "0.18em", color: game.color, background: `${game.color}14`, border: `1px solid ${game.color}40`, padding: "3px 10px", borderRadius: "3px" }}
                    >
                      {game.short}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: game.status === "Active" ? game.color : "#555555" }} />
                      <span className="font-heading font-bold uppercase" style={{ fontSize: "10px", color: "#555555", letterSpacing: "0.15em" }}>{game.status}</span>
                    </span>
                  </div>
                  <h2 className="font-heading font-black uppercase" style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "#FFFFFF", lineHeight: 1, marginBottom: "12px" }}>{game.name}</h2>
                  <p style={{ fontSize: "14px", color: "#888888", lineHeight: 1.65, maxWidth: "480px" }}>{game.description}</p>
                </div>
                <div style={{ display: "flex", gap: "32px", flexShrink: 0 }}>
                  {[{ label: "Format", value: game.format }, { label: "Region", value: game.region }, { label: "Teams", value: game.teams > 0 ? String(game.teams) : "—" }].map((s) => (
                    <div key={s.label}>
                      <p className="font-heading font-black" style={{ fontSize: "24px", color: game.color, lineHeight: 1 }}>{s.value}</p>
                      <p style={{ fontSize: "10px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "4px" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8" style={{ paddingTop: "24px", borderTop: "1px solid #2A2A2A" }}>
                {/* Roles */}
                <div>
                  <p className="font-heading font-bold uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#555555", marginBottom: "16px" }}>Roles</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {game.roles.map((role) => (
                      <div key={role.name} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", borderRadius: "6px", background: "#1A1A1A", border: `1px solid ${role.color}18` }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: role.color, flexShrink: 0, marginTop: "6px" }} />
                        <div>
                          <p className="font-heading font-bold uppercase" style={{ fontSize: "13px", color: role.color }}>{role.name}</p>
                          <p style={{ fontSize: "12px", color: "#555555", marginTop: "2px" }}>{role.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <p className="font-heading font-bold uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#555555", marginBottom: "16px" }}>Highlights</p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {game.highlights.map((h) => (
                      <li key={h} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#C8E400", flexShrink: 0, marginTop: "6px" }} />
                        <span style={{ fontSize: "14px", color: "#888888" }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {game.status === "Active" && (
                    <Link href={`/${locale}/team`} className="btn-primary" style={{ marginTop: "24px", display: "inline-flex" }}>
                      View Roster →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </m.div>
        ))}
      </div>
    </main>
  );
}
