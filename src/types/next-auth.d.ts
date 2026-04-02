import "next-auth";
import type { OrgRole } from "@/lib/permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      discordId?: string;
      /** Legacy role field — kept for backward compat with existing pages */
      role?: "admin" | "coach" | "player";
      /** New granular org role */
      orgRole?: OrgRole;
      isOwner?: boolean;
      division?: string | null;
      captainOf?: string | null;
      displayName?: string;
      game?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string;
    role?: string;
    orgRole?: OrgRole;
    isOwner?: boolean;
    division?: string | null;
    captainOf?: string | null;
    displayName?: string;
    game?: string | null;
  }
}
