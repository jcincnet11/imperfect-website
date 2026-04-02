import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { resolveOrgRole, can } from "@/lib/permissions";
import { getAllPlayers } from "@/lib/db";
import RosterPanel from "@/components/team-hub/RosterPanel";
import AccessDenied from "@/components/team-hub/AccessDenied";

export const metadata = { title: "Roster — IMPerfect Team Hub" };

export default async function RosterPage() {
  const session = await auth();
  if (!session?.user) redirect("/team-hub");

  const user = session.user as { discordId?: string; orgRole?: string; captainOf?: string | null; division?: string | null };
  const orgRole = resolveOrgRole(user);

  if (!can.viewAllRosters(orgRole)) {
    return <AccessDenied message="Head Coach access required" />;
  }

  const players = await getAllPlayers();

  // Group by division
  const divisions = Array.from(new Set(players.map((p) => p.division))).sort();
  const grouped = Object.fromEntries(
    divisions.map((div) => [div, players.filter((p) => p.division === div)])
  );

  return (
    <RosterPanel
      grouped={grouped}
      orgRole={orgRole}
      currentDiscordId={user.discordId ?? ""}
      captainOf={user.captainOf ?? null}
    />
  );
}
