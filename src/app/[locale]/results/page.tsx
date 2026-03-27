"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const ACHIEVEMENTS = [
  { label: "20+", desc: "Tournaments Competed" },
  { label: "PR #1", desc: "Marvel Rivals Region" },
  { label: "PR #1", desc: "Overwatch 2 Region" },
  { label: "3", desc: "Active Teams" },
];

const RESULTS = [
  {
    year: "2024–25",
    game: "Marvel Rivals",
    gameColor: "#c5d400",
    entries: [
      { event: "MR Puerto Rico Open — Season 1", placement: "1st Place",  highlight: true },
      { event: "MR Island Clash Invitational",   placement: "Top 4",      highlight: false },
      { event: "MR Caribbean Cup — Qualifier",   placement: "Qualified",  highlight: false },
    ],
  },
  {
    year: "2023–24",
    game: "Overwatch 2",
    gameColor: "#F99E1A",
    entries: [
      { event: "OW2 Puerto Rico Open",           placement: "1st Place",  highlight: true },
      { event: "OW2 PR League — Spring Split",   placement: "Top 2",      highlight: false },
      { event: "OW2 PR League — Fall Split",     placement: "Top 4",      highlight: false },
      { event: "OW2 Caribbean Qualifier",        placement: "Top 8",      highlight: false },
    ],
  },
];

const PLACEMENT_COLOR: Record<string, string> = {
  "1st Place": "#c5d400",
  "Top 2":     "#F99E1A",
  "Top 4":     "#3A7BD5",
  "Top 8":     "#7F8C8D",
  "Qualified": "#27AE60",
};

export default function ResultsPage() {
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
              Tournament History
            </p>
            <h1
              className="font-heading font-black uppercase text-white leading-none"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
            >
              Results
            </h1>
            <p className="mt-4 text-white/40 text-sm max-w-md">
              Every bracket entered. Every placement earned.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievement stats */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.desc}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`flex flex-col py-10 px-6 ${i < ACHIEVEMENTS.length - 1 ? "border-r border-white/[0.06]" : ""}`}
              >
                <span className="font-heading font-black text-lime leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                  {a.label}
                </span>
                <span className="mt-2 text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold">
                  {a.desc}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results table */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        {RESULTS.map((section, si) => (
          <motion.div
            key={section.year}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: si * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span
                className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] rounded"
                style={{ color: section.gameColor, background: `${section.gameColor}15`, border: `1px solid ${section.gameColor}25` }}
              >
                {section.game}
              </span>
              <span className="text-sm text-white/25 font-semibold">{section.year}</span>
            </div>
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
              {section.entries.map((entry, ei) => (
                <div
                  key={entry.event}
                  className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] last:border-0"
                  style={entry.highlight ? { background: `${section.gameColor}06` } : {}}
                >
                  <div className="flex items-center gap-3">
                    {entry.highlight && (
                      <span className="text-sm">🏆</span>
                    )}
                    <span className={`text-sm ${entry.highlight ? "text-white font-semibold" : "text-white/60"}`}>
                      {entry.event}
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded shrink-0"
                    style={{
                      color: PLACEMENT_COLOR[entry.placement] ?? "#7F8C8D",
                      background: `${PLACEMENT_COLOR[entry.placement] ?? "#7F8C8D"}15`,
                    }}
                  >
                    {entry.placement}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Coming soon notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-8"
        >
          <p className="text-xs text-white/20 uppercase tracking-widest">
            Full tournament archive coming soon — we're documenting every run.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
