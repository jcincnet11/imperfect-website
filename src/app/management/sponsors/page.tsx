import { getSponsors, getRevenue } from "@/lib/management-db";
import SponsorsPanel from "@/components/management/SponsorsPanel";

export const metadata = { title: "Sponsor CRM & Revenue — IMPerfect Management" };

export default async function SponsorsPage() {
  const [sponsors, revenue] = await Promise.all([getSponsors(), getRevenue()]);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Breadcrumb */}
      <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">
        Team Hub &rsaquo; Management &rsaquo; Sponsors
      </p>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-black text-3xl tracking-tight text-white">
          Sponsor CRM & Revenue
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Track sponsor relationships, deal values, and all revenue streams.
        </p>
      </div>

      <SponsorsPanel initialSponsors={sponsors} initialRevenue={revenue} />
    </div>
  );
}
