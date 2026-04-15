import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { resolveOrgRole, can } from "@/lib/permissions";
import { getTournaments } from "@/lib/management-db";
import TournamentPrep from "@/components/team-hub/TournamentPrep";

export const metadata = { title: "Tournament Prep — IMPerfect Team Hub" };

export default async function TournamentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/team-hub");

  const orgRole = resolveOrgRole(session.user);
  const all = await getTournaments();

  // Upcoming & Ongoing first (soonest start date first), then completed
  const active = all
    .filter((t) => t.status === "Upcoming" || t.status === "Ongoing")
    .sort((a, b) => (a.date_start ?? "").localeCompare(b.date_start ?? ""));
  const completed = all
    .filter((t) => t.status === "Completed")
    .sort((a, b) => (b.date_start ?? "").localeCompare(a.date_start ?? ""));

  return (
    <TournamentPrep
      active={active}
      completed={completed.slice(0, 10)}
      canEditNotes={can.addVodNotes(orgRole)}
    />
  );
}
