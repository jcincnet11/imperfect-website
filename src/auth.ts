import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import type { OrgRole } from "@/lib/permissions";

const approvedIds = (process.env.APPROVED_DISCORD_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID ?? process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH_DISCORD_SECRET ?? process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "discord") {
        const discordId = (profile as { id?: string })?.id;
        if (!discordId) return false;
        // OWNER always has access
        if (discordId === process.env.OWNER_DISCORD_ID) return true;
        // Primary check: player must exist in the DB
        try {
          const { getPlayerByDiscordId } = await import("@/lib/db");
          const player = await getPlayerByDiscordId(discordId);
          if (!player) return "/team-hub?error=not_approved";
        } catch {
          // DB unavailable — fall back to env var approved list
          if (approvedIds.length > 0 && !approvedIds.includes(discordId)) {
            return "/team-hub?error=not_approved";
          }
        }
        return true;
      }
      return false;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordId = (profile as { id?: string }).id ?? "";
        token.discordId = discordId;
        token.isOwner = discordId === process.env.OWNER_DISCORD_ID;

        try {
          const { getPlayerByDiscordId } = await import("@/lib/db");
          const player = await getPlayerByDiscordId(discordId);
          token.role = player?.role ?? "player";
          token.orgRole = (player?.org_role as OrgRole | undefined) ?? (token.isOwner ? "OWNER" : "PLAYER");
          token.division = player?.division ?? null;
          token.captainOf = player?.captain_of ?? null;
          token.displayName = player?.display_name ?? token.name ?? "";
          token.game = player?.game ?? null;
        } catch {
          token.role = "player";
          token.orgRole = token.isOwner ? "OWNER" : "PLAYER";
          token.division = null;
          token.captainOf = null;
          token.displayName = token.name ?? "";
          token.game = null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as unknown as Record<string, unknown>;
        u.discordId  = token.discordId;
        u.isOwner    = token.isOwner ?? false;
        u.role       = token.role ?? "player";
        u.orgRole    = token.orgRole ?? "PLAYER";
        u.division   = token.division ?? null;
        u.captainOf  = token.captainOf ?? null;
        u.displayName = token.displayName ?? session.user.name;
        u.game       = token.game ?? null;
        u.id         = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/team-hub",
    error:  "/team-hub",
  },
  trustHost: true,
});
