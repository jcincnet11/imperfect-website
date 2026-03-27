"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/team`, label: t("team") },
    { href: `/${locale}/games`, label: t("games") },
    { href: `/${locale}/results`, label: t("results") },
    { href: `/${locale}/community`, label: t("community") },
    { href: `/${locale}/news`, label: t("news") },
    { href: `/${locale}/about`, label: "About" },
  ];

  const sponsorshipHref = `/${locale}/sponsorship`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark/90 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <span className="font-heading text-2xl font-black tracking-tight">
            <span className="text-lime glow-lime-text">Σ</span>
            <span className="text-white">PERFECT</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors duration-150 font-medium tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href={sponsorshipHref}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-lime/20 text-lime/70 hover:text-lime hover:border-lime/40 text-xs font-semibold tracking-wide transition-colors duration-150"
          >
            Sponsorship
          </Link>
          <Link
            href="/team-hub"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/[0.1] text-white/40 hover:text-white hover:border-white/25 text-xs font-semibold tracking-wide transition-colors duration-150"
          >
            <span className="text-[10px]">🔒</span> Team Hub
          </Link>
          <Link
            href="https://discord.gg/VuTAEqPT"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime text-dark text-sm font-bold hover:bg-lime-dim transition-colors duration-150"
          >
            Discord
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-white/70 hover:text-white transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={sponsorshipHref}
            onClick={() => setMenuOpen(false)}
            className="text-sm text-lime/70 hover:text-lime transition-colors font-medium"
          >
            Sponsorship
          </Link>
          <Link
            href="/team-hub"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-white/40 hover:text-white transition-colors font-medium flex items-center gap-1.5"
          >
            <span className="text-xs">🔒</span> Team Hub
          </Link>
        </div>
      )}
    </header>
  );
}
