"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { m } from "framer-motion";

export default function AboutSection() {
  const t = useTranslations("about");
  const locale = useLocale();

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
            <span className="eyebrow">Our Story</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "24px" }}>
              {t("title")}
            </h2>
            <p style={{ fontSize: "15px", color: "#888888", lineHeight: 1.65, marginBottom: "32px", maxWidth: "420px" }}>
              {t("body")}
            </p>
            <Link href={`/${locale}/about`} className="btn-primary">
              {t("cta")}
            </Link>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              style={{
                background: "#111111",
                border: "1px solid #2A2A2A",
                borderTop: "3px solid #C8E400",
                borderRadius: "8px",
                aspectRatio: "4/3",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "28px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Large watermark text */}
              <span
                className="font-heading font-black uppercase"
                style={{
                  position: "absolute",
                  bottom: "-16px",
                  right: "-8px",
                  fontSize: "clamp(80px, 14vw, 130px)",
                  color: "#C8E400",
                  opacity: 0.04,
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                IMP
              </span>

              {/* Top: logo */}
              <div>
                <span className="font-heading font-black" style={{ fontSize: "22px", letterSpacing: "-0.01em" }}>
                  <span style={{ color: "#C8E400" }}>IM</span>
                  <span style={{ color: "#FFFFFF" }}>PERFECT</span>
                </span>
                <p style={{ fontSize: "11px", color: "#444444", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "4px" }}>Esports Organization</p>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: "32px" }}>
                {[
                  { value: "2017", label: "Founded" },
                  { value: "3",    label: "Teams" },
                  { value: "PR",   label: "Based" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-heading font-black" style={{ fontSize: "28px", color: "#C8E400", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: "10px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "3px" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
