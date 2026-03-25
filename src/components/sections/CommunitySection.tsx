"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CommunitySection() {
  const t = useTranslations("community");
  const locale = useLocale();

  return (
    <section className="py-24 px-6 bg-panel border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl border border-lime/10 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-dark bg-grid opacity-80" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 50% 110%, rgba(197,212,0,0.07) 0%, transparent 65%)",
            }}
          />
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative z-10 px-8 md:px-20 py-20 text-center"
          >
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-6">
              Community
            </p>

            <h2
              className="font-heading font-black uppercase text-white leading-none mb-6"
              style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
            >
              {t("title")}
            </h2>

            <p className="text-white/45 text-base max-w-xl mx-auto leading-relaxed mb-10">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Discord button */}
              <Link
                href="https://discord.gg/VuTAEqPT"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#5865F2] text-white font-bold text-sm hover:bg-[#4752c4] transition-all duration-150 hover:scale-[1.02]"
              >
                <svg width="18" height="14" viewBox="0 0 71 55" fill="none">
                  <path
                    d="M60.1 4.9A58.6 58.6 0 0 0 45.6.7a.2.2 0 0 0-.2.1 40.8 40.8 0 0 0-1.8 3.7 54.1 54.1 0 0 0-16.3 0A37.5 37.5 0 0 0 25.4.8a.2.2 0 0 0-.2-.1 58.4 58.4 0 0 0-14.5 4.2.2.2 0 0 0-.1.1C1.6 18.7-.9 32.2.3 45.4a.2.2 0 0 0 .1.2 58.9 58.9 0 0 0 17.7 8.9.2.2 0 0 0 .2-.1 42 42 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.8 38.8 0 0 1-5.5-2.6.2.2 0 0 1 0-.4l1.1-.8a.2.2 0 0 1 .2 0c11.6 5.3 24.1 5.3 35.5 0a.2.2 0 0 1 .2 0l1.1.8a.2.2 0 0 1 0 .4 36.1 36.1 0 0 1-5.5 2.6.2.2 0 0 0-.1.3 47.1 47.1 0 0 0 3.6 5.9.2.2 0 0 0 .2.1 58.7 58.7 0 0 0 17.8-8.9.2.2 0 0 0 .1-.2c1.4-15.2-2.4-28.5-10.1-40.3a.2.2 0 0 0-.1-.1ZM23.7 37.3c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1Z"
                    fill="currentColor"
                  />
                </svg>
                {t("discord_cta")}
              </Link>

              <Link
                href={`/${locale}/community`}
                className="px-8 py-4 rounded-full border border-white/12 text-white/60 text-sm font-medium hover:border-white/25 hover:text-white transition-all duration-150"
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
