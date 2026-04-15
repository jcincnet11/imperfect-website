import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { resolveOrgRole, can } from "@/lib/permissions";
import { getScrims, getAllPlayers, getLineupForScrim } from "@/lib/db";
import LineupBuilder from "@/components/team-hub/LineupBuilder";

export const metadata = { title: "Lineup — IMPerfect Team Hub" };

export default async function LineupPage({
  params,
}: {
  params: Promise<{ scrimId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/team-hub");

  const { scrimId } = await params;

  const [scrims, players, lineup] = await Promise.all([
    getScrims(),
    getAllPlayers(),
    getLineupForScrim(scrimId),
  ]);

  const scrim = scrims.find((s) => s.id === scrimId);
  if (!scrim) notFound();

  const orgRole = resolveOrgRole(session.user);
  const canEdit = can.submitLineup(orgRole) || orgRole === "CAPTAIN";

  // Players are filtered to the scrim's division — you can't field someone
  // from a different team
  const rosterPlayers = players
    .filter((p) => !p.archived && p.division === scrim.division)
    .map((p) => ({
      discord_id: p.discord_id,
      display_name: p.display_name,
      in_game_role: p.in_game_role,
    }));

  return (
    <LineupBuilder
      scrim={scrim}
      players={rosterPlayers}
      initialLineup={lineup}
      canEdit={canEdit}
    />
  );
}
