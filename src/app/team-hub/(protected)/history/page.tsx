import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getScrims } from "@/lib/db";
import MatchHistory from "@/components/team-hub/MatchHistory";

export const metadata = { title: "Match History — IMPerfect Team Hub" };

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/team-hub");

  const scrims = await getScrims();
  const completed = scrims.filter((s) => s.status === "Completed");

  return <MatchHistory scrims={completed} />;
}
