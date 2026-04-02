export default function AvailabilityLoading() {
  return (
    <div className="p-6 md:p-8 max-w-5xl animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-3 w-32 bg-white/[0.06] rounded mb-2" />
        <div className="h-8 w-48 bg-white/[0.08] rounded" />
      </div>

      {/* Day headers */}
      <div className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="grid grid-cols-8 border-b border-white/[0.06] p-3 gap-2">
          <div className="h-3 w-16 bg-white/[0.06] rounded" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-3 w-8 bg-white/[0.06] rounded mx-auto" />
          ))}
        </div>

        {/* Player rows */}
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="grid grid-cols-8 border-b border-white/[0.04] p-3 gap-2 items-center">
            <div className="h-3 w-20 bg-white/[0.06] rounded" />
            {[0, 1, 2, 3, 4, 5, 6].map((col) => (
              <div key={col} className="h-8 bg-white/[0.04] rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
