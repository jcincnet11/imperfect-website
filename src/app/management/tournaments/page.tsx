import { getTournaments } from "@/lib/management-db";
import TournamentsTable from "@/components/management/TournamentsTable";

export const metadata = { title: "Tournament Tracker — IMPerfect Management" };

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Breadcrumb */}
      <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">
        Team Hub &rsaquo; Management &rsaquo; Tournaments
      </p>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-black text-3xl tracking-tight text-white">
          Tournament Tracker
        </h1>
        <p className="text-white/40 text-sm mt-1">Track all competitive entries, results, and prize winnings.</p>
      </div>

      <TournamentsTable initial={tournaments} />
    </div>
  );
}
