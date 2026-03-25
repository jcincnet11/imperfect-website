"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const players = [
  { tag: "Player 1", role: "Tank", game: "OW2", color: "#F99E1A" },
  { tag: "Player 2", role: "DPS", game: "OW2", color: "#F99E1A" },
  { tag: "Player 3", role: "Support", game: "OW2", color: "#F99E1A" },
  { tag: "Player 4", role: "Duelist", game: "MR", color: "#c5d400" },
  { tag: "Player 5", role: "Strategist", game: "MR", color: "#c5d400" },
];

export default function RosterTeaser() {
  const t = useTranslations("roster");
  const locale = useLocale();

  return (
    <section className="py-24 px-6 bg-dark border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-3">
              Players
            </p>
            <h2
              className="font-heading font-black uppercase text-white leading-none"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              {t("title")}
            </h2>
            <p className="mt-3 text-white/40 text-sm">{t("subtitle")}</p>
          </div>
          <Link
            href={`/${locale}/team`}
            className="self-start md:self-auto inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-lime transition-colors duration-150 group"
          >
            {t("cta")}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        {/* Player grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {players.map((player, i) => (
            <motion.div
              key={player.tag}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="group relative rounded-xl border border-white/[0.06] bg-panel overflow-hidden hover:border-white/15 transition-all duration-300 cursor-pointer"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${player.color}, transparent)`,
                }}
              />

              {/* Avatar area */}
              <div
                className="h-20 flex items-center justify-center"
                style={{ background: `${player.color}08` }}
              >
                <span
                  className="font-heading font-black text-3xl"
                  style={{ color: `${player.color}40` }}
                >
                  {player.tag[0]}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-heading font-bold uppercase text-white text-sm tracking-wide">
                  {player.tag}
                </p>
                <p className="text-[11px] text-white/35 mt-0.5">{player.role}</p>
                <span
                  className="mt-2 inline-block text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-[0.15em]"
                  style={{
                    color: player.color,
                    background: `${player.color}15`,
                    border: `1px solid ${player.color}25`,
                  }}
                >
                  {player.game}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
