import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isOrgAdmin } from "@/lib/admin";
import { SessionProvider } from "next-auth/react";
import ManagementSidebar from "@/components/management/ManagementSidebar";

export const metadata = {
  title: "Management — IMPerfect",
};

export default async function ManagementLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/team-hub");
  }

  if (!isOrgAdmin(session)) {
    redirect("/team-hub/dashboard");
  }

  const user = session.user as {
    name?: string | null;
    image?: string | null;
    displayName?: string;
    role?: string;
  };
  const displayName = user.displayName ?? user.name ?? "Admin";
  const role = user.role ?? "admin";

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[#0d0d0d] text-white flex">
        <ManagementSidebar displayName={displayName} avatar={user.image} role={role} />
        <main className="flex-1 md:ml-56 pb-20 md:pb-0 min-h-screen">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
