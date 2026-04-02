export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 max-w-5xl animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-3 w-32 bg-white/[0.06] rounded mb-2" />
        <div className="h-9 w-64 bg-white/[0.08] rounded mb-1" />
        <div className="h-3 w-24 bg-white/[0.04] rounded" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-[#111] border border-white/[0.07] rounded-xl p-4">
            <div className="h-2 w-20 bg-white/[0.06] rounded mb-3" />
            <div className="h-8 w-12 bg-white/[0.08] rounded" />
          </div>
        ))}
      </div>

      {/* Team cards */}
      <div className="h-4 w-40 bg-white/[0.06] rounded mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-[#111] border border-white/[0.07] rounded-xl p-5 h-36" />
        ))}
      </div>

      {/* Quick links */}
      <div className="h-4 w-32 bg-white/[0.06] rounded mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="bg-[#111] border border-white/[0.07] rounded-xl p-4 h-16" />
        ))}
      </div>
    </div>
  );
}
