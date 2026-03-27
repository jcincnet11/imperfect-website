"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const PHASES = [
  {
    number: "01",
    name: "Foundation & Brand",
    period: "Months 1–2",
    color: "#c5d400",
    status: "In Progress",
    milestones: [
      "Finalize brand identity, logo, and visual system",
      "Build and launch the org website",
      "Set up all social media channels",
      "Create sponsorship deck",
      "Discord server setup",
    ],
  },
  {
    number: "02",
    name: "Growth & Competition",
    period: "Months 3–4",
    color: "#3A7BD5",
    status: "Upcoming",
    milestones: [
      "Finalize all team rosters",
      "Register for 3+ open tournaments",
      "Launch weekly content schedule",
      "Close first 2–3 sponsorships",
      "Reach 1K combined social followers",
    ],
  },
  {
    number: "03",
    name: "Scale & Monetize",
    period: "Months 5–6",
    color: "#9B59B6",
    status: "Upcoming",
    milestones: [
      "Scale to 5–8 active sponsors",
      "Launch merchandise store",
      "Enter LAN and regional championships",
      "Reach 5K+ Discord members",
      "10K+ combined social followers",
    ],
  },
];

const VALUES = [
  {
    icon: "🇵🇷",
    title: "Island First",
    body: "Every match we play, every tournament we enter — we're representing Puerto Rico. That's not a slogan. It's why this org exists.",
  },
  {
    icon: "⚡",
    title: "Compete Hard",
    body: "We don't show up to participate. We show up to win. Every roster member, every coach, every team — the standard is high.",
  },
  {
    icon: "🤝",
    title: "Build Together",
    body: "This isn't just a team. It's a community. We grow with our players, our fans, and every gamer on the island.",
  },
  {
    icon: "📈",
    title: "Think Long Term",
    body: "We're not a flash in the pan. We're building infrastructure, developing talent, and creating an org that lasts.",
  },
];

export default function AboutPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-dark">
      {/* Header */}
      <section className="pt-32 pb-20 px-6 border-b border-white/[0.06] overflow-hidden relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 80% 50%, rgba(197,212,0,0.04) 0%, transparent 70%)" }}
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
              Our Story
            </p>
            <h1
              className="font-heading font-black uppercase text-white leading-none mb-6"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
            >
              Built in<br />Puerto Rico
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-xl">
              IMPerfect was born from a simple belief — that Puerto Rico has world-class talent
              that deserves a world-class stage. We built this org from the ground up, competing,
              grinding, and representing the island in every match we play.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-3">
              What We Stand For
            </p>
            <h2
              className="font-heading font-black uppercase text-white leading-none"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Core Values
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-xl bg-[#111] border border-white/[0.07]"
              >
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className="font-heading font-black uppercase text-lime text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 px-6 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-3">
              The Plan
            </p>
            <h2
              className="font-heading font-black uppercase text-white leading-none"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              6-Month Roadmap
            </h2>
            <p className="mt-3 text-white/40 text-sm max-w-md">
              Three phases. Clear milestones. We're executing this publicly so our community can follow the journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PHASES.map((phase, i) => (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative rounded-2xl p-6"
                style={{ background: "#111", border: `1px solid ${phase.color}20` }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${phase.color}60, transparent)` }}
                />
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="font-heading font-black text-5xl leading-none opacity-20"
                    style={{ color: phase.color }}
                  >
                    {phase.number}
                  </span>
                  <span
                    className="text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest"
                    style={{
                      color: phase.status === "In Progress" ? phase.color : "rgba(255,255,255,0.3)",
                      background: phase.status === "In Progress" ? `${phase.color}15` : "rgba(255,255,255,0.05)",
                      border: `1px solid ${phase.status === "In Progress" ? phase.color + "30" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    {phase.status}
                  </span>
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{phase.period}</p>
                <h3
                  className="font-heading font-black uppercase text-xl mb-5"
                  style={{ color: phase.color }}
                >
                  {phase.name}
                </h3>
                <ul className="space-y-2.5">
                  {phase.milestones.map((m) => (
                    <li key={m} className="flex items-start gap-2.5">
                      <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: phase.color }} />
                      <span className="text-xs text-white/45 leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h2
              className="font-heading font-black uppercase text-white leading-none mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Want In?
            </h2>
            <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
              Join our Discord community or reach out about sponsorship opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://discord.gg/VuTAEqPT"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-[#5865F2] text-white font-bold text-sm hover:bg-[#4752c4] transition-colors"
              >
                Join Discord
              </Link>
              <Link
                href={`/${locale}/sponsorship`}
                className="px-8 py-4 rounded-full border border-lime/20 text-lime font-bold text-sm hover:bg-lime/5 transition-colors"
              >
                Partner With Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
