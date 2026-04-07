import { auth } from "@/auth";
import { resolveOrgRole, hasRole } from "@/lib/permissions";
import { redirect } from "next/navigation";
import CommunityTeamsPanel from "@/components/team-hub/CommunityTeamsPanel";

export default async function CommunityAdminPage() {
  const session = await auth();
  const user = session!.user as Record<string, unknown>;
  const orgRole = resolveOrgRole({ discordId: user.discordId as string, orgRole: user.orgRole as string });

  if (!hasRole(orgRole, "MANAGER")) {
    redirect("/team-hub/dashboard");
  }

  const canModify = hasRole(orgRole, "ORG_ADMIN");

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-6">
        <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">
          Community
        </p>
        <h1 className="font-heading font-black text-3xl text-white tracking-tight">
          Team Registrations
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Review and manage community team registrations
        </p>
      </div>
      <CommunityTeamsPanel canModify={canModify} />
    </div>
  );
}
