import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { resolveOrgRole, can } from "@/lib/permissions";
import { getAnnouncements } from "@/lib/db";
import AnnouncementsPanel from "@/components/team-hub/AnnouncementsPanel";

export const metadata = { title: "Announcements — IMPerfect Team Hub" };

export default async function AnnouncementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/team-hub");

  const user = session.user as { discordId?: string; orgRole?: string; division?: string | null };
  const orgRole = resolveOrgRole(user);

  // Determine audience filter based on division
  const division = (session.user as { division?: string | null }).division?.toUpperCase() ?? "ALL";
  const announcements = await getAnnouncements(division);

  return (
    <AnnouncementsPanel
      announcements={announcements}
      orgRole={orgRole}
      canPost={can.postAnnouncements(orgRole)}
      currentDiscordId={user.discordId ?? ""}
    />
  );
}
