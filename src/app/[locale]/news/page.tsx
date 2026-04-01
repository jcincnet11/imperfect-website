"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const COMING_SOON_ITEMS = [
  { label: "Tournament Recaps" },
  { label: "Roster Announcements" },
  { label: "Partnership News" },
  { label: "Event Coverage" },
  { label: "Player Spotlights" },
  { label: "Season Updates" },
];

export default function NewsPage() {
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
          <span className="eyebrow">Latest</span>
          <h1 className="font-heading font-black uppercase text-white" style={{ fontSize: "clamp(48px, 10vw, 88px)", lineHeight: 0.92, marginBottom: "16px" }}>News</h1>
          <p style={{ fontSize: "15px", color: "#888888", maxWidth: "400px", lineHeight: 1.65 }}>
            Org updates, tournament recaps, and player news.
          </p>
        </div>
      </section>

      {/* Coming soon */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="font-heading font-bold uppercase"
            style={{ fontSize: "10px", letterSpacing: "0.15em", padding: "4px 12px", borderRadius: "3px", color: "#C8E400", background: "rgba(200,228,0,0.08)", border: "1px solid rgba(200,228,0,0.2)", display: "inline-block", marginBottom: "24px" }}
          >
            Coming Soon
          </span>

          <h2 className="font-heading font-black uppercase text-white" style={{ fontSize: "clamp(28px, 5vw, 48px)", lineHeight: 0.95, marginBottom: "16px" }}>
            The Feed Is<br />Loading
          </h2>
          <p style={{ fontSize: "14px", color: "#888888", lineHeight: 1.65, marginBottom: "48px" }}>
            We're setting up our news hub. Follow us on Discord and social media for updates in the meantime.
          </p>

          {/* Content type grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" style={{ marginBottom: "48px" }}>
            {COMING_SOON_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                style={{ padding: "16px", background: "#222222", border: "1px solid #2A2A2A", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#C8E400", flexShrink: 0 }} />
                <span className="font-heading font-bold uppercase" style={{ fontSize: "10px", color: "#888888", letterSpacing: "0.12em" }}>{item.label}</span>
              </motion.div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="https://discord.gg/VuTAEqPT" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Join Discord
            </Link>
            <Link href={`/${locale}`} className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
