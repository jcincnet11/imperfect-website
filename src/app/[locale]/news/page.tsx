"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const COMING_SOON_ITEMS = [
  { icon: "🏆", label: "Tournament Recaps" },
  { icon: "🎮", label: "Roster Announcements" },
  { icon: "🤝", label: "Partnership News" },
  { icon: "📅", label: "Event Coverage" },
  { icon: "👤", label: "Player Spotlights" },
  { icon: "📊", label: "Season Updates" },
];

export default function NewsPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-dark">
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
              Latest
            </p>
            <h1
              className="font-heading font-black uppercase text-white leading-none"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
            >
              News
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
            style={{ background: "rgba(197,212,0,0.08)", border: "1px solid rgba(197,212,0,0.2)", color: "#c5d400" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5d400] animate-pulse" />
            Coming Soon
          </div>

          <h2
            className="font-heading font-black uppercase text-white leading-none mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            The Feed is Loading
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-12">
            We're setting up our news hub. Follow us on Discord and social media for the latest updates in the meantime.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
            {COMING_SOON_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="p-4 rounded-xl bg-[#111] border border-white/[0.07] text-center"
              >
                <span className="text-2xl block mb-2">{item.icon}</span>
                <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">{item.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://discord.gg/VuTAEqPT"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-[#5865F2] text-white font-bold text-sm hover:bg-[#4752c4] transition-colors"
            >
              Follow on Discord
            </Link>
            <Link
              href={`/${locale}`}
              className="px-8 py-4 rounded-full border border-white/10 text-white/50 text-sm font-medium hover:border-white/20 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
