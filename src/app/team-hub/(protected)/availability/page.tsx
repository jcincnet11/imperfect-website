import { auth } from "@/auth";
import { getAvailability, getAllPlayers } from "@/lib/db";
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

  const user = session!.user as { role?: string; discordId?: string; displayName?: string; name?: string | null };
  const isCoachOrAdmin = user.role === "admin" || user.role === "coach";
  const discordId = user.discordId ?? "";

  const weekStart = params.week ?? getWeekStart();
  const weekLabel = formatWeekLabel(weekStart);

  const [availability, players] = await Promise.all([
    getAvailability(weekStart, isCoachOrAdmin ? undefined : discordId),
    getAllPlayers(),
  ]);

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
            {isCoachOrAdmin ? "Team Availability" : "My Availability"}
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
        />
      </div>
    </div>
  );
}
