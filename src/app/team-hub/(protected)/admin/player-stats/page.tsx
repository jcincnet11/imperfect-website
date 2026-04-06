import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { resolveOrgRole, can } from "@/lib/permissions";
import { getAllPlayers } from "@/lib/db";
import PlayerStatsAdmin from "@/components/team-hub/PlayerStatsAdmin";

export default async function PlayerStatsPage() {
  const session = await auth();
  if (!session?.user) redirect("/team-hub");

  const orgRole = resolveOrgRole(
    session.user as { discordId?: string; orgRole?: string },
  );

  // Require ORG_ADMIN or higher (editPlayerProfiles maps to ORG_ADMIN+)
  if (!can.editPlayerProfiles(orgRole)) {
    redirect("/team-hub/dashboard?error=admin_required");
  }

  const allPlayers = await getAllPlayers();

  // Filter to non-archived MR players (game === "MR" or "BOTH")
  const mrPlayers = allPlayers.filter(
    (p) => !p.archived && (p.game === "MR" || p.game === "BOTH"),
  );

  // Serialize only what the client component needs
  const players = mrPlayers.map((p) => ({
    discordId: p.discord_id,
    displayName: p.display_name,
    division: p.division,
    inGameRole: p.in_game_role,
    rank: p.rank,
  }));

  return <PlayerStatsAdmin players={players} />;
}
