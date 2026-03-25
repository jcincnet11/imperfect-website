"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark bg-grid">
      {/* Lime glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(197,212,0,0.08) 0%, rgba(197,212,0,0.03) 40%, transparent 70%)",
        }}
      />

      {/* Big Sigma watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-heading font-black text-[40vw] leading-none text-white/[0.015]"
          style={{ letterSpacing: "-0.05em" }}
        >
          Σ
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime/30 bg-lime/5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
          <span className="text-xs text-lime font-semibold tracking-widest uppercase">
            {t("tag")}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading font-black uppercase tracking-tight leading-none"
        >
          <span className="block text-[clamp(3rem,8vw,7rem)] text-white/40">
            {t("headline")}
          </span>
          <span
            className="block text-[clamp(5rem,14vw,12rem)] glow-lime-text"
            style={{ lineHeight: 0.9 }}
          >
            <span className="text-lime">IM</span>
            <span className="text-white">Perfect</span>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 text-lg md:text-xl text-white/50 max-w-xl mx-auto leading-relaxed"
        >
          {t("subheadline")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={`/${locale}/team`}
            className="px-8 py-3.5 rounded-full bg-lime text-dark font-bold text-sm tracking-wide hover:bg-lime-dim transition-all duration-150 hover:scale-[1.02]"
          >
            {t("cta_primary")}
          </Link>
          <Link
            href={`/${locale}/community`}
            className="px-8 py-3.5 rounded-full border border-white/15 text-white/80 font-medium text-sm hover:border-white/30 hover:text-white transition-all duration-150"
          >
            {t("cta_secondary")}
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent pointer-events-none" />
    </section>
  );
}
