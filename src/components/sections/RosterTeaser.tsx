"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";

const ROLE_COLORS: Record<string, string> = {
  Duelist:    "#E74C3C",
  Vanguard:   "#3A7BD5",
  Strategist: "#C8E400",
};

const players = [
  { tag: "iaguacate",      role: "Strategist", label: "Coach",  game: "MR", img: "/players/AGUACATE_3.webp" },
  { tag: "lblazerowl",     role: "Strategist", label: "Coach",  game: "MR", img: "/players/BLAZER_3.webp" },
  { tag: "crazyturnx",     role: "Duelist",    label: "Player", game: "MR", img: "/players/FILTHYPRYDE.webp" },
  { tag: "georgierican",   role: "Strategist", label: "Player", game: "MR", img: "/players/GEORGIE.webp" },
  { tag: "spooit",         role: "Vanguard",   label: "Player", game: "MR", img: "/players/KEVO.webp" },
  { tag: "the_mofn_ninja", role: "Duelist",    label: "Player", game: "MR", img: "/players/MOFN_2.webp" },
  { tag: "tides100ping",   role: "Duelist",    label: "Player", game: "MR", img: "/players/TIDES.webp" },
  { tag: "zoivanni",       role: "Vanguard",   label: "Player", game: "MR", img: "/players/VANNI.webp" },
].map((p) => ({ ...p, color: ROLE_COLORS[p.role] }));

export default function RosterTeaser() {
  const t = useTranslations("roster");
  const locale = useLocale();

  return (
    <section style={{ padding: "80px 0", borderBottom: "1px solid #1F1F1F", background: "#1A1A1A" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "40px" }} className="md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)" }}>
              {t("title")}
            </h2>
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#888888" }}>{t("subtitle")}</p>
          </div>
          <Link
            href={`/${locale}/team`}
            style={{ fontSize: "13px", color: "#C8E400", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {t("cta")} →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {players.map((player, i) => (
            <m.div
              key={player.tag}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="group relative overflow-hidden"
              style={{ aspectRatio: "1/1", borderRadius: "8px", border: `1px solid ${player.color}20` }}
            >
              <Image
                src={player.img}
                alt={player.tag}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div
                className="absolute inset-0 flex flex-col justify-end"
                style={{ padding: "12px", background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }}
              >
                <div
                  className="absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ height: "3px", background: player.color }}
                />
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "4px" }}>
                  <div>
                    <p className="font-heading font-black uppercase" style={{ fontSize: "12px", color: "#FFFFFF", lineHeight: 1.2 }}>{player.tag}</p>
                    <p style={{ fontSize: "10px", marginTop: "2px", color: player.color }}>{player.role}</p>
                  </div>
                  <span
                    className="font-heading font-bold uppercase"
                    style={{ fontSize: "8px", letterSpacing: "0.10em", padding: "2px 6px", borderRadius: "2px", color: player.color, background: `${player.color}20`, border: `1px solid ${player.color}40`, flexShrink: 0 }}
                  >
                    {player.label === "Coach" ? "Coach" : player.game}
                  </span>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
