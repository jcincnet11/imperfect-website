import { getAllPlayers, getAvailability } from "@/lib/db";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const DAY_LABELS: Record<string, string> = {
  MON: "Monday", TUE: "Tuesday", WED: "Wednesday",
  THU: "Thursday", FRI: "Friday", SAT: "Saturday", SUN: "Sunday",
};

type Props = {
  weekStart: string;
  division: string;
};

export default async function ScheduleSuggestions({ weekStart, division }: Props) {
  const [allPlayers, availability] = await Promise.all([
    getAllPlayers(),
    getAvailability(weekStart),
  ]);

  const teamPlayers = allPlayers.filter((p) => p.division === division);
  if (teamPlayers.length === 0) return null;

  const teamIds = new Set(teamPlayers.map((p) => p.discord_id));
  const teamAvailability = availability.filter((a) => teamIds.has(a.player_discord_id));

  const dayCounts = DAYS.map((day) => {
    const available = teamAvailability.filter(
      (a) => a.day === day && a.status === "AVAILABLE"
    ).length;
    const unavailable = teamAvailability.filter(
      (a) => a.day === day && a.status === "UNAVAILABLE"
    ).length;
    const noResponse = teamPlayers.length - available - unavailable;
    return { day, available, unavailable, noResponse, total: teamPlayers.length };
  });

  const suggestions = [...dayCounts]
    .sort((a, b) => b.available - a.available)
    .filter((d) => d.available > 0)
    .slice(0, 3);

  if (suggestions.length === 0) {
    return (
      <div className="mb-5 p-4 bg-[#111] border border-white/[0.07] rounded-xl">
        <p className="text-xs text-white/30">
          No availability data yet — ask players to mark their availability first.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-5 bg-[#111] border border-white/[0.07] rounded-xl p-4">
      <p className="text-[11px] text-white/30 font-semibold uppercase tracking-widest mb-3">
        Best practice times this week
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => {
          const pct = Math.round((s.available / s.total) * 100);
          const isTop = i === 0;
          return (
            <div
              key={s.day}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg border"
              style={
                isTop
                  ? { backgroundColor: "rgba(197,212,0,0.08)", borderColor: "rgba(197,212,0,0.25)" }
                  : { backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }
              }
            >
              {isTop && <span className="text-sm">⭐</span>}
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: isTop ? "#c5d400" : "rgba(255,255,255,0.7)" }}
                >
                  {DAY_LABELS[s.day]} · 7 PM
                </p>
                <p className="text-[11px] text-white/30">
                  {s.available}/{s.total} available ({pct}%)
                  {s.noResponse > 0 && ` · ${s.noResponse} no response`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
