"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutSection() {
  const t = useTranslations("about");
  const locale = useLocale();

  return (
    <section className="py-28 px-6 bg-panel border-y border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs text-lime font-semibold uppercase tracking-widest mb-4">
              Our Story
            </p>
            <h2 className="font-heading font-black text-5xl md:text-6xl uppercase text-white leading-none mb-8">
              {t("title")}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              {t("body")}
            </p>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 text-lime font-semibold hover:gap-4 transition-all duration-200"
            >
              {t("cta")}
              <span>→</span>
            </Link>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            {/* PR flag colors as decorative blocks */}
            <div className="relative h-80 rounded-2xl overflow-hidden bg-dark border border-white/[0.06]">
              <div className="absolute inset-0 flex flex-col">
                <div className="flex-1 bg-[#ED0000]/80" />
                <div className="flex-1 bg-white/90" />
                <div className="flex-1 bg-[#ED0000]/80" />
                <div className="flex-1 bg-white/90" />
                <div className="flex-1 bg-[#ED0000]/80" />
              </div>
              {/* Blue triangle */}
              <div
                className="absolute left-0 top-0 bottom-0"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "160px solid transparent",
                  borderBottom: "160px solid transparent",
                  borderLeft: "180px solid #002868",
                }}
              />
              {/* Star */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 text-5xl">
                ⭐
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-dark/60" />
              {/* Sigma */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading font-black text-[8rem] text-lime/20 leading-none">
                  Σ
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-heading font-black text-2xl text-white uppercase">
                  Puerto Rico 🇵🇷
                </p>
                <p className="text-white/50 text-sm">Representing since 2022</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
