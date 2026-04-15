export default function RosterLoading() {
  return (
    <div className="p-6 md:p-8 max-w-5xl animate-pulse">
      <div className="mb-8">
        <div className="h-3 w-24 bg-white/[0.06] rounded mb-2" />
        <div className="h-9 w-48 bg-white/[0.08] rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-[#111] border border-white/[0.07] rounded-xl p-5 h-32" />
        ))}
      </div>
    </div>
  );
}
