import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");

  const navLinks = [
    { href: "/team", label: t("links_team") },
    { href: "/games", label: t("links_games") },
    { href: "/results", label: t("links_results") },
    { href: "/community", label: t("links_community") },
    { href: "/news", label: t("links_news") },
    { href: "/sponsorship", label: "Sponsorship" },
    { href: "/about", label: "About" },
  ];

  const socials = [
    { label: "Twitter / X", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Discord", href: "https://discord.gg/VuTAEqPT" },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-dark">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-heading text-3xl font-black tracking-tight">
              <span className="text-lime">IM</span>
              <span className="text-white">Perfect</span>
            </span>
            <p className="mt-3 text-sm text-white/50 max-w-xs leading-relaxed">
              {t("tagline")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="text-xs text-white/40 hover:text-lime transition-colors duration-150"
                  aria-label={s.label}
                >
                  {s.label.split(" ")[0]}
                </Link>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
              Navigate
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
              Base
            </p>
            <p className="text-sm text-white/50">Puerto Rico 🇵🇷</p>
            <p className="text-sm text-white/30 mt-1">Representing the island</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} IMPerfect Esports. {t("rights")}
          </p>
          <p className="text-xs text-white/20">Puerto Rico 🇵🇷</p>
        </div>
      </div>
    </footer>
  );
}
