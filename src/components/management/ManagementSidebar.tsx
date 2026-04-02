"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/management", label: "Dashboard", icon: "⬡" },
  { href: "/management/tournaments", label: "Tournaments", icon: "◈" },
  { href: "/management/sponsors", label: "Sponsors", icon: "▦" },
  { href: "/management/merch", label: "Merch Plan", icon: "◉" },
  { href: "/management/press", label: "Press Kit", icon: "◫" },
];

type Props = {
  displayName: string;
  avatar?: string | null;
  role: string;
};

export default function ManagementSidebar({ displayName, avatar }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#111] border-r border-white/[0.06] fixed left-0 top-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/management" className="flex items-center gap-2">
            <span className="font-heading text-xl font-black tracking-tight leading-none">
              <span className="text-[#c5d400]">IM</span>
              <span className="text-white">PERFECT</span>
            </span>
          </Link>
          <p className="text-[10px] text-[#c5d400]/50 mt-1 font-semibold tracking-widest uppercase">
            Management
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={item.href === "/management" ? pathname === item.href : pathname.startsWith(item.href)}
            />
          ))}

          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <Link
              href="/team-hub/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-all"
            >
              <span className="text-base opacity-60">←</span>
              Team Hub
            </Link>
          </div>
        </nav>

        {/* User info + sign out */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#c5d400]/[0.05] border border-[#c5d400]/10">
            {avatar ? (
              <Image src={avatar} alt="" width={28} height={28} className="rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#c5d400]/20 flex items-center justify-center text-[#c5d400] text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium truncate">{displayName}</p>
              <p className="text-[10px] text-[#c5d400]/60 font-semibold uppercase tracking-widest">Admin</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end px-1">
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
        {NAV.map((item) => {
          const active = item.href === "/management"
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[9px] font-semibold tracking-widest uppercase transition-colors ${
                active ? "text-[#c5d400]" : "text-white/30 hover:text-white/60"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label.split(" ")[0]}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
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
