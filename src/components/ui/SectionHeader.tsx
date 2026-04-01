interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionHeader({ eyebrow, title, subtitle, center = false }: Props) {
  const align = center ? "text-center mx-auto" : "";
  return (
    <div className={`mb-8 md:mb-12 ${align}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2
        className="font-heading font-black uppercase text-white leading-[0.95]"
        style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm leading-relaxed max-w-xl" style={{ color: "#888888" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
