"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { m } from "framer-motion";

const TIERS = [
  { name: "Associate",    color: "#7F8C8D" },
  { name: "Partner",      color: "#C8E400" },
  { name: "Title Sponsor",color: "#E74C3C" },
];

const PLATFORMS = ["Twitch", "TikTok", "Instagram", "YouTube", "Discord", "Twitter/X"];

export default function SponsorshipTeaser() {
  const locale = useLocale();
  const t = useTranslations("sponsorship_teaser");

  return (
    <section style={{ padding: "80px 0", borderBottom: "1px solid #1F1F1F", background: "#1A1A1A" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "20px" }}>
              {t("title")}
            </h2>
            <p style={{ fontSize: "14px", color: "#888888", lineHeight: 1.65, marginBottom: "28px", maxWidth: "400px" }}>
              {t("description")}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
              {PLATFORMS.map((p) => (
                <span
                  key={p}
                  className="font-heading font-bold uppercase"
                  style={{ fontSize: "10px", letterSpacing: "0.12em", padding: "4px 10px", borderRadius: "3px", background: "#222222", border: "1px solid #2A2A2A", color: "#555555" }}
                >
                  {p}
                </span>
              ))}
            </div>
            <Link href={`/${locale}/sponsorship`} className="btn-primary">
              {t("cta")}
            </Link>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {TIERS.map((tier, i) => (
              <m.div
                key={tier.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "18px 20px",
                  borderRadius: "8px",
                  background: "#222222",
                  border: `1px solid ${tier.color}25`,
                  borderLeft: `3px solid ${tier.color}`,
                }}
              >
                <span className="font-heading font-black uppercase" style={{ fontSize: "16px", color: tier.color }}>
                  {tier.name}
                </span>
              </m.div>
            ))}
            <div style={{ marginTop: "8px", paddingTop: "16px", borderTop: "1px solid #1F1F1F" }}>
              <a
                href="mailto:sponsorships@imperfectorg.gg"
                style={{ fontSize: "13px", color: "#555555", textDecoration: "none", transition: "color 0.15s", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C8E400")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
              >
                <span>sponsorships@imperfectorg.gg</span>
                <span>→</span>
              </a>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
