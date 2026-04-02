import { auth } from "@/auth";
import { getScheduleBlocks, getAvailability, getAllPlayers, getAnnouncements, getScrims } from "@/lib/db";
import { resolveOrgRole, can, ROLE_LABELS } from "@/lib/permissions";
import Link from "next/link";

function currentWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

function nextSession(blocks: Awaited<ReturnType<typeof getScheduleBlocks>>, weekStart: string) {
  const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const today = new Date();
  const todayDayName = DAYS[(today.getDay() + 6) % 7];

  const sorted = blocks
    .filter((b) => DAYS.indexOf(b.day) >= DAYS.indexOf(todayDayName))
    .sort((a, b) => {
      const ai = DAYS.indexOf(a.day), bi = DAYS.indexOf(b.day);
      return ai !== bi ? ai - bi : a.time_slot.localeCompare(b.time_slot);
    });

  if (!sorted.length) return null;
  const next = sorted[0];
  const blockDate = new Date(weekStart);
  blockDate.setDate(blockDate.getDate() + DAYS.indexOf(next.day));
  return { ...next, date: blockDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) };
}

const BLOCK_LABELS: Record<string, string> = {
  PRACTICE: "Practice", SCRIM: "Scrim", VOD_REVIEW: "VOD Review",
  MEETING: "Meeting", TOURNAMENT: "Tournament", FLEX: "Flex", REST: "Rest",
};

const BLOCK_COLORS: Record<string, string> = {
  PRACTICE: "#c5d400", SCRIM: "#4FC3F7", VOD_REVIEW: "#9B59B6",
  MEETING: "#E67E22", TOURNAMENT: "#FFD700", FLEX: "#27AE60", REST: "#7F8C8D",
};

export default async function DashboardPage() {
  const session = await auth();
  const user = session!.user as {
    name?: string | null;
    displayName?: string;
    role?: string;
    orgRole?: string;
    division?: string | null;
    discordId?: string;
  };

  const displayName = user.displayName ?? user.name ?? "Player";
  const orgRole = resolveOrgRole(user as Parameters<typeof resolveOrgRole>[0]);
  const weekStart = currentWeekStart();
  const isStaff = can.viewAllRosters(orgRole);
  const isScrimManager = can.manageScrim(orgRole);

  const [impBlocks, shadowsBlocks, echoesBlocks, availability, players, announcements, scrims] = await Promise.all([
    getScheduleBlocks(weekStart, "IMPerfect"),
    getScheduleBlocks(weekStart, "Shadows"),
    getScheduleBlocks(weekStart, "Echoes"),
    getAvailability(weekStart, isStaff ? undefined : user.discordId),
    isStaff ? getAllPlayers() : Promise.resolve([]),
    getAnnouncements(user.division?.toUpperCase()),
    isScrimManager ? getScrims() : Promise.resolve([]),
  ]);

  const pinnedAnnouncements = announcements.filter((a) => a.pinned);
  const totalSessions = impBlocks.length + shadowsBlocks.length + echoesBlocks.length;
  const myAvailDays = availability.filter((a) => a.status === "AVAILABLE").length;
  const attendancePct = Math.round((myAvailDays / 7) * 100);

  const upcomingScrims = scrims.filter((s) => s.status === "Pending" || s.status === "Confirmed");
  const weekLabel = new Date(weekStart).toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">Week of {weekLabel}</p>
        <h1 className="font-heading font-black text-3xl md:text-4xl tracking-tight">
          Welcome back, <span style={{ color: "#c5d400" }}>{displayName}</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">{ROLE_LABELS[orgRole]} · IMPerfect</p>
      </div>

      {/* Pinned announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="mb-6 space-y-2">
          {pinnedAnnouncements.slice(0, 2).map((a) => (
            <div key={a.id} className="bg-[#c5d400]/5 border border-[#c5d400]/20 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="text-[#c5d400] text-sm mt-0.5">📌</span>
              <div>
                <p className="text-sm font-semibold text-white">{a.title}</p>
                <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{a.body}</p>
              </div>
              <Link href="/team-hub/announcements" className="ml-auto text-xs text-[#c5d400]/60 hover:text-[#c5d400] flex-shrink-0 transition-colors">View →</Link>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Sessions this week" value={String(totalSessions)} />
        <StatCard label="My availability" value={`${attendancePct}%`} />
        {isStaff && <StatCard label="Roster size" value={String(players.length)} />}
        {isScrimManager && <StatCard label="Upcoming scrims" value={String(upcomingScrims.length)} />}
      </div>

      {/* Teams */}
      <h2 className="font-heading font-bold text-sm tracking-widest text-white/30 uppercase mb-3">Teams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "IMPerfect", blocks: impBlocks, next: nextSession(impBlocks, weekStart) },
          { label: "Shadows", blocks: shadowsBlocks, next: nextSession(shadowsBlocks, weekStart) },
          { label: "Echoes", blocks: echoesBlocks, next: nextSession(echoesBlocks, weekStart) },
        ].map(({ label, blocks, next }) => (
          <DivisionCard key={label} division={label} sessions={blocks.length} nextBlock={next} blockColors={BLOCK_COLORS} blockLabels={BLOCK_LABELS} />
        ))}
      </div>

      {/* Role-specific panels */}
      <h2 className="font-heading font-bold text-sm tracking-widest text-white/30 uppercase mb-3">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickLink href="/team-hub/schedule" label="Weekly Schedule" desc="View and manage this week's sessions" />
        <QuickLink href="/team-hub/availability" label="My Availability" desc="Mark your days for the week" />
        <QuickLink href="/team-hub/announcements" label="Announcements" desc={`${announcements.length} post${announcements.length !== 1 ? "s" : ""}`} />
        {can.viewAllRosters(orgRole) && (
          <QuickLink href="/team-hub/roster" label="Roster" desc={`${players.length} active players`} />
        )}
        {can.manageScrim(orgRole) && (
          <QuickLink href="/team-hub/scrims" label="Scrims" desc={`${upcomingScrims.length} upcoming`} />
        )}
        {can.manageRoles(orgRole) && (
          <QuickLink href="/team-hub/admin" label="Admin Panel" desc="Roles, invites, audit log" highlight />
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-xl p-4">
      <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mb-2">{label}</p>
      <p className="font-heading font-black text-3xl text-white">{value}</p>
    </div>
  );
}

function DivisionCard({ division, sessions, nextBlock, blockColors, blockLabels }: {
  division: string; sessions: number;
  nextBlock: { block_type: string; time_slot: string; date: string } | null;
  blockColors: Record<string, string>; blockLabels: Record<string, string>;
}) {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg text-white">{division}</h3>
        <div className="text-right">
          <p className="text-2xl font-heading font-black text-white">{sessions}</p>
          <p className="text-[10px] text-white/30">sessions</p>
        </div>
      </div>
      {nextBlock ? (
        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: blockColors[nextBlock.block_type] }} />
          <span className="text-xs text-white/50">
            Next: {blockLabels[nextBlock.block_type]} · {nextBlock.date} {nextBlock.time_slot}
          </span>
        </div>
      ) : (
        <p className="pt-3 border-t border-white/[0.06] text-xs text-white/25">No sessions scheduled</p>
      )}
      <div className="mt-3 flex gap-2">
        <Link href={`/team-hub/schedule?division=${division}`}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-colors">
          Schedule →
        </Link>
        <Link href="/team-hub/availability"
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-colors">
          Availability →
        </Link>
      </div>
    </div>
  );
}

function QuickLink({ href, label, desc, highlight }: { href: string; label: string; desc: string; highlight?: boolean }) {
  return (
    <Link href={href}
      className={`group flex items-center justify-between rounded-xl p-4 transition-all border ${
        highlight
          ? "bg-[#c5d400]/5 border-[#c5d400]/20 hover:border-[#c5d400]/40"
          : "bg-[#111] border-white/[0.07] hover:border-[#c5d400]/30 hover:bg-[#c5d400]/[0.03]"
      }`}
    >
      <div>
        <p className={`font-semibold text-sm transition-colors ${highlight ? "text-[#c5d400]" : "text-white group-hover:text-[#c5d400]"}`}>{label}</p>
        <p className="text-xs text-white/35 mt-0.5">{desc}</p>
      </div>
      <span className={`text-lg transition-colors ${highlight ? "text-[#c5d400]/60" : "text-white/20 group-hover:text-[#c5d400]/60"}`}>→</span>
    </Link>
  );
}
