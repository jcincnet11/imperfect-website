"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutSection() {
  const t = useTranslations("about");
  const locale = useLocale();

  return (
    <section className="py-24 px-6 bg-panel border-y border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-4">
              Our Story
            </p>
            <h2
              className="font-heading font-black uppercase text-white leading-none mb-8"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              {t("title")}
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-8 max-w-md">
              {t("body")}
            </p>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-3 text-sm font-semibold text-lime group"
            >
              <span>{t("cta")}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>

          {/* Right — PR visual card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] aspect-[4/3] bg-dark flex items-center justify-center">
              {/* PR flag stripes */}
              <div className="absolute inset-0 flex flex-col opacity-20">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ background: i % 2 === 0 ? "#ED0000" : "#fff" }}
                  />
                ))}
              </div>
              {/* Blue triangle overlay */}
              <div
                className="absolute left-0 top-0 bottom-0 opacity-30"
                style={{
                  width: 0,
                  borderTop: "200px solid transparent",
                  borderBottom: "200px solid transparent",
                  borderLeft: "220px solid #002868",
                }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-dark/70" />

              {/* Giant Σ */}
              <div className="relative z-10 text-center">
                <span
                  className="font-heading font-black text-lime/10 select-none leading-none"
                  style={{ fontSize: "clamp(8rem, 20vw, 16rem)" }}
                >
                  Σ
                </span>
              </div>

              {/* Bottom label */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between">
                <div>
                  <p className="font-heading font-black text-xl uppercase text-white">
                    Puerto Rico
                  </p>
                  <p className="text-white/40 text-xs mt-0.5 uppercase tracking-widest">
                    Est. 2022
                  </p>
                </div>
                <span className="text-3xl">🇵🇷</span>
              </div>

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
