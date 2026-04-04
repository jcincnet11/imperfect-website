"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { m } from "framer-motion";

export default function CommunitySection() {
  const t = useTranslations("community");
  const locale = useLocale();

  return (
    <section style={{ padding: "80px 0", background: "#1A1A1A" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: "#111111",
            border: "1px solid #2A2A2A",
            borderTop: "3px solid #C8E400",
            borderRadius: "8px",
            padding: "64px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 7vw, 64px)", marginBottom: "16px" }}>
              {t("title")}
            </h2>
            <p style={{ fontSize: "15px", color: "#888888", maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.65 }}>
              {t("subtitle")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }} className="sm:flex-row sm:justify-center">
              <Link
                href="https://discord.gg/QgDansRt2p"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <svg width="16" height="13" viewBox="0 0 71 55" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M60.1 4.9A58.6 58.6 0 0 0 45.6.7a.2.2 0 0 0-.2.1 40.8 40.8 0 0 0-1.8 3.7 54.1 54.1 0 0 0-16.3 0A37.5 37.5 0 0 0 25.4.8a.2.2 0 0 0-.2-.1 58.4 58.4 0 0 0-14.5 4.2.2.2 0 0 0-.1.1C1.6 18.7-.9 32.2.3 45.4a.2.2 0 0 0 .1.2 58.9 58.9 0 0 0 17.7 8.9.2.2 0 0 0 .2-.1 42 42 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.8 38.8 0 0 1-5.5-2.6.2.2 0 0 1 0-.4l1.1-.8a.2.2 0 0 1 .2 0c11.6 5.3 24.1 5.3 35.5 0a.2.2 0 0 1 .2 0l1.1.8a.2.2 0 0 1 0 .4 36.1 36.1 0 0 1-5.5 2.6.2.2 0 0 0-.1.3 47.1 47.1 0 0 0 3.6 5.9.2.2 0 0 0 .2.1 58.7 58.7 0 0 0 17.8-8.9.2.2 0 0 0 .1-.2c1.4-15.2-2.4-28.5-10.1-40.3a.2.2 0 0 0-.1-.1ZM23.7 37.3c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1Z"/>
                </svg>
                {t("discord_cta")}
              </Link>
              <Link href={`/${locale}/community`} className="btn-secondary">
                {t("events_cta")}
              </Link>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
