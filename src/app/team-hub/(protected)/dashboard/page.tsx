import { auth } from "@/auth";
import { getScheduleBlocks, getAvailability, getAllPlayers } from "@/lib/db";
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
  const todayDay = today.getDay();
  const todayDayName = DAYS[(todayDay + 6) % 7]; // Mon=0

  const sorted = blocks
    .filter((b) => {
      const blockDayIdx = DAYS.indexOf(b.day);
      return blockDayIdx >= DAYS.indexOf(todayDayName);
    })
    .sort((a, b) => {
      const ai = DAYS.indexOf(a.day);
      const bi = DAYS.indexOf(b.day);
      if (ai !== bi) return ai - bi;
      return a.time_slot.localeCompare(b.time_slot);
    });

  if (!sorted.length) return null;
  const next = sorted[0];
  const blockDate = new Date(weekStart);
  blockDate.setDate(blockDate.getDate() + DAYS.indexOf(next.day));
  return {
    ...next,
    date: blockDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
  };
}

const BLOCK_LABELS: Record<string, string> = {
  PRACTICE: "Practice",
  SCRIM: "Scrim",
  VOD_REVIEW: "VOD Review",
  MEETING: "Meeting",
  TOURNAMENT: "Tournament",
  FLEX: "Flex",
  REST: "Rest",
};

const BLOCK_COLORS: Record<string, string> = {
  PRACTICE: "#c5d400",
  SCRIM: "#3A7BD5",
  VOD_REVIEW: "#9B59B6",
  MEETING: "#E67E22",
  TOURNAMENT: "#E74C3C",
  FLEX: "#27AE60",
  REST: "#7F8C8D",
};

export default async function DashboardPage() {
  const session = await auth();
  const user = session!.user as {
    name?: string | null;
    displayName?: string;
    role?: string;
    division?: string | null;
    discordId?: string;
  };

  const displayName = user.displayName ?? user.name ?? "Player";
  const role = user.role ?? "player";
  const weekStart = currentWeekStart();

  const [ow2Blocks, mrBlocks, availability, players] = await Promise.all([
    getScheduleBlocks(weekStart, "OW2"),
    getScheduleBlocks(weekStart, "MR"),
    getAvailability(weekStart, role === "player" ? user.discordId : undefined),
    role !== "player" ? getAllPlayers() : Promise.resolve([]),
  ]);

  const totalSessions = ow2Blocks.length + mrBlocks.length;
  const availableCount = availability.filter((a) => a.status === "AVAILABLE").length;
  const totalDays = 7;
  const attendancePct = totalDays > 0 ? Math.round((availableCount / totalDays) * 100) : 0;

  const ow2Next = nextSession(ow2Blocks, weekStart);
  const mrNext = nextSession(mrBlocks, weekStart);

  const weekLabel = new Date(weekStart).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">
          Week of {weekLabel}
        </p>
        <h1 className="font-heading font-black text-3xl md:text-4xl tracking-tight">
          Welcome back, <span style={{ color: "#c5d400" }}>{displayName}</span>
        </h1>
        <p className="text-white/40 text-sm mt-1 capitalize">{role} · IMPerfect</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Sessions this week" value={String(totalSessions)} />
        <StatCard
          label="Next session"
          value={ow2Next ? ow2Next.date : mrNext ? mrNext.date : "None scheduled"}
          small
        />
        <StatCard label="My availability" value={`${attendancePct}%`} />
      </div>

      {/* Division cards */}
      <h2 className="font-heading font-bold text-lg tracking-wide text-white/70 uppercase mb-4">
        Divisions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <DivisionCard
          game="Overwatch 2"
          division="OW2"
          sessions={ow2Blocks.length}
          nextBlock={ow2Next}
          blockColors={BLOCK_COLORS}
          blockLabels={BLOCK_LABELS}
        />
        <DivisionCard
          game="Marvel Rivals"
          division="MR"
          sessions={mrBlocks.length}
          nextBlock={mrNext}
          blockColors={BLOCK_COLORS}
          blockLabels={BLOCK_LABELS}
        />
      </div>

      {/* Quick links */}
      <h2 className="font-heading font-bold text-lg tracking-wide text-white/70 uppercase mb-4">
        Quick Access
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickLink href="/team-hub/schedule" label="Weekly Schedule" desc="View this week's sessions" />
        <QuickLink href="/team-hub/availability" label="My Availability" desc="Mark your days for the week" />
        {(role === "admin" || role === "coach") && (
          <>
            <QuickLink href="/team-hub/players" label="Manage Players" desc={`${players.length} players on roster`} />
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-xl p-4">
      <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mb-2">{label}</p>
      <p className={`font-heading font-black ${small ? "text-lg leading-tight" : "text-3xl"} text-white`}>
        {value}
      </p>
    </div>
  );
}

function DivisionCard({
  game,
  division,
  sessions,
  nextBlock,
  blockColors,
  blockLabels,
}: {
  game: string;
  division: string;
  sessions: number;
  nextBlock: { block_type: string; time_slot: string; date: string } | null;
  blockColors: Record<string, string>;
  blockLabels: Record<string, string>;
}) {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-white/25 font-semibold uppercase tracking-widest">{division}</p>
          <h3 className="font-heading font-bold text-lg text-white">{game}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-heading font-black text-white">{sessions}</p>
          <p className="text-[10px] text-white/30">sessions</p>
        </div>
      </div>
      {nextBlock ? (
        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: blockColors[nextBlock.block_type] }}
          />
          <span className="text-xs text-white/50">
            Next: {blockLabels[nextBlock.block_type]} · {nextBlock.date} {nextBlock.time_slot}
          </span>
        </div>
      ) : (
        <p className="pt-3 border-t border-white/[0.06] text-xs text-white/25">No sessions scheduled</p>
      )}
      <div className="mt-3 flex gap-2">
        <Link
          href={`/team-hub/schedule?division=${division}`}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-colors"
        >
          Schedule →
        </Link>
        <Link
          href="/team-hub/availability"
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-colors"
        >
          Availability →
        </Link>
      </div>
    </div>
  );
}

function QuickLink({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between bg-[#111] border border-white/[0.07] rounded-xl p-4 hover:border-[#c5d400]/30 hover:bg-[#c5d400]/[0.03] transition-all"
    >
      <div>
        <p className="font-semibold text-sm text-white group-hover:text-[#c5d400] transition-colors">
          {label}
        </p>
        <p className="text-xs text-white/35 mt-0.5">{desc}</p>
      </div>
      <span className="text-white/20 group-hover:text-[#c5d400]/60 text-lg transition-colors">→</span>
    </Link>
  );
}
