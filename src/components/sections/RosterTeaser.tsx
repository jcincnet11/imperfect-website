"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

const players = [
  { tag: "Player 1", role: "Tank", game: "OW2" },
  { tag: "Player 2", role: "DPS", game: "OW2" },
  { tag: "Player 3", role: "Support", game: "OW2" },
  { tag: "Player 4", role: "Duelist", game: "MR" },
  { tag: "Player 5", role: "Strategist", game: "MR" },
];

export default function RosterTeaser() {
  const t = useTranslations("roster");
  const locale = useLocale();

  return (
    <section className="py-28 px-6 bg-dark">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-xs text-lime font-semibold uppercase tracking-widest mb-3">
              Players
            </p>
            <h2 className="font-heading font-black text-5xl md:text-7xl uppercase text-white">
              {t("title")}
            </h2>
            <p className="mt-3 text-white/50">{t("subtitle")}</p>
          </div>
          <Link
            href={`/${locale}/team`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white/70 text-sm font-medium hover:border-lime/40 hover:text-lime transition-all duration-200 self-start md:self-auto"
          >
            {t("cta")} →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {players.map((player, i) => (
            <motion.div
              key={player.tag}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative rounded-xl border border-white/[0.06] bg-panel p-6 hover:border-lime/20 transition-all duration-300 cursor-pointer"
            >
              {/* Avatar placeholder */}
              <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-lime/20 transition-colors">
                <span className="font-heading font-black text-xl text-lime/40">
                  {player.tag[0]}
                </span>
              </div>
              <p className="font-heading font-bold text-white uppercase tracking-wide">
                {player.tag}
              </p>
              <p className="text-xs text-white/40 mt-1">{player.role}</p>
              <span className="mt-3 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-lime/10 text-lime/70 uppercase tracking-widest">
                {player.game}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
