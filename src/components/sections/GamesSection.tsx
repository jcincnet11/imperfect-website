"use client";

import { useTranslations } from "next-intl";
import { m } from "framer-motion";

const games = [
  {
    key: "ow2",
    label: "OW2",
    color: "#F99E1A",
    stats: [
      { value: "5v5",  label: "Format" },
      { value: "T1",   label: "Rank" },
      { value: "PR #1",label: "Region" },
    ],
  },
  {
    key: "mr",
    label: "RIVALS",
    color: "#C8E400",
    stats: [
      { value: "6v6",   label: "Format" },
      { value: "Top 5", label: "Rank" },
      { value: "PR #1", label: "Region" },
    ],
  },
];

export default function GamesSection() {
  const t = useTranslations("games");

  return (
    <section style={{ padding: "80px 0", borderBottom: "1px solid #1F1F1F", background: "#1A1A1A" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "48px" }}>
          <span className="eyebrow">Competitive</span>
          <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)" }}>
            {t("title")}
          </h2>
          <p style={{ marginTop: "16px", fontSize: "14px", color: "#888888", maxWidth: "400px", lineHeight: 1.65 }}>
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {games.map((game, i) => (
            <m.div
              key={game.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ background: "#222222", border: "1px solid #2A2A2A", borderRadius: "8px", padding: "24px", position: "relative", overflow: "hidden" }}
            >
              {/* Top accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: game.color }} />

              {/* Game badge row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <span
                  className="font-heading font-bold uppercase"
                  style={{
                    fontSize: "10px", letterSpacing: "0.18em", color: game.color,
                    background: `${game.color}14`, border: `1px solid ${game.color}40`,
                    padding: "3px 10px", borderRadius: "3px",
                  }}
                >
                  {game.label}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: game.color }} />
                  <span className="font-heading font-bold uppercase" style={{ fontSize: "10px", color: "#555555", letterSpacing: "0.15em" }}>Active</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-black uppercase" style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "#FFFFFF", marginBottom: "8px", lineHeight: 1 }}>
                {t(`${game.key}.name`)}
              </h3>

              {/* Description */}
              <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6, marginBottom: "24px", maxWidth: "400px" }}>
                {t(`${game.key}.desc`)}
              </p>

              {/* Stat row */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", paddingTop: "20px", borderTop: "1px solid #2A2A2A" }}>
                {game.stats.map((s, si) => (
                  <span
                    key={s.label}
                    className="font-heading font-bold uppercase"
                    style={{
                      fontSize: "10px", letterSpacing: "0.10em",
                      padding: "3px 10px", borderRadius: "3px",
                      ...(si === 0
                        ? { background: "#1F1F1F", border: "1px solid #2A2A2A", color: "#666666" }
                        : { background: `${game.color}14`, border: `1px solid ${game.color}40`, color: game.color }
                      ),
                    }}
                  >
                    {s.value} · {s.label}
                  </span>
                ))}
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
