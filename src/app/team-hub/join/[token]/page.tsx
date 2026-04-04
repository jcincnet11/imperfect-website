import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getInviteByToken, upsertPlayer, appendAuditLog } from "@/lib/db";

export const metadata = { title: "Join Team Hub — IMPerfect" };

export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await auth();

  if (!session?.user?.discordId) {
    // Not logged in — send them to login, then back here
    redirect(`/team-hub?next=/team-hub/join/${token}`);
  }

  const invite = await getInviteByToken(token);

  if (!invite || invite.used_by) {
    return <ErrorPage message="This invite link has already been used or doesn't exist." />;
  }

  if (new Date(invite.expires_at) < new Date()) {
    return <ErrorPage message="This invite link has expired." />;
  }

  const discordId = session.user.discordId;
  const displayName = (session.user as { displayName?: string }).displayName ?? session.user.name ?? discordId;

  // Upsert player with the invited role, mark invite used
  await upsertPlayer({
    discord_id: discordId,
    display_name: displayName,
    division: "IMPerfect",
    role: "player",
    is_admin: false,
    org_role: invite.org_role,
    game: null,
    in_game_role: null,
    rank: null,
    captain_of: null,
    archived: false,
  });

  // Mark invite used
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  await supabase.from("invites").update({ used_by: discordId, used_at: new Date().toISOString() }).eq("token", token);

  await appendAuditLog({
    actor_discord_id: invite.created_by,
    action_type: "INVITE_REDEEMED",
    entity_type: "player",
    entity_id: discordId,
    before_val: null,
    after_val: { org_role: invite.org_role, display_name: displayName },
  });

  redirect("/team-hub/dashboard");
}

function ErrorPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-400 text-xl">✕</span>
        </div>
        <h2 className="font-heading text-xl text-white font-bold mb-2">Invalid Invite</h2>
        <p className="text-white/40 text-sm">{message}</p>
        <Link href="/team-hub" className="mt-6 inline-block text-sm text-[#c5d400] hover:underline">Back to Team Hub</Link>
      </div>
    </div>
  );
}
