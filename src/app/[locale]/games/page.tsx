"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const GAMES = [
  {
    name: "Marvel Rivals",
    short: "MR",
    color: "#c5d400",
    status: "Active",
    format: "6v6",
    region: "PR #1",
    teams: 3,
    description:
      "Marvel's explosive hero shooter — built around teamwork, synergy, and split-second reads. IMPerfect fielded three teams from day one and immediately established Puerto Rico's dominant presence in the competitive scene.",
    roles: [
      { name: "Duelist",    color: "#E74C3C", desc: "High-damage fraggers who create space and secure eliminations." },
      { name: "Vanguard",   color: "#3A7BD5", desc: "Frontline tanks who anchor the team and create opportunities." },
      { name: "Strategist", color: "#c5d400", desc: "Support players who sustain teammates and control the flow of fights." },
    ],
    highlights: [
      "3 active rosters — IMPerfect, Shadows, Echoes",
      "Puerto Rico's top-ranked organization",
      "Full coaching staff across all three teams",
    ],
  },
  {
    name: "Overwatch 2",
    short: "OW2",
    color: "#F99E1A",
    status: "Building",
    format: "5v5",
    region: "PR",
    teams: 0,
    description:
      "Blizzard's flagship hero shooter with one of the most established competitive ecosystems in esports. IMPerfect competed in OW2 since the org's early days and is actively rebuilding its roster for the next season.",
    roles: [
      { name: "Tank",    color: "#F99E1A", desc: "The anchor — controls space and enables the team." },
      { name: "DPS",     color: "#E74C3C", desc: "Damage dealers who create picks and win duels." },
      { name: "Support", color: "#27AE60", desc: "Keep the team alive and boost their effectiveness." },
    ],
    highlights: [
      "20+ tournaments competed historically",
      "Strong alumni network",
      "Roster reconstruction underway",
    ],
  },
];

export default function GamesPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-dark">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-lime transition-colors mb-8 uppercase tracking-widest font-semibold"
            >
              ← Back
            </Link>
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-3">
              Competitive
            </p>
            <h1
              className="font-heading font-black uppercase text-white leading-none"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
            >
              Our Games
            </h1>
            <p className="mt-4 text-white/40 text-sm max-w-md">
              Hero shooters are our home. We compete where the competition is hardest.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Game sections */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {GAMES.map((game, gi) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "#111", border: `1px solid ${game.color}20` }}
          >
            {/* Top accent */}
            <div
              className="h-px w-full"
              style={{ background: `linear-gradient(90deg, transparent, ${game.color}, transparent)` }}
            />

            <div className="p-8 md:p-12">
              {/* Header row */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded"
                      style={{ color: game.color, background: `${game.color}15`, border: `1px solid ${game.color}25` }}
                    >
                      {game.short}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: game.status === "Active" ? game.color : "#7F8C8D",
                          animation: game.status === "Active" ? "pulse 2s infinite" : "none",
                        }}
                      />
                      <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">
                        {game.status}
                      </span>
                    </span>
                  </div>
                  <h2
                    className="font-heading font-black uppercase leading-none"
                    style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: game.color }}
                  >
                    {game.name}
                  </h2>
                  <p className="mt-4 text-white/45 text-sm leading-relaxed max-w-lg">
                    {game.description}
                  </p>
                </div>

                {/* Quick stats */}
                <div className="flex gap-8 shrink-0">
                  {[
                    { label: "Format", value: game.format },
                    { label: "Region", value: game.region },
                    { label: "Teams",  value: game.teams > 0 ? String(game.teams) : "—" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="font-heading font-black text-2xl uppercase" style={{ color: game.color }}>
                        {s.value}
                      </p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Roles */}
                <div>
                  <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mb-4">
                    Roles
                  </p>
                  <div className="space-y-3">
                    {game.roles.map((role) => (
                      <div
                        key={role.name}
                        className="flex items-start gap-3 p-3 rounded-lg"
                        style={{ background: `${role.color}08`, border: `1px solid ${role.color}15` }}
                      >
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: role.color }}
                        />
                        <div>
                          <p className="text-sm font-bold uppercase" style={{ color: role.color }}>
                            {role.name}
                          </p>
                          <p className="text-xs text-white/35 mt-0.5">{role.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mb-4">
                    Highlights
                  </p>
                  <ul className="space-y-3">
                    {game.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: game.color }} />
                        <span className="text-sm text-white/55">{h}</span>
                      </li>
                    ))}
                  </ul>

                  {game.status === "Active" && (
                    <Link
                      href={`/${locale}/team`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold group"
                      style={{ color: game.color }}
                    >
                      View Roster
                      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
