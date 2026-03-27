"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/team-hub/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/team-hub/schedule", label: "Schedule", icon: "▦" },
  { href: "/team-hub/availability", label: "Availability", icon: "◈" },
];

const ADMIN_NAV = [
  { href: "/team-hub/players", label: "Manage Players", icon: "◉" },
];

type Props = {
  displayName: string;
  avatar?: string | null;
  role: string;
};

export default function Sidebar({ displayName, avatar, role }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#111] border-r border-white/[0.06] fixed left-0 top-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/team-hub/dashboard" className="flex items-center gap-2">
            <span className="font-heading text-xl font-black tracking-tight leading-none">
              <span className="text-[#c5d400]">IM</span>
              <span className="text-white">PERFECT</span>
            </span>
          </Link>
          <p className="text-[10px] text-white/30 mt-1 font-medium tracking-widest uppercase">Team Hub</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <NavItem key={item.href} {...item} active={pathname === item.href} />
          ))}
          {(role === "admin" || role === "coach") && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-1">
              <p className="text-[10px] text-white/25 font-semibold tracking-widest uppercase px-3 mb-1">Admin</p>
              {ADMIN_NAV.map((item) => (
                <NavItem key={item.href} {...item} active={pathname === item.href} />
              ))}
            </div>
          )}
        </nav>

        {/* User info + sign out */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03]">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#c5d400]/20 flex items-center justify-center text-[#c5d400] text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium truncate">{displayName}</p>
              <p className="text-[10px] text-white/30 capitalize">{role}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between px-1">
            <Link href="/en" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
              ← Back to site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/team-hub" })}
              className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111] border-t border-white/[0.06] flex">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold tracking-widest uppercase transition-colors ${
              pathname === item.href ? "text-[#c5d400]" : "text-white/30 hover:text-white/60"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-[#c5d400]/10 text-[#c5d400] border border-[#c5d400]/20"
          : "text-white/50 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <span className="text-base opacity-70">{icon}</span>
      {label}
    </Link>
  );
}
