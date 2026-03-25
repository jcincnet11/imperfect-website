"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CommunitySection() {
  const t = useTranslations("community");
  const locale = useLocale();

  return (
    <section className="py-28 px-6 bg-panel border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl border border-lime/10 bg-dark p-12 md:p-20 text-center overflow-hidden">
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(197,212,0,0.06) 0%, transparent 70%)",
            }}
          />

          {/* Grid */}
          <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <span className="inline-block text-4xl mb-6">🇵🇷</span>
            <h2 className="font-heading font-black text-5xl md:text-7xl uppercase text-white mb-6 leading-none">
              {t("title")}
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              {t("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#"
                className="px-8 py-4 rounded-full bg-[#5865F2] text-white font-bold text-sm hover:bg-[#4752c4] transition-colors duration-150 flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 71 55" fill="none">
                  <path
                    d="M60.1 4.9A58.6 58.6 0 0 0 45.6.7a.2.2 0 0 0-.2.1 40.8 40.8 0 0 0-1.8 3.7 54.1 54.1 0 0 0-16.3 0A37.5 37.5 0 0 0 25.4.8a.2.2 0 0 0-.2-.1 58.4 58.4 0 0 0-14.5 4.2.2.2 0 0 0-.1.1C1.6 18.7-.9 32.2.3 45.4a.2.2 0 0 0 .1.2 58.9 58.9 0 0 0 17.7 8.9.2.2 0 0 0 .2-.1 42 42 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.8 38.8 0 0 1-5.5-2.6.2.2 0 0 1 0-.4l1.1-.8a.2.2 0 0 1 .2 0c11.6 5.3 24.1 5.3 35.5 0a.2.2 0 0 1 .2 0l1.1.8a.2.2 0 0 1 0 .4 36.1 36.1 0 0 1-5.5 2.6.2.2 0 0 0-.1.3 47.1 47.1 0 0 0 3.6 5.9.2.2 0 0 0 .2.1 58.7 58.7 0 0 0 17.8-8.9.2.2 0 0 0 .1-.2c1.4-15.2-2.4-28.5-10.1-40.3a.2.2 0 0 0-.1-.1ZM23.7 37.3c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1Z"
                    fill="currentColor"
                  />
                </svg>
                {t("discord_cta")}
              </Link>
              <Link
                href={`/${locale}/community`}
                className="px-8 py-4 rounded-full border border-white/15 text-white/70 font-medium text-sm hover:border-white/30 hover:text-white transition-all duration-150"
              >
                {t("events_cta")}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
