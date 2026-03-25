"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-dark">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      {/* Lime glow behind text */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[70vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(197,212,0,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Tag — top of page */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute top-28 left-6 md:left-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime/25 bg-lime/5">
          <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
          <span className="text-[10px] text-lime font-semibold tracking-[0.2em] uppercase">
            {t("tag")}
          </span>
        </div>
      </motion.div>

      {/* Main headline — 100T style: massive, fills viewport, tight stack */}
      <div className="relative z-10 px-4 md:px-8 pb-10 md:pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-heading font-black uppercase leading-[0.85] tracking-tighter"
        >
          {/* "WE ARE" line */}
          <div
            className="text-white/20 select-none"
            style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
          >
            {t("headline")}
          </div>

          {/* "IMPERFECT" — viewport filling */}
          <div
            className="relative"
            style={{ fontSize: "clamp(5.5rem, 18vw, 18rem)", lineHeight: 0.85 }}
          >
            <span className="text-lime glow-lime-text">IM</span>
            <span className="text-white">PERFECT</span>
          </div>

          {/* "PUERTO RICO" subline */}
          <div
            className="text-white/15 select-none mt-2"
            style={{ fontSize: "clamp(2rem, 5.5vw, 5rem)" }}
          >
            PUERTO RICO 🇵🇷
          </div>
        </motion.div>

        {/* Bottom row — subheadline + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/[0.07] pt-6"
        >
          <p className="text-white/45 text-sm md:text-base max-w-sm leading-relaxed">
            {t("subheadline")}
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/team`}
              className="px-6 py-3 rounded-full bg-lime text-dark text-sm font-bold hover:bg-lime-dim transition-all duration-150 hover:scale-[1.02]"
            >
              {t("cta_primary")}
            </Link>
            <Link
              href="https://discord.gg/VuTAEqPT"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-white/12 text-white/70 text-sm font-medium hover:border-white/25 hover:text-white transition-all duration-150"
            >
              {t("cta_secondary")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
