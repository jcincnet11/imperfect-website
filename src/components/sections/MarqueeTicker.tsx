const items = [
  "OVERWATCH 2",
  "MARVEL RIVALS",
  "PUERTO RICO",
  "IMPERFECT",
  "HERO SHOOTERS",
  "COMPETITIVE",
  "TEAM PR",
  "COMUNIDAD",
  "OVERWATCH 2",
  "MARVEL RIVALS",
  "PUERTO RICO",
  "IMPERFECT",
  "HERO SHOOTERS",
  "COMPETITIVE",
  "TEAM PR",
  "COMUNIDAD",
];

export default function MarqueeTicker() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-panel py-4 select-none">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-panel to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-panel to-transparent pointer-events-none" />

      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 px-4">
            <span className="font-heading font-black text-sm uppercase tracking-[0.25em] text-white/30">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-lime/40 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
