import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import Link from "next/link";

export const metadata = {
  title: "Team Hub Login — IMPerfect",
};

export default async function TeamHubLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);

  if (session?.user) {
    // If already logged in and there's a next param, honour it
    const dest = params.next?.startsWith("/team-hub/") ? params.next : "/team-hub/dashboard";
    redirect(dest);
  }

  const error = params.error;
  // Validate next to prevent open redirects
  const nextUrl = params.next?.startsWith("/team-hub/") ? params.next : "/team-hub/dashboard";
  const isNotApproved = error === "not_approved" || error === "AccessDenied";

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Lime glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(197,212,0,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/en" className="inline-block">
            <span
              className="font-heading font-black tracking-tight leading-none"
              style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)" }}
            >
              <span style={{ color: "#c5d400" }}>IM</span>
              <span className="text-white">PERFECT</span>
            </span>
          </Link>
          <p className="text-[11px] text-white/25 font-semibold tracking-[0.25em] uppercase mt-1">
            Team Hub
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-8">
          {isNotApproved ? (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-400 text-xl">✕</span>
                </div>
                <h1 className="text-white font-heading font-bold text-xl tracking-wide">
                  Not on the roster yet
                </h1>
                <p className="text-white/40 text-sm mt-2 leading-relaxed">
                  Your Discord account isn&apos;t on the approved roster. Join the server and reach out to a coach.
                </p>
              </div>
              <a
                href="https://discord.gg/VuTAEqPT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3 rounded-xl font-semibold text-sm transition-all bg-[#5865F2] hover:bg-[#4752c4] text-white"
              >
                <DiscordIcon />
                Join the Discord
              </a>
              <a
                href="/team-hub"
                className="block w-full mt-3 py-3 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors text-center"
              >
                Try a different account
              </a>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-white font-heading font-bold text-xl tracking-wide">
                  Team members only
                </h1>
                <p className="text-white/40 text-sm mt-2 leading-relaxed">
                  Log in with the Discord account you use in the IMPerfect server.
                </p>
              </div>

              {error && !isNotApproved && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  Sign-in failed. Please try again.
                </div>
              )}

              <form
                action={async () => {
                  "use server";
                  await signIn("discord", { redirectTo: nextUrl });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl font-bold text-sm transition-all bg-[#5865F2] hover:bg-[#4752c4] text-white hover:scale-[1.01] active:scale-[0.99]"
                >
                  <DiscordIcon />
                  Login with Discord
                </button>
              </form>

              <p className="text-center text-[11px] text-white/20 mt-5 leading-relaxed">
                Only approved IMPerfect roster members can access this area.
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/en" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">
            ← Back to IMPerfect.gg
          </Link>
        </p>
      </div>
    </div>
  );
}

function DiscordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}
