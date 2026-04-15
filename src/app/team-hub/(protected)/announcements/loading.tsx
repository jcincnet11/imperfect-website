export default function AnnouncementsLoading() {
  return (
    <div className="p-6 md:p-8 max-w-5xl animate-pulse">
      <div className="mb-8">
        <div className="h-3 w-32 bg-white/[0.06] rounded mb-2" />
        <div className="h-9 w-56 bg-white/[0.08] rounded" />
      </div>
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-[#111] border border-white/[0.07] rounded-xl p-5 h-28" />
        ))}
      </div>
    </div>
  );
}
