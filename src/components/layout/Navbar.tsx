"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainLinks = [
    { href: `/${locale}/team`,      label: t("team") },
    { href: `/${locale}/games`,     label: t("games") },
    { href: `/${locale}/results`,   label: t("results") },
    { href: `/${locale}/community`, label: t("community") },
    { href: `/${locale}/about`,     label: "About" },
  ];

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "72px",
          background: "#111111",
          borderBottom: "1px solid #1F1F1F",
        }}
      >
        <nav
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "100%" }}
          className="flex items-center justify-between"
        >
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <span
              className="font-heading font-black uppercase"
              style={{ fontSize: "20px", letterSpacing: "-0.01em", lineHeight: 1 }}
            >
              <span style={{ color: "#C8E400" }}>IM</span>
              <span style={{ color: "#FFFFFF" }}>PERFECT</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center" style={{ gap: "24px" }}>
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: "13px", color: "#888888", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/sponsorship`}
              style={{ fontSize: "13px", color: "#C8E400", transition: "opacity 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Sponsorship
            </Link>
            <Link
              href="/team-hub"
              style={{ fontSize: "12px", color: "#555555", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#888888")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
            >
              🔒 Team Hub
            </Link>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center" style={{ gap: "8px" }}>
            <LanguageToggle />
            <Link
              href="https://discord.gg/VuTAEqPT"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading font-bold uppercase"
              style={{
                background: "#C8E400",
                color: "#1A1A1A",
                fontSize: "11px",
                letterSpacing: "0.1em",
                padding: "7px 16px",
                borderRadius: "3px",
                marginLeft: "8px",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Join Discord
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center"
            style={{ gap: "5px", padding: "8px", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <span style={{ display: "block", width: "20px", height: "2px", background: "#888888" }} />
            <span style={{ display: "block", width: "20px", height: "2px", background: "#888888" }} />
            <span style={{ display: "block", width: "20px", height: "2px", background: "#888888" }} />
          </button>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 99,
          }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "280px",
          background: "#111111",
          borderLeft: "4px solid #C8E400",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease",
        }}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          style={{
            alignSelf: "flex-end",
            background: "none",
            border: "none",
            color: "#555555",
            fontSize: "24px",
            cursor: "pointer",
            marginBottom: "32px",
          }}
          aria-label="Close menu"
        >
          ×
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className="font-heading font-bold uppercase"
              style={{
                fontSize: "18px",
                color: "#888888",
                textDecoration: "none",
                padding: "10px 0",
                borderBottom: "1px solid #1F1F1F",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/sponsorship`}
            onClick={() => setDrawerOpen(false)}
            className="font-heading font-bold uppercase"
            style={{
              fontSize: "18px",
              color: "#C8E400",
              textDecoration: "none",
              padding: "10px 0",
              borderBottom: "1px solid #1F1F1F",
            }}
          >
            Sponsorship
          </Link>
          <Link
            href="/team-hub"
            onClick={() => setDrawerOpen(false)}
            className="font-heading font-bold uppercase"
            style={{
              fontSize: "14px",
              color: "#555555",
              textDecoration: "none",
              padding: "10px 0",
            }}
          >
            🔒 Team Hub
          </Link>
        </div>

        <Link
          href="https://discord.gg/VuTAEqPT"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setDrawerOpen(false)}
          className="btn-primary"
          style={{ width: "100%", marginTop: "24px" }}
        >
          Join Discord
        </Link>
      </div>
    </>
  );
}
