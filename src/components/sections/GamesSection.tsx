"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const games = [
  {
    key: "ow2",
    color: "#F99E1A",
    gradient: "from-[#F99E1A]/10 to-transparent",
    border: "border-[#F99E1A]/20 hover:border-[#F99E1A]/50",
    icon: "⚡",
    badge: "Active",
  },
  {
    key: "mr",
    color: "#c5d400",
    gradient: "from-[#c5d400]/10 to-transparent",
    border: "border-lime/20 hover:border-lime/50",
    icon: "🦸",
    badge: "Active",
  },
];

export default function GamesSection() {
  const t = useTranslations("games");

  return (
    <section className="py-28 px-6 bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs text-lime font-semibold uppercase tracking-widest mb-3">
            Competitive
          </p>
          <h2 className="font-heading font-black text-5xl md:text-7xl uppercase text-white">
            {t("title")}
          </h2>
          <p className="mt-4 text-white/50 text-lg max-w-lg">{t("subtitle")}</p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {games.map((game, i) => (
            <motion.div
              key={game.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border ${game.border} bg-panel p-8 overflow-hidden group transition-all duration-300 cursor-default`}
            >
              {/* Gradient bg */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl">{game.icon}</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                    style={{
                      background: `${game.color}20`,
                      color: game.color,
                      border: `1px solid ${game.color}30`,
                    }}
                  >
                    {game.badge}
                  </span>
                </div>

                <h3
                  className="font-heading font-black text-3xl uppercase mb-3"
                  style={{ color: game.color }}
                >
                  {t(`${game.key}.name`)}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {t(`${game.key}.desc`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
