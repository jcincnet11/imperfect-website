import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllPlayers } from "@/lib/db";

export default async function PlayersPage() {
  const session = await auth();
  const role = (session!.user as { role?: string }).role ?? "player";

  if (role !== "admin" && role !== "coach") {
    redirect("/team-hub/dashboard");
  }

  const players = await getAllPlayers();

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">Admin</p>
        <h1 className="font-heading font-black text-3xl text-white tracking-tight">Manage Players</h1>
        <p className="text-white/35 text-sm mt-1">
          {players.length} players on the roster. Edit roles in Supabase or add Discord IDs to{" "}
          <code className="text-[#c5d400]/70 text-xs bg-white/[0.05] px-1 py-0.5 rounded">
            APPROVED_DISCORD_IDS
          </code>
          .
        </p>
      </div>

      {/* Player list */}
      <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/[0.06]">
          <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">Player</span>
          <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest w-16 text-center">Division</span>
          <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest w-16 text-center">Role</span>
          <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest w-36">Discord ID</span>
        </div>

        {players.length === 0 ? (
          <div className="px-5 py-10 text-center text-white/25 text-sm">
            No players found. Add Discord IDs to <code className="text-xs">APPROVED_DISCORD_IDS</code> and they&apos;ll appear here after logging in.
          </div>
        ) : (
          players.map((player) => (
            <div
              key={player.discord_id}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <p className="text-sm text-white font-medium">{player.display_name}</p>
              </div>
              <div className="w-16 text-center">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50">
                  {player.division}
                </span>
              </div>
              <div className="w-16 text-center">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={
                    player.role === "admin"
                      ? { backgroundColor: "rgba(197,212,0,0.12)", color: "#c5d400" }
                      : player.role === "coach"
                      ? { backgroundColor: "rgba(58,123,213,0.15)", color: "#3A7BD5" }
                      : { backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }
                  }
                >
                  {player.role}
                </span>
              </div>
              <div className="w-36">
                <code className="text-[10px] text-white/25 font-mono">{player.discord_id}</code>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Help text */}
      <div className="mt-6 p-5 bg-[#111] border border-white/[0.07] rounded-xl">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">How to manage players</p>
        <ul className="space-y-2 text-sm text-white/40 leading-relaxed">
          <li>
            <span className="text-white/60 font-medium">Add a player:</span> Add their Discord ID to the{" "}
            <code className="text-[#c5d400]/60 text-xs bg-white/[0.05] px-1 rounded">APPROVED_DISCORD_IDS</code>{" "}
            env variable (comma-separated). They can log in immediately.
          </li>
          <li>
            <span className="text-white/60 font-medium">Set role:</span> Update the{" "}
            <code className="text-xs bg-white/[0.05] px-1 rounded">role</code> column in the{" "}
            <code className="text-xs bg-white/[0.05] px-1 rounded">players</code> Supabase table.
            Values: <code className="text-xs">player</code>, <code className="text-xs">coach</code>,{" "}
            <code className="text-xs">admin</code>.
          </li>
          <li>
            <span className="text-white/60 font-medium">Remove a player:</span> Remove their Discord ID from{" "}
            <code className="text-[#c5d400]/60 text-xs bg-white/[0.05] px-1 rounded">APPROVED_DISCORD_IDS</code>.
          </li>
        </ul>
      </div>
    </div>
  );
}
