"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const WEEKLY_SCHEDULE = [
  { day: "MON", platform: "Twitter / X",  type: "Engagement", activity: "This or That poll — hero meta" },
  { day: "MON", platform: "Discord",       type: "Engagement", activity: "Discussion question in #general" },
  { day: "TUE", platform: "TikTok / IG",  type: "Content",    activity: "Player highlight clip" },
  { day: "WED", platform: "Twitter / X",  type: "Community",  activity: "Community clip shoutout" },
  { day: "WED", platform: "Discord",       type: "Engagement", activity: "Rank check-in in #ranked-talk" },
  { day: "THU", platform: "Instagram",    type: "Content",    activity: "Player spotlight carousel" },
  { day: "FRI", platform: "All Platforms",type: "Hype",       activity: "Weekend match hype post" },
  { day: "FRI", platform: "Discord",       type: "Community",  activity: "Friday open voice — casual hangout" },
  { day: "SAT", platform: "Twitch / YT",  type: "Content",    activity: "Live stream match or ranked session" },
  { day: "SUN", platform: "Discord",       type: "Engagement", activity: "Community vote — next week's event" },
  { day: "SUN", platform: "Twitter / X",  type: "Content",    activity: "Weekly recap — results + what's coming" },
];

const TYPE_COLORS: Record<string, string> = {
  Engagement: "#c5d400",
  Content:    "#3A7BD5",
  Hype:       "#E74C3C",
  Community:  "#9B59B6",
};

const MONTHLY_EVENTS = [
  {
    week: "Week 1",
    title: "Community Inhouse",
    desc: "Org-run 6v6 in Marvel Rivals — open to all Discord members. Announced one week ahead.",
  },
  {
    week: "Week 2",
    title: "Clip of the Month",
    desc: "Submit your best plays all month. Staff picks the winner. Prize: shoutout + exclusive Discord role.",
  },
  {
    week: "Week 3",
    title: "Watch Party",
    desc: "Watch a major MR or OW2 tournament together in voice. Live reactions and predictions.",
  },
  {
    week: "Week 4",
    title: "Giveaway Drop",
    desc: "Sponsor or org giveaway. Entry via Discord reaction or social repost.",
  },
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
    <main className="min-h-screen bg-dark">
      {/* Header */}
      <section className="pt-32 pb-20 px-6 border-b border-white/[0.06] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 70% at 60% 50%, rgba(88,101,242,0.05) 0%, transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto relative">
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
              Community
            </p>
            <h1
              className="font-heading font-black uppercase text-white leading-none mb-6"
              style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
            >
              More Than<br />a Team
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-xl mb-8">
              We're building the Puerto Rico gaming community — tournaments, events, content, and a place for every gamer on the island.
            </p>
            <Link
              href="https://discord.gg/VuTAEqPT"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#5865F2] text-white font-bold text-sm hover:bg-[#4752c4] transition-colors"
            >
              <svg width="18" height="14" viewBox="0 0 71 55" fill="none">
                <path d="M60.1 4.9A58.6 58.6 0 0 0 45.6.7a.2.2 0 0 0-.2.1 40.8 40.8 0 0 0-1.8 3.7 54.1 54.1 0 0 0-16.3 0A37.5 37.5 0 0 0 25.4.8a.2.2 0 0 0-.2-.1 58.4 58.4 0 0 0-14.5 4.2.2.2 0 0 0-.1.1C1.6 18.7-.9 32.2.3 45.4a.2.2 0 0 0 .1.2 58.9 58.9 0 0 0 17.7 8.9.2.2 0 0 0 .2-.1 42 42 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.8 38.8 0 0 1-5.5-2.6.2.2 0 0 1 0-.4l1.1-.8a.2.2 0 0 1 .2 0c11.6 5.3 24.1 5.3 35.5 0a.2.2 0 0 1 .2 0l1.1.8a.2.2 0 0 1 0 .4 36.1 36.1 0 0 1-5.5 2.6.2.2 0 0 0-.1.3 47.1 47.1 0 0 0 3.6 5.9.2.2 0 0 0 .2.1 58.7 58.7 0 0 0 17.8-8.9.2.2 0 0 0 .1-.2c1.4-15.2-2.4-28.5-10.1-40.3a.2.2 0 0 0-.1-.1ZM23.7 37.3c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1Z" fill="currentColor"/>
              </svg>
              Join Our Discord
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Monthly events */}
      <section className="py-20 px-6 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-3">Monthly</p>
            <h2 className="font-heading font-black uppercase text-white leading-none" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              Events Calendar
            </h2>
            <p className="mt-3 text-white/40 text-sm max-w-md">Every month, every week — something happening for the community.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MONTHLY_EVENTS.map((event, i) => (
              <motion.div
                key={event.week}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-xl bg-[#111] border border-white/[0.07]"
              >
                <p className="text-[10px] text-lime font-black uppercase tracking-widest mb-3">{event.week}</p>
                <h3 className="font-heading font-black uppercase text-white text-lg mb-2">{event.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{event.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly schedule */}
      <section className="py-20 px-6 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-3">Weekly</p>
            <h2 className="font-heading font-black uppercase text-white leading-none" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              Content Schedule
            </h2>
          </motion.div>
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
            {WEEKLY_SCHEDULE.map((item, i) => (
              <motion.div
                key={`${item.day}-${item.platform}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.05] last:border-0"
              >
                <span className="w-10 text-[11px] font-black uppercase text-white/25 shrink-0">{item.day}</span>
                <span
                  className="w-20 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider shrink-0 text-center"
                  style={{
                    color: TYPE_COLORS[item.type],
                    background: `${TYPE_COLORS[item.type]}15`,
                    border: `1px solid ${TYPE_COLORS[item.type]}25`,
                  }}
                >
                  {item.type}
                </span>
                <span className="text-xs text-white/30 w-28 shrink-0">{item.platform}</span>
                <span className="text-sm text-white/60">{item.activity}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth milestones */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-3">Growth</p>
            <h2 className="font-heading font-black uppercase text-white leading-none" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              Discord Milestones
            </h2>
            <p className="mt-3 text-white/40 text-sm max-w-md">
              Every milestone unlocks something for the community. Help us get there.
            </p>
          </motion.div>
          <div className="space-y-3">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.count}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-center gap-6 p-5 rounded-xl bg-[#111] border border-white/[0.07]"
              >
                <div className="shrink-0 text-right w-24">
                  <span className="font-heading font-black text-2xl text-lime">{m.count}</span>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider">{m.label}</p>
                </div>
                <div className="w-px h-8 bg-white/[0.08] shrink-0" />
                <p className="text-sm text-white/50">{m.reward}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
