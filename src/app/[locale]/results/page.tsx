"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const ACHIEVEMENTS = [
  { label: "5",     desc: "Tournament Wins" },
  { label: "PR #1", desc: "Marvel Rivals" },
  { label: "PR #1", desc: "Overwatch 2" },
  { label: "3",     desc: "Active Teams" },
];

const RESULTS = [
  {
    game: "Marvel Rivals",
    gameColor: "#C8E400",
    entries: [
      { event: "UPRM Tournament", placement: "1st Place", highlight: true },
      { event: "Winter Clash",    placement: "1st Place", highlight: true },
    ],
  },
  {
    game: "Overwatch 2",
    gameColor: "#F99E1A",
    entries: [
      { event: "Estarei ×3",        placement: "1st Place", highlight: true },
      { event: "Heroes de La Bahía", placement: "1st Place", highlight: true },
      { event: "UPRM Tournament",   placement: "1st Place", highlight: true },
    ],
  },
];

const PLACEMENT_COLOR: Record<string, string> = {
  "1st Place": "#C8E400",
  "Top 2":     "#F99E1A",
  "Top 4":     "#3A7BD5",
  "Top 8":     "#7F8C8D",
  "Qualified": "#27AE60",
};

export default function ResultsPage() {
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
          <span className="eyebrow">Tournament History</span>
          <h1 className="font-heading font-black uppercase text-white" style={{ fontSize: "clamp(48px, 10vw, 88px)", lineHeight: 0.92, marginBottom: "16px" }}>Results</h1>
          <p style={{ fontSize: "15px", color: "#888888", maxWidth: "400px", lineHeight: 1.65 }}>
            Every bracket entered. Every placement earned.
          </p>
        </div>
      </section>

      {/* Achievement stats */}
      <section style={{ borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.desc}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{
                  padding: "40px 24px",
                  borderRight: i < ACHIEVEMENTS.length - 1 ? "1px solid #1F1F1F" : "none",
                }}
              >
                <span className="font-heading font-black" style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "#C8E400", lineHeight: 1, display: "block" }}>
                  {a.label}
                </span>
                <span style={{ marginTop: "6px", display: "block", fontSize: "10px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700 }}>
                  {a.desc}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px", display: "flex", flexDirection: "column", gap: "48px" }}>
        {RESULTS.map((section, si) => (
          <motion.div
            key={section.game}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: si * 0.1 }}
          >
            {/* Game label */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: section.gameColor, flexShrink: 0 }} />
              <span
                className="font-heading font-bold uppercase"
                style={{ fontSize: "10px", letterSpacing: "0.18em", color: section.gameColor, background: `${section.gameColor}14`, border: `1px solid ${section.gameColor}40`, padding: "3px 10px", borderRadius: "3px" }}
              >
                {section.game}
              </span>
            </div>

            {/* Entries */}
            <div style={{ background: "#222222", border: "1px solid #2A2A2A", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: section.gameColor }} />
              {section.entries.map((entry, ei) => (
                <motion.div
                  key={entry.event}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: ei * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px",
                    borderBottom: ei < section.entries.length - 1 ? "1px solid #1F1F1F" : "none",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#C8E400", flexShrink: 0 }} />
                    <span style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: 600 }}>{entry.event}</span>
                  </div>
                  <span
                    className="font-heading font-bold uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      padding: "3px 10px",
                      borderRadius: "3px",
                      flexShrink: 0,
                      color: PLACEMENT_COLOR[entry.placement] ?? "#7F8C8D",
                      background: `${PLACEMENT_COLOR[entry.placement] ?? "#7F8C8D"}14`,
                      border: `1px solid ${PLACEMENT_COLOR[entry.placement] ?? "#7F8C8D"}40`,
                    }}
                  >
                    {entry.placement}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Archive notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", paddingTop: "16px" }}
        >
          <p className="font-heading font-bold uppercase" style={{ fontSize: "10px", color: "#333333", letterSpacing: "0.18em" }}>
            Full tournament archive coming soon — documenting every run.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
