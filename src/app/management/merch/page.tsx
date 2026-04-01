import { getChecklist } from "@/lib/management-db";
import MerchChecklist from "@/components/management/MerchChecklist";

export const metadata = { title: "Merch Store Launch Plan — IMPerfect Management" };

const PHASES = [
  {
    phase: "Phase 1",
    name: "Foundation",
    timeline: "Weeks 1–2",
    color: "border-blue-500/30 bg-blue-500/[0.04]",
    dot: "bg-blue-500",
    tasks: [
      "Set up Shopify store (Basic plan, $29/mo)",
      "Connect Printful integration",
      "Configure payment gateway (Stripe)",
      "Set up domain: shop.imperfectorg.gg",
      "Build out product pages for initial SKUs",
    ],
  },
  {
    phase: "Phase 2",
    name: "Production",
    timeline: "Weeks 3–4",
    color: "border-purple-500/30 bg-purple-500/[0.04]",
    dot: "bg-purple-500",
    tasks: [
      "Finalize all 8 SKU designs with graphic designer",
      "Order physical product samples for photos",
      "Professional product photography session",
      "Write product descriptions (EN + ES)",
      "Set up discount codes for players/partners",
    ],
  },
  {
    phase: "Phase 3",
    name: "Pre-Launch",
    timeline: "Weeks 5–6",
    color: "border-[#c5d400]/30 bg-[#c5d400]/[0.03]",
    dot: "bg-[#c5d400]",
    tasks: [
      "Soft launch to Discord community (exclusive early access)",
      "Social media teaser campaign (3 posts/week)",
      "Influencer seeding — 5 PR packages",
      "Email list signup page live",
      "Test all checkout flows end to end",
    ],
  },
  {
    phase: "Phase 4",
    name: "Launch & Scale",
    timeline: "Week 7+",
    color: "border-green-500/30 bg-green-500/[0.04]",
    dot: "bg-green-500",
    tasks: [
      "Public launch announcement (all channels)",
      "Launch-day social media blitz",
      "Activate affiliate/referral program",
      "Run first paid social ad campaign",
      "Monthly restock + new drop cadence",
    ],
  },
];

const SKUS = [
  { name: "Classic Logo Tee", type: "T-Shirt", price: "$34.99", cost: "$12.00", margin: "66%" },
  { name: "Volt Hoodie", type: "Hoodie", price: "$64.99", cost: "$28.00", margin: "57%" },
  { name: "IMP Snapback", type: "Hat", price: "$29.99", cost: "$11.00", margin: "63%" },
  { name: "Team Jersey", type: "Performance Jersey", price: "$79.99", cost: "$38.00", margin: "52%" },
  { name: "Logo Mousepad XL", type: "Mousepad", price: "$39.99", cost: "$14.00", margin: "65%" },
  { name: "Water Bottle", type: "Drinkware", price: "$24.99", cost: "$9.00", margin: "64%" },
  { name: "Sticker Pack", type: "Stickers (5-pack)", price: "$9.99", cost: "$2.50", margin: "75%" },
  { name: "Limited Edition Zip Hoodie", type: "Zip Hoodie", price: "$84.99", cost: "$36.00", margin: "58%" },
];

const PROJECTIONS = [
  {
    label: "Conservative",
    monthly: "$1,200",
    annual: "$14,400",
    units: "~60/mo",
    color: "border-white/[0.07]",
    textColor: "text-white",
  },
  {
    label: "Base",
    monthly: "$3,500",
    annual: "$42,000",
    units: "~140/mo",
    color: "border-[#c5d400]/20 bg-[#c5d400]/[0.03]",
    textColor: "text-[#c5d400]",
  },
  {
    label: "Optimistic",
    monthly: "$8,000",
    annual: "$96,000",
    units: "~320/mo",
    color: "border-green-500/20 bg-green-500/[0.04]",
    textColor: "text-green-400",
  },
];

const RISKS = [
  { risk: "Printful fulfillment delays", likelihood: "Medium", impact: "High", mitigation: "Buffer inventory, communicate timelines proactively" },
  { risk: "Low initial conversion rate", likelihood: "Medium", impact: "Medium", mitigation: "A/B test landing pages, Discord exclusive discounts" },
  { risk: "Design rights / trademark issues", likelihood: "Low", impact: "High", mitigation: "Legal review of all logo usage before launch" },
  { risk: "Shopify downtime on launch day", likelihood: "Low", impact: "High", mitigation: "Schedule launch off-peak hours, have support contacts ready" },
];

export default async function MerchPage() {
  const checklist = await getChecklist();

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Breadcrumb */}
      <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">
        Team Hub &rsaquo; Management &rsaquo; Merch
      </p>

      <div className="mb-8">
        <h1 className="font-heading font-black text-3xl tracking-tight text-white">
          Merch Store Launch Plan
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Full go-to-market plan for the IMPerfect official merchandise store.
        </p>
      </div>

      {/* Phase timeline */}
      <Section title="Launch Timeline">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PHASES.map((p) => (
            <div key={p.phase} className={`border rounded-xl p-5 ${p.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${p.dot}`} />
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">{p.phase} · {p.timeline}</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-3">{p.name}</h3>
              <ul className="space-y-1.5">
                {p.tasks.map((t) => (
                  <li key={t} className="text-xs text-white/60 flex gap-2">
                    <span className="text-white/20 shrink-0 mt-0.5">–</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Product catalog */}
      <Section title="Product Catalog — Initial 8 SKUs">
        <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-5 py-3 border-b border-white/[0.06]">
            {["Product", "Type", "Retail Price", "COGS", "Margin"].map((h) => (
              <span key={h} className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">{h}</span>
            ))}
          </div>
          {SKUS.map((sku, i) => (
            <div
              key={sku.name}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 items-center px-5 py-3 ${
                i !== SKUS.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}
            >
              <span className="text-sm text-white font-medium">{sku.name}</span>
              <span className="text-xs text-white/50">{sku.type}</span>
              <span className="text-xs text-white/70">{sku.price}</span>
              <span className="text-xs text-white/50">{sku.cost}</span>
              <span className="text-xs text-[#c5d400] font-semibold">{sku.margin}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Revenue projections */}
      <Section title="Revenue Projections">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROJECTIONS.map((p) => (
            <div key={p.label} className={`border rounded-xl p-5 ${p.color}`}>
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">{p.label}</p>
              <p className={`font-heading font-black text-3xl mb-1 ${p.textColor}`}>{p.monthly}</p>
              <p className="text-xs text-white/30">/month · {p.units}</p>
              <p className="text-sm font-semibold text-white/60 mt-3">{p.annual} /year</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pre-launch checklist */}
      <Section title="Pre-Launch Checklist">
        <MerchChecklist initial={checklist} />
      </Section>

      {/* Risk register */}
      <Section title="Risk Register">
        <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_2fr] gap-2 px-5 py-3 border-b border-white/[0.06]">
            {["Risk", "Likelihood", "Impact", "Mitigation"].map((h) => (
              <span key={h} className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">{h}</span>
            ))}
          </div>
          {RISKS.map((r, i) => (
            <div
              key={r.risk}
              className={`grid grid-cols-[2fr_1fr_1fr_2fr] gap-2 items-start px-5 py-3.5 ${
                i !== RISKS.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}
            >
              <span className="text-sm text-white/80">{r.risk}</span>
              <LikelihoodBadge value={r.likelihood} />
              <ImpactBadge value={r.impact} />
              <span className="text-xs text-white/50 leading-relaxed">{r.mitigation}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* External links */}
      <Section title="Setup Links">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ExternalLink label="Shopify Setup Guide" desc="Create your store and connect domain" href="#" />
          <ExternalLink label="Printful Integration" desc="Connect Printful to Shopify" href="#" />
          <ExternalLink label="Stripe Dashboard" desc="Configure payments and payouts" href="#" />
          <ExternalLink label="IMPerfect Brand Assets" desc="Logos and design files for products" href="#" />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-heading font-bold text-lg tracking-wide text-white/60 uppercase mb-4">{title}</h2>
      {children}
    </div>
  );
}

function LikelihoodBadge({ value }: { value: string }) {
  const cls =
    value === "High"
      ? "text-red-400 bg-red-500/10"
      : value === "Medium"
      ? "text-amber-400 bg-amber-500/10"
      : "text-green-400 bg-green-500/10";
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${cls}`}>{value}</span>
  );
}

function ImpactBadge({ value }: { value: string }) {
  const cls =
    value === "High"
      ? "text-red-400 bg-red-500/10"
      : value === "Medium"
      ? "text-amber-400 bg-amber-500/10"
      : "text-blue-400 bg-blue-500/10";
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${cls}`}>{value}</span>
  );
}

function ExternalLink({ label, desc, href }: { label: string; desc: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between bg-[#111] border border-white/[0.07] rounded-xl p-4 hover:border-white/20 transition-all"
    >
      <div>
        <p className="text-sm font-semibold text-white group-hover:text-[#c5d400] transition-colors">{label}</p>
        <p className="text-xs text-white/35 mt-0.5">{desc}</p>
      </div>
      <span className="text-white/20 group-hover:text-white/50 transition-colors">↗</span>
    </a>
  );
}
