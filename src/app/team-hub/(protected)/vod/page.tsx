import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { resolveOrgRole, can } from "@/lib/permissions";
import { getAllVodReviews } from "@/lib/db";
import VodLibrary from "@/components/team-hub/VodLibrary";

export const metadata = { title: "VOD Library — IMPerfect Team Hub" };

export default async function VodPage() {
  const session = await auth();
  if (!session?.user) redirect("/team-hub");

  const orgRole = resolveOrgRole(session.user);
  const reviews = await getAllVodReviews();

  return <VodLibrary reviews={reviews} canEdit={can.addVodNotes(orgRole)} />;
}
