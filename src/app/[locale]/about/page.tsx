"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { m } from "framer-motion";

const PHASES = [
  {
    number: "01",
    name: "Foundation & Brand",
    period: "Months 1–2",
    status: "In Progress",
    milestones: [
      "Finalize brand identity, logo, and visual system",
      "Build and launch the org website",
      "Set up all social media channels",
      "Create sponsorship deck",
      "Discord server setup",
    ],
  },
  {
    number: "02",
    name: "Growth & Competition",
    period: "Months 3–4",
    status: "Upcoming",
    milestones: [
      "Finalize all team rosters",
      "Register for 3+ open tournaments",
      "Launch weekly content schedule",
      "Close first 2–3 sponsorships",
      "Reach 1K combined social followers",
    ],
  },
  {
    number: "03",
    name: "Scale & Monetize",
    period: "Months 5–6",
    status: "Upcoming",
    milestones: [
      "Scale to 5–8 active sponsors",
      "Launch merchandise store",
      "Enter LAN and regional championships",
      "Reach 5K+ Discord members",
      "10K+ combined social followers",
    ],
  },
];

const VALUES = [
  { icon: null,  title: "Island First",      body: "Every match we play, every tournament we enter — we're representing Puerto Rico. That's not a slogan. It's why this org exists." },
  { icon: "⚡",  title: "Compete Hard",      body: "We don't show up to participate. We show up to win. Every roster member, every coach, every team — the standard is high." },
  { icon: "🤝",  title: "Build Together",    body: "This isn't just a team. It's a community. We grow with our players, our fans, and every gamer on the island." },
  { icon: "📈",  title: "Think Long Term",   body: "We're not a flash in the pan. We're building infrastructure, developing talent, and creating an org that lasts." },
];

function PageHeader({ locale }: { locale: string }) {
  return (
    <section style={{ paddingTop: "120px", paddingBottom: "64px", paddingLeft: "24px", paddingRight: "24px", borderBottom: "1px solid #1F1F1F", background: "#1A1A1A", position: "relative" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <Link href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#555555", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "32px" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C8E400")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}>
          ← Back
        </Link>
        <span className="eyebrow">Our Story</span>
        <h1 className="font-heading font-black uppercase text-white" style={{ fontSize: "clamp(48px, 10vw, 88px)", lineHeight: 0.92, marginBottom: "20px" }}>
          Built in<br />Puerto Rico
        </h1>
        <p style={{ fontSize: "15px", color: "#888888", maxWidth: "520px", lineHeight: 1.65 }}>
          IMPerfect was born from a simple belief — that Puerto Rico has world-class talent
          that deserves a world-class stage. We built this org from the ground up, competing,
          grinding, and representing the island in every match we play.
        </p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const locale = useLocale();

  return (
    <main style={{ background: "#1A1A1A", minHeight: "100vh" }}>
      <PageHeader locale={locale} />

      {/* Values */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <m.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ marginBottom: "48px" }}>
            <span className="eyebrow">What We Stand For</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)" }}>
              Core Values
            </h2>
          </m.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => (
              <m.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ background: "#222222", border: "1px solid #2A2A2A", borderTop: "3px solid #C8E400", borderRadius: "8px", padding: "24px 24px 28px" }}
              >
                {v.icon === null ? (
                  <span className="font-heading font-black uppercase" style={{ fontSize: "13px", letterSpacing: "0.12em", padding: "4px 10px", borderRadius: "3px", color: "#C8E400", background: "rgba(200,228,0,0.1)", border: "1px solid rgba(200,228,0,0.3)", display: "inline-block", marginBottom: "14px" }}>PR</span>
                ) : (
                  <span style={{ fontSize: "24px", display: "block", marginBottom: "14px" }}>{v.icon}</span>
                )}
                <h3 className="font-heading font-bold uppercase" style={{ fontSize: "18px", color: "#FFFFFF", marginBottom: "8px" }}>{v.title}</h3>
                <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6 }}>{v.body}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <m.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "48px" }}>
            <span className="eyebrow">The Plan</span>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "12px" }}>
              6-Month Roadmap
            </h2>
            <p style={{ fontSize: "14px", color: "#888888", maxWidth: "420px", lineHeight: 1.65 }}>
              Three phases. Clear milestones. We're executing this publicly so our community can follow the journey.
            </p>
          </m.div>

          <div style={{ position: "relative" }}>
            {/* Connector line desktop */}
            <div className="hidden md:block" style={{ position: "absolute", top: "24px", left: "0", right: "0", height: "1px", background: "#2A2A2A", zIndex: 0 }} />

            <div className="grid md:grid-cols-3 gap-6" style={{ position: "relative", zIndex: 1 }}>
              {PHASES.map((phase, i) => (
                <m.div
                  key={phase.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                >
                  {/* Phase number circle */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "50%", background: "#1A1A1A",
                      border: `2px solid ${phase.status === "In Progress" ? "#C8E400" : "#2A2A2A"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span className="font-heading font-black" style={{ fontSize: "16px", color: "#C8E400" }}>{phase.number}</span>
                    </div>
                    <span
                      className="font-heading font-bold uppercase"
                      style={{
                        fontSize: "10px", letterSpacing: "0.10em", padding: "3px 10px", borderRadius: "3px",
                        ...(phase.status === "In Progress"
                          ? { background: "#C8E400", color: "#1A1A1A" }
                          : { background: "#2A2A2A", color: "#666666" }
                        ),
                      }}
                    >
                      {phase.status}
                    </span>
                  </div>

                  <div style={{ background: "#222222", border: "1px solid #2A2A2A", borderRadius: "8px", padding: "24px" }}>
                    <p style={{ fontSize: "11px", color: "#C8E400", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.10em" }}>{phase.period}</p>
                    <h3 className="font-heading font-black uppercase" style={{ fontSize: "20px", color: "#FFFFFF", marginBottom: "20px" }}>{phase.name}</h3>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {phase.milestones.map((m) => (
                        <li key={m} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#C8E400", flexShrink: 0, marginTop: "6px" }} />
                          <span style={{ fontSize: "13px", color: "#888888", lineHeight: 1.5 }}>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
          <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading font-black uppercase text-white leading-[0.95]" style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "16px" }}>Want In?</h2>
            <p style={{ fontSize: "14px", color: "#888888", marginBottom: "32px", maxWidth: "360px", margin: "0 auto 32px" }}>
              Join our Discord community or reach out about sponsorship opportunities.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="https://discord.gg/VuTAEqPT" target="_blank" rel="noopener noreferrer" className="btn-primary">Join Discord</Link>
              <Link href={`/${locale}/sponsorship`} className="btn-secondary">Partner With Us</Link>
            </div>
          </m.div>
        </div>
      </section>
    </main>
  );
}
