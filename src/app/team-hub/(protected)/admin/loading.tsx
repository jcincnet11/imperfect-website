export default function AdminLoading() {
  return (
    <div className="p-6 md:p-8 max-w-5xl animate-pulse">
      <div className="mb-8">
        <div className="h-3 w-28 bg-white/[0.06] rounded mb-2" />
        <div className="h-9 w-44 bg-white/[0.08] rounded" />
      </div>
      <div className="flex gap-3 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-24 bg-white/[0.06] rounded-lg" />
        ))}
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#111] border border-white/[0.07] rounded-xl p-4 h-16" />
        ))}
      </div>
    </div>
  );
}
