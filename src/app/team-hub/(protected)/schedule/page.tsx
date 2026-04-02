import { auth } from "@/auth";
import { getScheduleBlocks, getScrims } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import ScheduleGrid from "@/components/team-hub/ScheduleGrid";
import ScheduleSuggestions from "@/components/team-hub/ScheduleSuggestions";
import CalendarView from "@/components/team-hub/CalendarView";

export const metadata = { title: "Schedule — IMPerfect Team Hub" };

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + "T12:00:00");
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function addWeeks(weekStart: string, n: number): string {
  const d = new Date(weekStart + "T12:00:00");
  d.setDate(d.getDate() + n * 7);
  return d.toISOString().split("T")[0];
}

const TEAMS = ["IMPerfect", "Shadows", "Echoes"];

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; division?: string; view?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);

  const user = session!.user as { role?: string; orgRole?: string; discordId?: string };
  const orgRole = resolveOrgRole(user as Parameters<typeof resolveOrgRole>[0]);
  const canEdit = can.editPlayerProfiles(orgRole) || can.addVodNotes(orgRole);

  const weekStart = params.week ?? getWeekStart();
  const division = TEAMS.includes(params.division ?? "") ? params.division! : "IMPerfect";
  const activeView = params.view === "grid" ? "grid" : "calendar";

  const weekLabel = formatWeekLabel(weekStart);
  const prevWeek = addWeeks(weekStart, -1);
  const nextWeek = addWeeks(weekStart, 1);
  const thisWeek = getWeekStart();

  const [impBlocks, shadowsBlocks, echoesBlocks, scrims, gridBlocks] = await Promise.all([
    activeView === "calendar" ? getScheduleBlocks(weekStart, "IMPerfect") : Promise.resolve([]),
    activeView === "calendar" ? getScheduleBlocks(weekStart, "Shadows")   : Promise.resolve([]),
    activeView === "calendar" ? getScheduleBlocks(weekStart, "Echoes")    : Promise.resolve([]),
    getScrims(),
    activeView === "grid"     ? getScheduleBlocks(weekStart, division)    : Promise.resolve([]),
  ]);

  const allBlocks = [...impBlocks, ...shadowsBlocks, ...echoesBlocks];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">Schedule</p>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">{weekLabel}</h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1">
            <a href={`/team-hub/schedule?week=${weekStart}&division=${division}&view=calendar`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeView === "calendar" ? "bg-[#c5d400] text-black" : "text-white/40 hover:text-white"}`}>
              Calendar
            </a>
            {canEdit && (
              <a href={`/team-hub/schedule?week=${weekStart}&division=${division}&view=grid`}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeView === "grid" ? "bg-[#c5d400] text-black" : "text-white/40 hover:text-white"}`}>
                Edit Grid
              </a>
            )}
          </div>

          <div className="flex items-center gap-1">
            <a href={`/team-hub/schedule?week=${prevWeek}&division=${division}&view=${activeView}`}
              className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white text-sm transition-colors">‹</a>
            <a href={`/team-hub/schedule?week=${thisWeek}&division=${division}&view=${activeView}`}
              className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white text-xs font-medium transition-colors">Today</a>
            <a href={`/team-hub/schedule?week=${nextWeek}&division=${division}&view=${activeView}`}
              className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white text-sm transition-colors">›</a>
          </div>
        </div>
      </div>

      {activeView === "calendar" && (
        <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
          <CalendarView blocks={allBlocks} scrims={scrims} weekStart={weekStart} />
        </div>
      )}

      {activeView === "grid" && canEdit && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {TEAMS.map((t) => (
              <a key={t} href={`/team-hub/schedule?week=${weekStart}&division=${t}&view=grid`}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  division === t
                    ? "bg-[#c5d400]/10 text-[#c5d400] border border-[#c5d400]/25"
                    : "text-white/40 border border-white/[0.07] hover:text-white hover:border-white/20"
                }`}>
                {t}
              </a>
            ))}
          </div>
          <ScheduleSuggestions weekStart={weekStart} division={division} />
          <p className="text-xs text-white/30 mb-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5d400] inline-block" />
            Click any cell to add or edit a block.
          </p>
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
            <ScheduleGrid
              initialBlocks={gridBlocks}
              weekStart={weekStart}
              division={division}
              canEdit={canEdit}
            />
          </div>
        </>
      )}
    </div>
  );
}
