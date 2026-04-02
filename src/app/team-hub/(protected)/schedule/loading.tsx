export default function ScheduleLoading() {
  return (
    <div className="p-6 md:p-8 max-w-5xl animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-3 w-40 bg-white/[0.06] rounded mb-2" />
        <div className="h-8 w-56 bg-white/[0.08] rounded" />
      </div>

      {/* Team/week controls */}
      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-9 w-28 bg-white/[0.06] rounded-lg" />
        ))}
      </div>

      {/* Schedule grid skeleton */}
      <div className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="grid grid-cols-8 border-b border-white/[0.06]">
          <div className="p-3" />
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
            <div key={d} className="p-3 text-center">
              <div className="h-3 w-8 bg-white/[0.06] rounded mx-auto" />
            </div>
          ))}
        </div>
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="grid grid-cols-8 border-b border-white/[0.04]">
            <div className="p-3">
              <div className="h-3 w-10 bg-white/[0.06] rounded" />
            </div>
            {[0, 1, 2, 3, 4, 5, 6].map((col) => (
              <div key={col} className="p-2 min-h-[48px]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
