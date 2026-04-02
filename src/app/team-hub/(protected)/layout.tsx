import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/team-hub/Sidebar";
import { resolveOrgRole } from "@/lib/permissions";
import type { OrgRole } from "@/lib/permissions";

export const metadata = {
  title: "Team Hub — IMPerfect",
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/team-hub");
  }

  const user = session.user as {
    name?: string | null;
    image?: string | null;
    displayName?: string;
    role?: string;
    orgRole?: OrgRole;
    discordId?: string;
  };

  const displayName = user.displayName ?? user.name ?? "Player";
  const role = user.role ?? "player";
  const orgRole = resolveOrgRole({ discordId: user.discordId, orgRole: user.orgRole });

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[#0d0d0d] text-white flex">
        <Sidebar displayName={displayName} avatar={user.image} role={role} orgRole={orgRole} />
        <main className="flex-1 md:ml-56 pb-20 md:pb-0 min-h-screen">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
