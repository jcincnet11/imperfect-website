import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { resolveOrgRole, can, ASSIGNABLE_ROLES, ROLE_LABELS } from "@/lib/permissions";
import { getAllPlayers, getInvites, getAuditLog } from "@/lib/db";
import AdminPanel from "@/components/team-hub/AdminPanel";

export const metadata = { title: "Admin — IMPerfect Team Hub" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/team-hub");

  const orgRole = resolveOrgRole(session.user as { discordId?: string; orgRole?: string });
  if (!can.manageRoles(orgRole)) {
    redirect("/team-hub/dashboard?error=owner_required");
  }

  const [players, invites, auditLog] = await Promise.all([
    getAllPlayers(true),
    getInvites(),
    getAuditLog(50),
  ]);

  return (
    <AdminPanel
      players={players}
      invites={invites}
      auditLog={auditLog}
      assignableRoles={ASSIGNABLE_ROLES}
      roleLabels={ROLE_LABELS}
      ownerDiscordId={process.env.OWNER_DISCORD_ID ?? ""}
    />
  );
}
