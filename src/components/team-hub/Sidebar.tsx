"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { OrgRole } from "@/lib/permissions";
import { hasRole, ROLE_LABELS } from "@/lib/permissions";

const NAV = [
  { href: "/team-hub/dashboard",      label: "Dashboard",      icon: "⬡" },
  { href: "/team-hub/schedule",       label: "Schedule",       icon: "▦" },
  { href: "/team-hub/availability",   label: "Availability",   icon: "◈" },
  { href: "/team-hub/announcements",  label: "Announcements",  icon: "◭" },
];

const STAFF_NAV = [
  { href: "/team-hub/roster",  label: "Roster",  icon: "◉", minRole: "HEAD_COACH" as OrgRole },
  { href: "/team-hub/scrims",  label: "Scrims",  icon: "◫", minRole: "MANAGER"    as OrgRole },
];

const ADMIN_NAV = [
  { href: "/team-hub/admin",   label: "Admin",   icon: "⬟", minRole: "OWNER" as OrgRole },
  { href: "/management",       label: "Org Mgmt", icon: "◧", minRole: "ORG_ADMIN" as OrgRole },
];

type Props = {
  displayName: string;
  avatar?: string | null;
  role: string;
  orgRole?: OrgRole;
};

export default function Sidebar({ displayName, avatar, role, orgRole = "PLAYER" }: Props) {
  const pathname = usePathname();

  const staffItems = STAFF_NAV.filter((item) => hasRole(orgRole, item.minRole));
  const adminItems = ADMIN_NAV.filter((item) => hasRole(orgRole, item.minRole));

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
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV.map((item) => (
            <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} />
          ))}

          {staffItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-1">
              <p className="text-[10px] text-white/25 font-semibold tracking-widest uppercase px-3 mb-1">Staff</p>
              {staffItems.map((item) => (
                <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname.startsWith(item.href)} />
              ))}
            </div>
          )}

          {adminItems.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-1">
              <p className="text-[10px] text-white/25 font-semibold tracking-widest uppercase px-3 mb-1">Admin</p>
              {adminItems.map((item) => (
                <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname.startsWith(item.href)} />
              ))}
            </div>
          )}
        </nav>

        {/* User info + sign out */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03]">
            {avatar ? (
              <Image src={avatar} alt="" width={28} height={28} className="rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#c5d400]/20 flex items-center justify-center text-[#c5d400] text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium truncate">{displayName}</p>
              <p className="text-[10px] text-white/30">{ROLE_LABELS[orgRole] ?? role}</p>
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

      {/* Mobile bottom nav — show core items + first staff item if applicable */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111] border-t border-white/[0.06] flex overflow-x-auto">
        {[...NAV.slice(0, 3), ...staffItems.slice(0, 1)].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold tracking-widest uppercase transition-colors min-w-[4rem] ${
              pathname.startsWith(item.href) ? "text-[#c5d400]" : "text-white/30 hover:text-white/60"
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
