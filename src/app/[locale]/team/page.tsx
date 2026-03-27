"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ROLE_COLORS: Record<string, string> = {
  Duelist:    "#E74C3C",
  Vanguard:   "#3A7BD5",
  Strategist: "#c5d400",
};

const TEAMS = [
  {
    name: "IMPerfect",
    game: "Marvel Rivals",
    color: "#c5d400",
    description: "The flagship roster. Puerto Rico's #1 hero shooter team competing at the highest level.",
    players: [
      { tag: "iaguacate",      role: "Strategist", label: "Coach",  img: "/players/AGUACATE_3.png" },
      { tag: "lblazerowl",     role: "Strategist", label: "Coach",  img: "/players/BLAZER_3.png" },
      { tag: "crazyturnx",     role: "Duelist",    label: "Player", img: "/players/FILTHYPRYDE.png" },
      { tag: "georgierican",   role: "Strategist", label: "Player", img: "/players/GEORGIE.png" },
      { tag: "spooit",         role: "Vanguard",   label: "Player", img: "/players/KEVO.png" },
      { tag: "the_mofn_ninja", role: "Duelist",    label: "Player", img: "/players/MOFN_2.png" },
      { tag: "tides100ping",   role: "Duelist",    label: "Player", img: "/players/TIDES.png" },
      { tag: "zoivanni",       role: "Vanguard",   label: "Player", img: "/players/VANNI.png" },
    ],
  },
  {
    name: "Shadows",
    game: "Marvel Rivals",
    color: "#9B59B6",
    description: "The second division squad, built from the same competitive DNA.",
    players: [],
    comingSoon: true,
  },
  {
    name: "Echoes",
    game: "Marvel Rivals",
    color: "#3A7BD5",
    description: "Our third MR roster — developing the next generation of island talent.",
    players: [],
    comingSoon: true,
  },
];

export default function TeamPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-dark">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-lime transition-colors mb-8 uppercase tracking-widest font-semibold"
            >
              ← Back
            </Link>
            <p className="text-[10px] text-lime font-bold uppercase tracking-[0.25em] mb-3">
              Roster
            </p>
            <h1
              className="font-heading font-black uppercase text-white leading-none"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
            >
              The Team
            </h1>
            <p className="mt-4 text-white/40 text-sm max-w-md">
              Three teams. One org. All representing Puerto Rico.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Teams */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {TEAMS.map((team, ti) => (
          <motion.div
            key={team.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: ti * 0.1 }}
          >
            {/* Team header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    {team.game}
                  </span>
                </div>
                <h2
                  className="font-heading font-black uppercase leading-none"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: team.color }}
                >
                  {team.name}
                </h2>
                <p className="mt-2 text-white/40 text-sm max-w-sm">{team.description}</p>
              </div>
              <span
                className="self-start sm:self-auto text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-[0.15em]"
                style={{
                  color: team.color,
                  background: `${team.color}15`,
                  border: `1px solid ${team.color}30`,
                }}
              >
                {team.players.length > 0 ? `${team.players.length} members` : "Coming soon"}
              </span>
            </div>

            {/* Player grid */}
            {team.comingSoon ? (
              <div
                className="rounded-2xl border border-dashed p-16 flex items-center justify-center"
                style={{ borderColor: `${team.color}20` }}
              >
                <p className="text-white/20 text-sm font-semibold uppercase tracking-widest">
                  Roster Announcement Coming Soon
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {team.players.map((player, i) => {
                  const color = ROLE_COLORS[player.role];
                  return (
                    <motion.div
                      key={player.tag}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="group relative rounded-xl overflow-hidden aspect-square cursor-default"
                      style={{ border: `1px solid ${color}20` }}
                    >
                      <Image
                        src={player.img}
                        alt={player.tag}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      <div
                        className="absolute inset-0 flex flex-col justify-end p-3"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }}
                      >
                        <div
                          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                        />
                        <div className="flex items-end justify-between gap-1">
                          <div>
                            <p className="font-heading font-black uppercase text-white text-xs sm:text-sm leading-tight tracking-wide">
                              {player.tag}
                            </p>
                            <p className="text-[10px] mt-0.5" style={{ color }}>
                              {player.role}
                            </p>
                          </div>
                          <span
                            className="shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-[0.1em]"
                            style={{
                              color,
                              background: `${color}25`,
                              border: `1px solid ${color}40`,
                            }}
                          >
                            {player.label === "Coach" ? "Coach" : "Player"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {ti < TEAMS.length - 1 && (
              <div className="mt-20 border-t border-white/[0.06]" />
            )}
          </motion.div>
        ))}
      </div>
    </main>
  );
}
