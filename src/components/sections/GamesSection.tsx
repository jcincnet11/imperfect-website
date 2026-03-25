"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const games = [
  {
    key: "ow2",
    accentColor: "#F99E1A",
    accentDim: "rgba(249,158,26,0.08)",
    accentBorder: "rgba(249,158,26,0.2)",
    accentBorderHover: "rgba(249,158,26,0.5)",
    label: "OW2",
    stats: [
      { value: "5v5", label: "Format" },
      { value: "T1", label: "Rank" },
      { value: "PR #1", label: "Region" },
    ],
  },
  {
    key: "mr",
    accentColor: "#c5d400",
    accentDim: "rgba(197,212,0,0.08)",
    accentBorder: "rgba(197,212,0,0.2)",
    accentBorderHover: "rgba(197,212,0,0.5)",
    label: "RIVALS",
    stats: [
      { value: "6v6", label: "Format" },
      { value: "Top 5", label: "Rank" },
      { value: "PR #1", label: "Region" },
    ],
  },
];

export default function GamesSection() {
  const t = useTranslations("games");

  return (
    <section className="py-24 px-6 bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-3">
              Competitive
            </p>
            <h2
              className="font-heading font-black uppercase text-white leading-none"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              {t("title")}
            </h2>
          </div>
          <p className="text-white/40 text-sm max-w-xs leading-relaxed md:text-right">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Cards — FaZe-style with stat overlays */}
        <div className="grid md:grid-cols-2 gap-4">
          {games.map((game, i) => (
            <motion.div
              key={game.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden cursor-default"
              style={{
                background: "#111",
                border: `1px solid ${game.accentBorder}`,
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = game.accentBorderHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = game.accentBorder)
              }
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${game.accentColor}, transparent)` }}
              />

              {/* Background glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top left, ${game.accentDim}, transparent 60%)`,
                }}
              />

              <div className="relative z-10 p-8">
                {/* Game label badge */}
                <div className="flex items-start justify-between mb-8">
                  <span
                    className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded"
                    style={{
                      color: game.accentColor,
                      background: game.accentDim,
                      border: `1px solid ${game.accentBorder}`,
                    }}
                  >
                    {game.label}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: game.accentColor }}
                    />
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">
                      Active
                    </span>
                  </span>
                </div>

                {/* Game name */}
                <h3
                  className="font-heading font-black uppercase leading-none mb-2"
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    color: game.accentColor,
                  }}
                >
                  {t(`${game.key}.name`)}
                </h3>

                {/* Description */}
                <p className="text-white/45 text-sm leading-relaxed mb-10 max-w-md">
                  {t(`${game.key}.desc`)}
                </p>

                {/* Stat row — FaZe style */}
                <div
                  className="grid grid-cols-3 gap-4 pt-6"
                  style={{ borderTop: `1px solid ${game.accentBorder}` }}
                >
                  {game.stats.map((stat) => (
                    <div key={stat.label}>
                      <p
                        className="font-heading font-black text-2xl uppercase"
                        style={{ color: game.accentColor }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
