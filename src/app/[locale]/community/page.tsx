"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const WEEKLY = [
  { day: "MON", type: "Engagement", platform: "Twitter / X",   activity: "This or That poll — hero meta" },
  { day: "MON", type: "Engagement", platform: "Discord",        activity: "Discussion question in #general" },
  { day: "TUE", type: "Content",    platform: "TikTok / IG",   activity: "Player highlight clip" },
  { day: "WED", type: "Community",  platform: "Twitter / X",   activity: "Community clip shoutout" },
  { day: "WED", type: "Engagement", platform: "Discord",        activity: "Rank check-in in #ranked-talk" },
  { day: "THU", type: "Content",    platform: "Instagram",      activity: "Player spotlight carousel" },
  { day: "FRI", type: "Hype",       platform: "All Platforms",  activity: "Weekend match hype post" },
  { day: "FRI", type: "Community",  platform: "Discord",        activity: "Friday open voice — casual hangout" },
  { day: "SAT", type: "Content",    platform: "Twitch / YT",   activity: "Live stream match or ranked session" },
  { day: "SUN", type: "Engagement", platform: "Discord",        activity: "Community vote — next week's event" },
  { day: "SUN", type: "Content",    platform: "Twitter / X",   activity: "Weekly recap — results + what's coming" },
];

const TYPE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  Engagement: { bg: "rgba(200,228,0,0.08)",   color: "#C8E400", border: "rgba(200,228,0,0.3)" },
  Content:    { bg: "rgba(29,158,117,0.08)",   color: "#1D9E75", border: "rgba(29,158,117,0.3)" },
  Hype:       { bg: "rgba(231,76,60,0.08)",    color: "#E74C3C", border: "rgba(231,76,60,0.3)" },
  Community:  { bg: "rgba(88,101,242,0.08)",   color: "#5865F2", border: "rgba(88,101,242,0.3)" },
};

const MONTHLY_EVENTS = [
  { week: "Week 1", title: "Community Inhouse",  desc: "Org-run 6v6 in Marvel Rivals — open to all Discord members. Announced one week ahead." },
  { week: "Week 2", title: "Clip of the Month",  desc: "Submit your best plays all month. Staff picks the winner. Prize: shoutout + exclusive Discord role." },
  { week: "Week 3", title: "Watch Party",         desc: "Watch a major MR or OW2 tournament together in voice. Live reactions and predictions." },
  { week: "Week 4", title: "Giveaway Drop",       desc: "Sponsor or org giveaway. Entry via Discord reaction or social repost." },
];

const MILESTONES = [
  { count: "100",   label: "members", reward: "Community inhouse tournament unlocked" },
  { count: "250",   label: "members", reward: "Discord-exclusive giveaway + dedicated game channels" },
  { count: "500",   label: "members", reward: "Monthly sponsor giveaway slot" },
  { count: "1,000", label: "members", reward: "Press release + partner outreach" },
  { count: "5,000", label: "members", reward: "Full community tournament series + merch drop" },
];

export default function CommunityPage() {
  const locale = useLocale();

  return (
    <main style={{ background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <section style={{ paddingTop: "120px", paddingBottom: "64px", padding: "120px 24px 64px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <Link href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#555555", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "32px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8E400")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}>
            ← Back
          </Link>
          <span className="eyebrow">Community</span>
          <h1 className="font-heading font-black uppercase text-white" style={{ fontSize: "clamp(48px, 10vw, 88px)", lineHeight: 0.92, marginBottom: "20px" }}>
            More Than<br />a Team
          </h1>
          <p style={{ fontSize: "15px", color: "#888888", maxWidth: "520px", lineHeight: 1.65, marginBottom: "32px" }}>
            We're building the Puerto Rico gaming community — tournaments, events, content, and a place for every gamer on the island.
          </p>
          <Link href="https://discord.gg/VuTAEqPT" target="_blank" rel="noopener noreferrer" className="btn-primary">
            Join Our Discord
          </Link>
        </div>
      </section>

      {/* Monthly events */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "48px" }}>
            <span className="eyebrow">Monthly</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "12px" }}>Events Calendar</h2>
            <p style={{ fontSize: "14px", color: "#888888", maxWidth: "400px", lineHeight: 1.65 }}>Every month, every week — something happening for the community.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MONTHLY_EVENTS.map((event, i) => (
              <motion.div
                key={event.week}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ background: "#222222", border: "1px solid #2A2A2A", borderTop: "3px solid #C8E400", borderRadius: "8px", padding: "20px" }}
              >
                <p className="font-heading font-bold uppercase" style={{ fontSize: "10px", color: "#C8E400", letterSpacing: "0.18em", marginBottom: "8px" }}>{event.week}</p>
                <h3 className="font-heading font-black uppercase" style={{ fontSize: "18px", color: "#FFFFFF", marginBottom: "8px" }}>{event.title}</h3>
                <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6 }}>{event.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly schedule */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "48px" }}>
            <span className="eyebrow">Weekly</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)" }}>Content Schedule</h2>
          </motion.div>
          <div style={{ background: "#222222", border: "1px solid #2A2A2A", borderRadius: "8px", overflow: "hidden" }}>
            {WEEKLY.map((item, i) => {
              const ts = TYPE_STYLE[item.type];
              return (
                <motion.div
                  key={`${item.day}-${item.platform}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 20px", borderBottom: i < WEEKLY.length - 1 ? "1px solid #1F1F1F" : "none" }}
                >
                  <span className="font-heading font-bold uppercase" style={{ fontSize: "10px", letterSpacing: "0.15em", background: "#2A2A2A", color: "#888888", padding: "3px 8px", borderRadius: "3px", minWidth: "36px", textAlign: "center", flexShrink: 0 }}>
                    {item.day}
                  </span>
                  <span
                    className="font-heading font-bold uppercase"
                    style={{ fontSize: "10px", letterSpacing: "0.10em", padding: "2px 8px", borderRadius: "3px", background: ts.bg, color: ts.color, border: `1px solid ${ts.border}`, flexShrink: 0, minWidth: "88px", textAlign: "center" }}
                  >
                    {item.type}
                  </span>
                  <span style={{ fontSize: "12px", color: "#555555", flexShrink: 0, minWidth: "100px" }}>{item.platform}</span>
                  <span style={{ fontSize: "13px", color: "#888888" }}>{item.activity}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "48px" }}>
            <span className="eyebrow">Growth</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "12px" }}>Discord Milestones</h2>
            <p style={{ fontSize: "14px", color: "#888888", maxWidth: "400px", lineHeight: 1.65 }}>Every milestone unlocks something for the community. Help us get there.</p>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.count}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{ display: "flex", alignItems: "center", gap: "24px", padding: "20px 0", borderBottom: i < MILESTONES.length - 1 ? "1px solid #1F1F1F" : "none" }}
              >
                <div style={{ flexShrink: 0, minWidth: "80px" }}>
                  <p className="font-heading font-black" style={{ fontSize: "36px", color: "#C8E400", lineHeight: 1 }}>{m.count}</p>
                  <p style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.10em" }}>{m.label}</p>
                </div>
                <div style={{ width: "1px", height: "40px", background: "#2A2A2A", flexShrink: 0 }} />
                <p style={{ fontSize: "13px", color: "#888888" }}>{m.reward}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
