import CopyBoilerplateButton from "@/components/management/CopyBoilerplateButton";

export const metadata = { title: "Press Kit & Media — IMPerfect Management" };

const BOILERPLATE = `IMPerfect is Puerto Rico's premier esports organization, competing at the highest level in hero shooter titles including Marvel Rivals and Overwatch 2. Founded with a mission to put Puerto Rican talent on the global esports map, IMPerfect fields multiple rosters across competitive divisions and serves as a community hub for the island's growing gaming scene.

With a passionate and engaged fanbase, IMPerfect offers brands a direct connection to the 18–34 demographic across social media, live events, and streaming platforms. The organization combines competitive excellence with authentic community storytelling, making it the ideal partner for brands looking to reach Puerto Rico's gaming community and the broader Latin American esports audience.

For media inquiries, partnership opportunities, and press materials, contact: Imperfectgamingpr@gmail.com`;

const FAQ = [
  {
    q: "How do I request a player interview?",
    a: "Email Imperfectgamingpr@gmail.com with your outlet name, publication date, and preferred player. Allow 5–7 business days for scheduling.",
  },
  {
    q: "What image formats are available in the press kit?",
    a: "All logos are provided in PNG (transparent background), SVG, and PDF formats. Team photos are available as high-resolution JPGs (300dpi).",
  },
  {
    q: "Can I use IMPerfect branding in my article?",
    a: "Yes, for editorial coverage. Logo and team photos may be used in media articles with proper attribution. Commercial use requires written approval.",
  },
  {
    q: "Who is the media contact?",
    a: "All media inquiries go to Imperfectgamingpr@gmail.com. We typically respond within 2 business days.",
  },
  {
    q: "Do you attend or host live events?",
    a: "Yes. IMPerfect hosts community events in Puerto Rico and participates in regional and national tournaments. Contact us for press credentials.",
  },
];

const TONE_GUIDELINES = [
  { do: 'Use "IMPerfect" (capital IM, capital P)', dont: 'Don\'t write "Imperfect" or "imperfect"' },
  { do: "Emphasize Puerto Rican identity and community", dont: "Don't omit the Puerto Rico angle — it's central to our brand" },
  { do: "Refer to us as an esports organization", dont: 'Don\'t use "gaming team" or "esports team" alone' },
  { do: "Use lime/volt green (#C8E400) as our brand color", dont: "Don't use neon green or yellow-green as a substitute" },
  { do: "Heroes: Marvel Rivals, Overwatch 2", dont: "Don't write hero shooter game names without proper capitalization" },
];

export default function PressPage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Breadcrumb */}
      <p className="text-[11px] text-white/25 font-semibold tracking-[0.2em] uppercase mb-1">
        Team Hub &rsaquo; Management &rsaquo; Press Kit
      </p>

      <div className="mb-8">
        <h1 className="font-heading font-black text-3xl tracking-tight text-white">
          Press Kit & Media
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Approved copy, brand assets, and media resources for press coverage.
        </p>
      </div>

      {/* Org overview */}
      <Section title="Organization Overview">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Founded", value: "2023" },
            { label: "Location", value: "Puerto Rico" },
            { label: "Games", value: "MR · OW2" },
            { label: "Divisions", value: "3 Rosters" },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-white/[0.07] rounded-xl p-4 text-center">
              <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mb-1">{s.label}</p>
              <p className="font-heading font-black text-xl text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Approved boilerplate */}
      <Section title="Approved Boilerplate">
        <div className="bg-[#111] border border-[#c5d400]/15 rounded-xl p-5 mb-3">
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{BOILERPLATE}</p>
        </div>
        <CopyBoilerplateButton text={BOILERPLATE} />
      </Section>

      {/* Asset downloads */}
      <Section title="Press Assets">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Logo Pack", desc: "PNG, SVG, PDF — light & dark variants", icon: "◈", ready: false },
            { label: "Team Photo Pack", desc: "High-res player headshots & team photos", icon: "▦", ready: false },
            { label: "Brand Guidelines", desc: "Colors, fonts, usage rules", icon: "◉", ready: false },
            { label: "Fact Sheet", desc: "One-page org stats and history", icon: "◫", ready: false },
          ].map((asset) => (
            <div
              key={asset.label}
              className="flex items-center gap-4 bg-[#111] border border-white/[0.07] rounded-xl p-4"
            >
              <span className="text-xl text-white/20">{asset.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{asset.label}</p>
                <p className="text-xs text-white/35 mt-0.5">{asset.desc}</p>
              </div>
              {asset.ready ? (
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#c5d400]/10 text-[#c5d400] hover:bg-[#c5d400]/20 border border-[#c5d400]/20 transition-colors">
                  Download
                </button>
              ) : (
                <span className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-white/[0.04] text-white/25">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Tone guide */}
      <Section title="Brand Tone & Style Guide">
        <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2 gap-0 px-5 py-3 border-b border-white/[0.06]">
            <span className="text-[10px] font-semibold text-green-400/60 uppercase tracking-widest">Do</span>
            <span className="text-[10px] font-semibold text-red-400/60 uppercase tracking-widest">Don&apos;t</span>
          </div>
          {TONE_GUIDELINES.map((g, i) => (
            <div
              key={g.do}
              className={`grid grid-cols-2 gap-4 px-5 py-3.5 ${i !== TONE_GUIDELINES.length - 1 ? "border-b border-white/[0.04]" : ""}`}
            >
              <div className="flex gap-2">
                <span className="text-green-400/60 shrink-0 mt-0.5 text-xs">✓</span>
                <span className="text-xs text-white/70 leading-relaxed">{g.do}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-red-400/60 shrink-0 mt-0.5 text-xs">✗</span>
                <span className="text-xs text-white/50 leading-relaxed">{g.dont}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Media FAQ */}
      <Section title="Media FAQ">
        <div className="space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                <span className="text-sm font-semibold text-white">{item.q}</span>
                <span className="text-white/30 group-open:text-[#c5d400] text-lg transition-colors ml-4 shrink-0">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 border-t border-white/[0.06]">
                <p className="text-sm text-white/60 leading-relaxed pt-3">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* Media inquiry form */}
      <Section title="Media Inquiry">
        <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-sm text-white/50 mb-5 leading-relaxed">
            Send press inquiries, interview requests, and partnership questions to{" "}
            <a
              href="mailto:Imperfectgamingpr@gmail.com"
              className="text-[#c5d400] hover:underline"
            >
              Imperfectgamingpr@gmail.com
            </a>
            {" "}or use the form below.
          </p>
          <MediaInquiryForm />
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

function MediaInquiryForm() {
  return (
    <form
      action={`mailto:Imperfectgamingpr@gmail.com`}
      method="get"
      encType="text/plain"
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
            Name
          </label>
          <input
            name="name"
            type="text"
            required
            className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
            Outlet / Publication
          </label>
          <input
            name="outlet"
            type="text"
            className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40"
            placeholder="e.g. ESPN Esports, Dot Esports"
          />
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
          Subject
        </label>
        <input
          name="subject"
          type="text"
          required
          className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40"
          placeholder="Interview request, press credential, etc."
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
          Message
        </label>
        <textarea
          name="body"
          rows={4}
          required
          className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40 resize-none"
          placeholder="Describe your inquiry..."
        />
      </div>
      <button
        type="submit"
        className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-[#c5d400] text-black hover:bg-[#d4e400] transition-colors"
      >
        Open Email Client →
      </button>
    </form>
  );
}
