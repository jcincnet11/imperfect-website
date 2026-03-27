"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const ROLE_COLORS: Record<string, string> = {
  Duelist:    "#E74C3C",
  Vanguard:   "#3A7BD5",
  Strategist: "#c5d400",
};

const players = [
  { tag: "iaguacate",      role: "Strategist", label: "Coach",  game: "MR", img: "/players/AGUACATE_3.png" },
  { tag: "lblazerowl",     role: "Strategist", label: "Coach",  game: "MR", img: "/players/BLAZER_3.png" },
  { tag: "crazyturnx",     role: "Duelist",    label: "Player", game: "MR", img: "/players/FILTHYPRYDE.png" },
  { tag: "georgierican",   role: "Strategist", label: "Player", game: "MR", img: "/players/GEORGIE.png" },
  { tag: "spooit",         role: "Vanguard",   label: "Player", game: "MR", img: "/players/KEVO.png" },
  { tag: "the_mofn_ninja", role: "Duelist",    label: "Player", game: "MR", img: "/players/MOFN_2.png" },
  { tag: "tides100ping",   role: "Duelist",    label: "Player", game: "MR", img: "/players/TIDES.png" },
  { tag: "zoivanni",       role: "Vanguard",   label: "Player", game: "MR", img: "/players/VANNI.png" },
].map((p) => ({ ...p, color: ROLE_COLORS[p.role] }));

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {players.map((player, i) => (
            <motion.div
              key={player.tag}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="group relative rounded-xl overflow-hidden cursor-pointer aspect-square"
              style={{ border: `1px solid ${player.color}20` }}
            >
              {/* Full-bleed image */}
              <Image
                src={player.img}
                alt={player.tag}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />

              {/* Bottom gradient overlay with info */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-3"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)" }}
              >
                {/* Accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${player.color}, transparent)` }}
                />
                <div className="flex items-end justify-between gap-1">
                  <div>
                    <p className="font-heading font-black uppercase text-white text-xs sm:text-sm leading-tight tracking-wide drop-shadow">
                      {player.tag}
                    </p>
                    <p className="text-[10px] sm:text-[11px] mt-0.5 drop-shadow" style={{ color: player.color }}>
                      {player.role}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-[0.1em]"
                    style={{
                      color: player.color,
                      background: `${player.color}25`,
                      border: `1px solid ${player.color}40`,
                    }}
                  >
                    {player.label === "Coach" ? "Coach" : player.game}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
