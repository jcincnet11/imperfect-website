"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const TIERS = [
  { name: "Associate",    color: "#7F8C8D" },
  { name: "Partner",      color: "#c5d400" },
  { name: "Title Sponsor",color: "#E74C3C" },
];

const PLATFORMS = ["Twitch", "TikTok", "Instagram", "YouTube", "Discord", "Twitter/X"];

export default function SponsorshipTeaser() {
  const locale = useLocale();

  return (
    <section className="py-24 px-6 bg-dark border-t border-white/[0.06] overflow-hidden relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(197,212,0,0.04) 0%, transparent 65%)" }}
      />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-4">
              Partners
            </p>
            <h2
              className="font-heading font-black uppercase text-white leading-none mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Partner<br />With Us
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-md">
              Puerto Rico's #1 hero shooter org. Reach a passionate, hyper-engaged gaming audience
              across 6 platforms — streaming, social, Discord, and live events.
            </p>

            {/* Platform tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {PLATFORMS.map((p) => (
                <span
                  key={p}
                  className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded border border-white/[0.08] text-white/30"
                >
                  {p}
                </span>
              ))}
            </div>

            <Link
              href={`/${locale}/sponsorship`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm text-dark transition-all hover:scale-[1.02] duration-150"
              style={{ backgroundColor: "#c5d400" }}
            >
              View Partnership Tiers
              <span>→</span>
            </Link>
          </motion.div>

          {/* Right — tier cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
                className="flex items-center justify-between p-5 rounded-xl"
                style={{
                  background: `${tier.color}06`,
                  border: `1px solid ${tier.color}20`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
                  <span className="font-heading font-black uppercase text-lg" style={{ color: tier.color }}>
                    {tier.name}
                  </span>
                </div>
              </motion.div>
            ))}

            <div className="pt-4 border-t border-white/[0.06]">
              <a
                href="mailto:sponsorships@imperfectorg.gg"
                className="flex items-center justify-between text-sm text-white/30 hover:text-lime transition-colors group"
              >
                <span>sponsorships@imperfectorg.gg</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
