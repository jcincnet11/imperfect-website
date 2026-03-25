"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const stats = [
  { value: "2022", labelKey: "founded" },
  { value: "8+", labelKey: "players" },
  { value: "2", labelKey: "games" },
  { value: "20+", labelKey: "tournaments" },
];

export default function StatsBar() {
  const t = useTranslations("stats");

  return (
    <section className="border-b border-white/[0.06] bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`flex flex-col py-10 px-6 ${
                i < stats.length - 1 ? "border-r border-white/[0.06]" : ""
              }`}
            >
              <span
                className="font-heading font-black text-lime leading-none"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                {stat.value}
              </span>
              <span className="mt-2 text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold">
                {t(stat.labelKey)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
