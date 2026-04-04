"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { m } from "framer-motion";

const TIERS = [
  {
    name: "Associate",
    color: "#7F8C8D",
    featured: false,
    description: "Get your brand in front of our audience with product placement and community exposure.",
    perks: ["Logo on team social posts", "Discord community shoutout", "Product placement in content", "2 branded posts per month"],
  },
  {
    name: "Partner",
    color: "#C8E400",
    featured: true,
    description: "Full brand integration across stream, jerseys, and regular content — the most popular tier.",
    perks: ["Jersey logo placement", "Stream overlay branding", "5 branded posts per month", "Tournament coverage mention", "Monthly performance report"],
  },
  {
    name: "Title Sponsor",
    color: "#E74C3C",
    featured: false,
    description: "Maximum exposure. Your brand at the forefront of everything we do.",
    perks: ["Primary jersey logo", "Naming rights to a team", "Exclusive content series", "Event co-branding", "10 branded posts per month", "Quarterly strategy call"],
  },
];

const REASONS = [
  { number: "01", title: "Early Mover Advantage",   body: "Get in at ground level with an org that's building momentum now — before prices rise." },
  { number: "02", title: "Hyper-Engaged Audience",  body: "Esports fans are 4× more likely to purchase from sponsors they see in the gaming ecosystem." },
  { number: "03", title: "Multi-Platform Exposure", body: "Your brand reaches audiences across Twitch, TikTok, Instagram, YouTube, Discord, and live events." },
  { number: "04", title: "Local & Regional Impact", body: "Build authentic ties with the Puerto Rico gaming community — a passionate and underserved market." },
];

export default function SponsorshipPage() {
  const locale = useLocale();
  const t = useTranslations("sponsorship_page");

  return (
    <main style={{ background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <section style={{ paddingTop: "120px", paddingBottom: "64px", padding: "120px 24px 64px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <Link href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#555555", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "32px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8E400")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}>
            {t("back")}
          </Link>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 className="font-heading font-black uppercase text-white" style={{ fontSize: "clamp(48px, 10vw, 88px)", lineHeight: 0.92, marginBottom: "20px" }}>
            {t("title")}
          </h1>
          <p style={{ fontSize: "15px", color: "#888888", maxWidth: "520px", lineHeight: 1.65 }}>
            {t("description")}
          </p>
        </div>
      </section>

      {/* Why us */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <span className="eyebrow">{t("why_eyebrow")}</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)" }}>
              {t("why_title")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {REASONS.map((r, i) => (
              <m.div
                key={r.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{ background: "#222222", border: "1px solid #2A2A2A", borderRadius: "8px", padding: "24px", display: "flex", gap: "20px" }}
              >
                <span className="font-heading font-black" style={{ fontSize: "40px", color: "#C8E400", opacity: 0.15, lineHeight: 1, flexShrink: 0 }}>{r.number}</span>
                <div>
                  <h3 className="font-heading font-black uppercase" style={{ fontSize: "18px", color: "#FFFFFF", marginBottom: "8px" }}>{r.title}</h3>
                  <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6 }}>{r.body}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <span className="eyebrow">{t("tiers_eyebrow")}</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)" }}>
              {t("tiers_title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 items-start">
            {TIERS.map((tier, i) => (
              <m.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                {tier.featured && (
                  <div style={{ textAlign: "center", marginBottom: "12px" }}>
                    <span className="font-heading font-bold uppercase" style={{ background: "#C8E400", color: "#1A1A1A", fontSize: "10px", letterSpacing: "0.10em", padding: "3px 12px", borderRadius: "3px" }}>
                      {t("most_popular")}
                    </span>
                  </div>
                )}
                <div style={{
                  background: tier.featured ? "#1C2100" : "#222222",
                  border: tier.featured ? "2px solid #C8E400" : "1px solid #2A2A2A",
                  borderRadius: "8px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <span className="font-heading font-bold uppercase" style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#C8E400", marginBottom: "4px" }}>{t("tier_label")}</span>
                  <h3 className="font-heading font-black uppercase" style={{ fontSize: "28px", color: "#FFFFFF", marginBottom: "16px" }}>{tier.name}</h3>
                  <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6, marginBottom: "24px" }}>{tier.description}</p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, marginBottom: "28px" }}>
                    {tier.perks.map((perk) => (
                      <li key={perk} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#C8E400", flexShrink: 0, marginTop: "6px" }} />
                        <span style={{ fontSize: "13px", color: "#888888" }}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="mailto:sponsorships@imperfectorg.gg" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    {t("get_started")}
                  </a>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "16px" }}>{t("cta_title")}</h2>
            <p style={{ fontSize: "14px", color: "#888888", marginBottom: "32px", lineHeight: 1.65 }}>
              {t("cta_desc")}
            </p>
            {/* sponsorships@imperfectorg.gg — address to be confirmed with org leadership */}
            <a href="mailto:sponsorships@imperfectorg.gg" className="btn-primary">
              sponsorships@imperfectorg.gg →
            </a>
          </m.div>
        </div>
      </section>
    </main>
  );
}
