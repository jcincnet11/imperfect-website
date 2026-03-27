import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { getPlayerByDiscordId } from "@/lib/db";

const approvedIds = (process.env.APPROVED_DISCORD_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "discord") {
        const discordId = (profile as { id?: string })?.id;
        if (!discordId) return false;
        // If approved list is configured, check it; otherwise allow all Discord users
        if (approvedIds.length > 0 && !approvedIds.includes(discordId)) {
          return "/team-hub?error=not_approved";
        }
        return true;
      }
      return false;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordId = (profile as { id?: string }).id ?? "";
        token.discordId = discordId;
        // Fetch role from DB (falls back to "player" if not found)
        try {
          const player = await getPlayerByDiscordId(discordId);
          token.role = player?.role ?? "player";
          token.division = player?.division ?? null;
          token.displayName = player?.display_name ?? token.name ?? "";
        } catch {
          token.role = "player";
          token.division = null;
          token.displayName = token.name ?? "";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as unknown as Record<string, unknown>;
        u.discordId = token.discordId;
        u.role = token.role ?? "player";
        u.division = token.division ?? null;
        u.displayName = token.displayName ?? session.user.name;
        u.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/team-hub",
    error: "/team-hub",
  },
  trustHost: true,
});
