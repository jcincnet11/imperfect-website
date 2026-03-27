import { auth } from "@/auth";
import { getScheduleBlocks } from "@/lib/db";
import ScheduleGrid from "@/components/team-hub/ScheduleGrid";
import ScheduleSuggestions from "@/components/team-hub/ScheduleSuggestions";

function getWeekStart(offsetWeeks = 0): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff + offsetWeeks * 7);
  return d.toISOString().split("T")[0];
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + "T12:00:00");
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; division?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);

  const user = session!.user as { role?: string };
  const canEdit = user.role === "admin" || user.role === "coach";

  const TEAMS = ["IMPerfect", "Shadows", "Echoes"];
  const weekStart = params.week ?? getWeekStart();
  const division = TEAMS.includes(params.division ?? "") ? params.division! : "IMPerfect";

  const blocks = await getScheduleBlocks(weekStart, division);

  const weekLabel = formatWeekLabel(weekStart);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">
            Weekly Schedule
          </p>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">
            {weekLabel}
          </h1>
        </div>

        {/* Week navigator */}
        <div className="flex items-center gap-2">
          <WeekNav weekStart={weekStart} division={division} />
        </div>
      </div>

      {/* Team tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <DivisionTab division="IMPerfect" active={division === "IMPerfect"} weekStart={weekStart} label="IMPerfect" />
        <DivisionTab division="Shadows"   active={division === "Shadows"}   weekStart={weekStart} label="Shadows" />
        <DivisionTab division="Echoes"    active={division === "Echoes"}    weekStart={weekStart} label="Echoes" />
      </div>

      <ScheduleSuggestions weekStart={weekStart} division={division} />

      {canEdit && (
        <p className="text-xs text-white/30 mb-4 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5d400] inline-block" />
          Click any cell to add or edit a block. Players see a read-only view.
        </p>
      )}

      <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
        <ScheduleGrid
          initialBlocks={blocks}
          weekStart={weekStart}
          division={division}
          canEdit={canEdit}
        />
      </div>
    </div>
  );
}

function DivisionTab({
  division,
  active,
  weekStart,
  label,
}: {
  division: string;
  active: boolean;
  weekStart: string;
  label: string;
}) {
  return (
    <a
      href={`/team-hub/schedule?week=${weekStart}&division=${division}`}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
        active
          ? "bg-[#c5d400]/10 text-[#c5d400] border border-[#c5d400]/25"
          : "text-white/40 border border-white/[0.07] hover:text-white hover:border-white/20"
      }`}
    >
      {label}
    </a>
  );
}

function WeekNav({ weekStart, division }: { weekStart: string; division: string }) {
  const prevWeek = (() => {
    const d = new Date(weekStart + "T12:00:00");
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  })();
  const nextWeek = (() => {
    const d = new Date(weekStart + "T12:00:00");
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  })();
  const thisWeek = getWeekStart();

  return (
    <div className="flex items-center gap-1">
      <a
        href={`/team-hub/schedule?week=${prevWeek}&division=${division}`}
        className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 text-sm transition-colors"
      >
        ‹
      </a>
      <a
        href={`/team-hub/schedule?week=${thisWeek}&division=${division}`}
        className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 text-xs font-medium transition-colors"
      >
        Today
      </a>
      <a
        href={`/team-hub/schedule?week=${nextWeek}&division=${division}`}
        className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 text-sm transition-colors"
      >
        ›
      </a>
    </div>
  );
}
