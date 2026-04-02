/**
 * Role-based permission system for IMPerfect Team Hub.
 *
 * Role hierarchy (high → low):
 *   OWNER > ORG_ADMIN > HEAD_COACH > MANAGER > CAPTAIN > PLAYER
 *
 * OWNER is never stored in the DB — always compared against OWNER_DISCORD_ID env var.
 */

export type OrgRole =
  | "OWNER"
  | "ORG_ADMIN"
  | "HEAD_COACH"
  | "MANAGER"
  | "CAPTAIN"
  | "PLAYER";

/** Numeric rank — higher = more permissions. */
const ROLE_RANK: Record<OrgRole, number> = {
  OWNER:      100,
  ORG_ADMIN:  80,
  HEAD_COACH: 60,
  MANAGER:    40,
  CAPTAIN:    20,
  PLAYER:     10,
};

/** Resolve the effective org role for a session user. */
export function resolveOrgRole(user: {
  discordId?: string;
  orgRole?: string | null;
}): OrgRole {
  if (user.discordId && user.discordId === process.env.OWNER_DISCORD_ID) {
    return "OWNER";
  }
  const r = user.orgRole as OrgRole | undefined;
  if (r && r in ROLE_RANK) return r;
  return "PLAYER";
}

/** True if `role` meets or exceeds `required`. */
export function hasRole(role: OrgRole, required: OrgRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

/** True if the user is the OWNER. */
export function isOwner(discordId?: string): boolean {
  return Boolean(discordId && discordId === process.env.OWNER_DISCORD_ID);
}

// ─── Specific permission checks ───────────────────────────────────────────────

/** Can assign/revoke roles, delete players, access financials. OWNER only. */
export const can = {
  manageRoles:      (r: OrgRole) => r === "OWNER",
  deletePlayer:     (r: OrgRole) => r === "OWNER",
  accessFinancials: (r: OrgRole) => r === "OWNER",
  viewAuditLog:     (r: OrgRole) => r === "OWNER",
  manageInvites:    (r: OrgRole) => r === "OWNER",

  editPlayerProfiles: (r: OrgRole) => hasRole(r, "ORG_ADMIN"),
  movePlayersBetweenTeams: (r: OrgRole) => hasRole(r, "ORG_ADMIN"),
  postAnnouncements: (r: OrgRole) => hasRole(r, "ORG_ADMIN"),
  approveLineups:   (r: OrgRole) => hasRole(r, "ORG_ADMIN"),
  viewAllRosters:   (r: OrgRole) => hasRole(r, "HEAD_COACH"),
  addVodNotes:      (r: OrgRole) => hasRole(r, "HEAD_COACH"),
  submitLineup:     (r: OrgRole) => hasRole(r, "HEAD_COACH"),

  manageScrim:    (r: OrgRole) => hasRole(r, "MANAGER") || r === "ORG_ADMIN" || r === "OWNER",
  viewAllAvailability: (r: OrgRole) => hasRole(r, "MANAGER"),

  /** Captain can flag own team's player availability. */
  flagTeamAvailability: (r: OrgRole) => hasRole(r, "CAPTAIN"),

  viewTeamHub: (_r: OrgRole) => true,  // all authenticated users
} as const;

/** Display label for a role. */
export const ROLE_LABELS: Record<OrgRole, string> = {
  OWNER:      "Owner",
  ORG_ADMIN:  "Org Admin",
  HEAD_COACH: "Head Coach",
  MANAGER:    "Manager",
  CAPTAIN:    "Captain",
  PLAYER:     "Player",
};

/** Roles that can be assigned via UI (OWNER is hardcoded). */
export const ASSIGNABLE_ROLES: OrgRole[] = [
  "ORG_ADMIN",
  "HEAD_COACH",
  "MANAGER",
  "CAPTAIN",
  "PLAYER",
];
