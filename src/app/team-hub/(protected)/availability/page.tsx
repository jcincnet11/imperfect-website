import { auth } from "@/auth";
import { getAvailability, getAvailabilityForPlayers, getAllPlayers, getPlayerByDiscordId, getScheduleBlocks } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import AvailabilityGrid from "@/components/team-hub/AvailabilityGrid";

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

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);

  const user = session!.user as { role?: string; orgRole?: string; discordId?: string; displayName?: string; name?: string | null };
  const orgRole = resolveOrgRole(user as Parameters<typeof resolveOrgRole>[0]);
  const isCoachOrAdmin = can.viewAllRosters(orgRole);
  const discordId = user.discordId ?? "";

  const weekStart = params.week ?? getWeekStart();
  const weekLabel = formatWeekLabel(weekStart);

  // Fetch data scoped by role
  let availability;
  let players;
  let myDivisions: string[] = [];
  let otherTeamSchedule: { division: string; day: string; block_type: string; time_slot: string; notes?: string }[] = [];

  if (isCoachOrAdmin) {
    // Coaches/admins see everything
    [availability, players] = await Promise.all([
      getAvailability(weekStart),
      getAllPlayers(),
    ]);
  } else {
    // Players: scope to their own team(s)
    const allPlayers = await getAllPlayers();
    const currentPlayer = await getPlayerByDiscordId(discordId);
    myDivisions = currentPlayer ? [currentPlayer.division] : [];

    // If player is on multiple teams (rare, handle dual-roster)
    const myTeamPlayers = allPlayers.filter((p) => myDivisions.includes(p.division));
    const myTeamDiscordIds = myTeamPlayers.map((p) => p.discord_id);

    // Fetch availability only for teammates
    availability = await getAvailabilityForPlayers(weekStart, myTeamDiscordIds);
    players = myTeamPlayers;

    // Fetch scheduled events for other teams (read-only display)
    const otherDivisions = ["IMPerfect", "Shadows", "Echoes"].filter((d) => !myDivisions.includes(d));
    const schedulePromises = otherDivisions.map((d) => getScheduleBlocks(weekStart, d));
    const scheduleResults = await Promise.all(schedulePromises);
    otherTeamSchedule = scheduleResults.flatMap((blocks, i) =>
      blocks.map((b) => ({ division: otherDivisions[i], day: b.day, block_type: b.block_type, time_slot: b.time_slot, notes: b.notes }))
    );
  }

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
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">
            {isCoachOrAdmin ? "Team Availability" : "My Team's Availability"}
          </p>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">
            {weekLabel}
          </h1>
        </div>

        {/* Week navigator */}
        <div className="flex items-center gap-1">
          <a
            href={`/team-hub/availability?week=${prevWeek}`}
            className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 text-sm transition-colors"
          >
            ‹
          </a>
          <a
            href={`/team-hub/availability?week=${thisWeek}`}
            className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 text-xs font-medium transition-colors"
          >
            Today
          </a>
          <a
            href={`/team-hub/availability?week=${nextWeek}`}
            className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 text-sm transition-colors"
          >
            ›
          </a>
        </div>
      </div>

      {!isCoachOrAdmin && (
        <p className="text-sm text-white/35 mb-5 leading-relaxed">
          Mark your availability for each day this week. Changes save automatically.
        </p>
      )}

      <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
        <AvailabilityGrid
          initialAvailability={availability}
          players={players}
          weekStart={weekStart}
          currentDiscordId={discordId}
          isCoachOrAdmin={isCoachOrAdmin}
          myDivisions={myDivisions}
          otherTeamSchedule={otherTeamSchedule}
        />
      </div>
    </div>
  );
}
