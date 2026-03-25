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
    <section className="border-y border-white/[0.06] bg-panel">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <span className="font-heading font-black text-4xl md:text-5xl text-lime">
                {stat.value}
              </span>
              <span className="mt-1 text-xs text-white/40 uppercase tracking-widest font-semibold">
                {t(stat.labelKey)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
