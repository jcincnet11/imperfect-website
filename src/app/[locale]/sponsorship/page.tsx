"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const TIERS = [
  {
    name: "Associate",
    price: "Contra / Product",
    color: "#7F8C8D",
    highlight: false,
    description: "Get your brand in front of our audience with product placement and community exposure.",
    perks: [
      "Logo on team social posts",
      "Discord community shoutout",
      "Product placement in content",
      "2 branded posts per month",
    ],
  },
  {
    name: "Partner",
    price: "$250–$500 / mo",
    color: "#c5d400",
    highlight: true,
    description: "Full brand integration across stream, jerseys, and regular content — the most popular tier.",
    perks: [
      "Jersey logo placement",
      "Stream overlay branding",
      "5 branded posts per month",
      "Tournament coverage mention",
      "Monthly performance report",
    ],
  },
  {
    name: "Title Sponsor",
    price: "$750+ / mo",
    color: "#E74C3C",
    highlight: false,
    description: "Maximum exposure. Your brand at the forefront of everything we do.",
    perks: [
      "Primary jersey logo",
      "Naming rights to a team",
      "Exclusive content series",
      "Event co-branding",
      "10 branded posts per month",
      "Quarterly strategy call",
    ],
  },
];

const REASONS = [
  {
    number: "01",
    title: "Early Mover Advantage",
    body: "Get in at ground level with an org that's building momentum now — before prices rise.",
  },
  {
    number: "02",
    title: "Hyper-Engaged Audience",
    body: "Esports fans are 4× more likely to purchase from sponsors they see in the gaming ecosystem.",
  },
  {
    number: "03",
    title: "Multi-Platform Exposure",
    body: "Your brand reaches audiences across Twitch, TikTok, Instagram, YouTube, Discord, and live events.",
  },
  {
    number: "04",
    title: "Local & Regional Impact",
    body: "Build authentic ties with the Puerto Rico gaming community — a passionate and underserved market.",
  },
];

export default function SponsorshipPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-dark">
      {/* Header */}
      <section className="pt-32 pb-20 px-6 border-b border-white/[0.06] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(197,212,0,0.05) 0%, transparent 65%)" }}
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
              Partners
            </p>
            <h1
              className="font-heading font-black uppercase text-white leading-none mb-6"
              style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
            >
              Partner<br />With Us
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-xl">
              Puerto Rico's #1 hero shooter org. Three active teams. A growing community.
              Reach a passionate gaming audience that actually buys.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why us */}
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
              The Case
            </p>
            <h2
              className="font-heading font-black uppercase text-white leading-none"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Why Partner With Us
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {REASONS.map((r, i) => (
              <motion.div
                key={r.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="p-6 rounded-xl bg-[#111] border border-white/[0.07] flex gap-5"
              >
                <span className="font-heading font-black text-4xl text-lime/15 leading-none shrink-0">
                  {r.number}
                </span>
                <div>
                  <h3 className="font-heading font-black uppercase text-white text-lg mb-2">{r.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{r.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
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
              Partnership Tiers
            </p>
            <h2
              className="font-heading font-black uppercase text-white leading-none"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Choose Your Level
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative rounded-2xl p-7 flex flex-col"
                style={{
                  background: tier.highlight ? `${tier.color}08` : "#111",
                  border: `1px solid ${tier.color}${tier.highlight ? "40" : "20"}`,
                }}
              >
                {tier.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                    style={{ backgroundColor: tier.color, color: "#000" }}
                  >
                    Most Popular
                  </div>
                )}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }}
                />
                <div className="mb-6">
                  <h3
                    className="font-heading font-black uppercase text-2xl mb-1"
                    style={{ color: tier.color }}
                  >
                    {tier.name}
                  </h3>
                  <p className="text-white/50 text-sm font-semibold">{tier.price}</p>
                </div>
                <p className="text-sm text-white/40 leading-relaxed mb-6">{tier.description}</p>
                <ul className="space-y-2.5 flex-1 mb-8">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: tier.color }} />
                      <span className="text-sm text-white/60">{perk}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:sponsorships@imperfectorg.gg"
                  className="block text-center py-3 rounded-xl text-sm font-bold transition-all duration-150"
                  style={
                    tier.highlight
                      ? { backgroundColor: tier.color, color: "#000" }
                      : { border: `1px solid ${tier.color}40`, color: tier.color, background: "transparent" }
                  }
                >
                  Get Started
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2
              className="font-heading font-black uppercase text-white leading-none mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Ready to Talk?
            </h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              We keep things simple. Send us an email and we'll get back to you within 48 hours.
            </p>
            <a
              href="mailto:sponsorships@imperfectorg.gg"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-sm text-dark transition-all hover:scale-[1.02] duration-150"
              style={{ backgroundColor: "#c5d400" }}
            >
              sponsorships@imperfectorg.gg
              <span>→</span>
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
