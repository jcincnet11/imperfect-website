import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/team-hub/Sidebar";

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
  };
  const displayName = user.displayName ?? user.name ?? "Player";
  const role = user.role ?? "player";

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[#0d0d0d] text-white flex">
        <Sidebar displayName={displayName} avatar={user.image} role={role} />
        <main className="flex-1 md:ml-56 pb-20 md:pb-0 min-h-screen">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
