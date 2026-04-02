import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { resolveOrgRole, can } from "@/lib/permissions";
import { getScrims, getAllPlayers, getAvailability } from "@/lib/db";
import ScrimsPanel from "@/components/team-hub/ScrimsPanel";
import AccessDenied from "@/components/team-hub/AccessDenied";

export const metadata = { title: "Scrims — IMPerfect Team Hub" };

// Get Monday of current week
function getMondayOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

export default async function ScrimsPage() {
  const session = await auth();
  if (!session?.user) redirect("/team-hub");

  const user = session.user as { discordId?: string; orgRole?: string; division?: string | null };
  const orgRole = resolveOrgRole(user);

  // All roles can view; only staff can edit
  const scrims = await getScrims();

  const weekStart = getMondayOfWeek();
  const [players, availability] = await Promise.all([
    can.viewAllAvailability(orgRole) ? getAllPlayers() : Promise.resolve([]),
    can.viewAllAvailability(orgRole) ? getAvailability(weekStart) : Promise.resolve([]),
  ]);

  return (
    <ScrimsPanel
      scrims={scrims}
      players={players}
      availability={availability}
      orgRole={orgRole}
      currentDiscordId={user.discordId ?? ""}
      canManage={can.manageScrim(orgRole)}
    />
  );
}
