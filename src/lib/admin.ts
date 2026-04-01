import type { Session } from "next-auth";

/**
 * Returns true if the session user has the "admin" role.
 * Role is stored in the players table (players.role = 'admin') and
 * baked into the JWT at sign-in via the jwt callback in src/auth.ts.
 * This check always runs server-side — never trust it on the client.
 */
export function isOrgAdmin(session: Session | null): boolean {
  const user = session?.user as { role?: string } | undefined;
  return user?.role === "admin";
}
