import { auth } from "@/auth";
import Link from "next/link";
import { getManagementStats } from "@/lib/management-db";

const CARDS = [
  {
    href: "/management/tournaments",
    icon: "◈",
    label: "Tournament Tracker",
    desc: "Results, placements, W/L record",
    color: "border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/[0.04]",
    iconColor: "text-blue-400",
  },
  {
    href: "/management/sponsors",
    icon: "▦",
    label: "Sponsor CRM & Revenue",
    desc: "Deals, invoices, revenue tracking",
    color: "border-[#c5d400]/20 hover:border-[#c5d400]/40 hover:bg-[#c5d400]/[0.03]",
    iconColor: "text-[#c5d400]",
  },
  {
    href: "/management/merch",
    icon: "◉",
    label: "Merch Store Launch Plan",
    desc: "Timeline, SKUs, launch checklist",
    color: "border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/[0.04]",
    iconColor: "text-purple-400",
  },
  {
    href: "/management/press",
    icon: "◫",
    label: "Press Kit & Media",
    desc: "Boilerplate, assets, media inquiries",
    color: "border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/[0.04]",
    iconColor: "text-orange-400",
  },
];

export default async function ManagementPage() {
  const session = await auth();
  const user = session!.user as { displayName?: string; name?: string | null };
  const displayName = user.displayName ?? user.name ?? "Admin";

  const stats = await getManagementStats();

  const wl =
    stats.totalWins + stats.totalLosses > 0
      ? `${stats.totalWins}W – ${stats.totalLosses}L`
      : "No matches yet";

  const nextTournament = stats.nextTournamentDate
    ? `${stats.nextTournamentName ?? "TBD"} · ${new Date(stats.nextTournamentDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    : "None scheduled";

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Breadcrumb */}
      <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">
        Team Hub &rsaquo; Management
      </p>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-black text-3xl md:text-4xl tracking-tight">
          Management Dashboard —{" "}
          <span style={{ color: "#c5d400" }}>{displayName}</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">Org leadership access only</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatCard label="Season W/L" value={wl} />
        <StatCard
          label="Sponsorship Revenue"
          value={`$${stats.totalSponsorshipRevenue.toLocaleString()}`}
          lime
        />
        <StatCard
          label="Outstanding Invoices"
          value={stats.outstandingInvoices > 0 ? `$${stats.outstandingInvoices.toLocaleString()}` : "—"}
          warn={stats.outstandingInvoices > 0}
        />
        <StatCard label="Next Tournament" value={nextTournament} small />
      </div>

      {/* Navigation cards */}
      <h2 className="font-heading font-bold text-lg tracking-wide text-white/60 uppercase mb-4">
        Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`group flex items-start gap-4 bg-[#111] border rounded-2xl p-6 transition-all ${card.color}`}
          >
            <span className={`text-2xl mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity ${card.iconColor}`}>
              {card.icon}
            </span>
            <div className="flex-1">
              <p className="font-heading font-bold text-lg text-white group-hover:text-white transition-colors leading-tight">
                {card.label}
              </p>
              <p className="text-xs text-white/35 mt-1">{card.desc}</p>
            </div>
            <span className="text-white/20 group-hover:text-white/50 text-xl transition-colors self-center">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  lime,
  warn,
  small,
}: {
  label: string;
  value: string;
  lime?: boolean;
  warn?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`bg-[#111] border rounded-xl p-4 ${
        lime ? "border-[#c5d400]/15" : warn ? "border-amber-500/20" : "border-white/[0.07]"
      }`}
    >
      <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mb-2">{label}</p>
      <p
        className={`font-heading font-black leading-tight ${small ? "text-base" : "text-xl"} ${
          lime ? "text-[#c5d400]" : warn ? "text-amber-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
