import { describe, it, expect, beforeEach } from "vitest";
import {
  resolveOrgRole,
  hasRole,
  isOwner,
  can,
  type OrgRole,
} from "../permissions";

beforeEach(() => {
  process.env.OWNER_DISCORD_ID = "owner123";
});

// ─── resolveOrgRole ──────────────────────────────────────────────────────────

describe("resolveOrgRole", () => {
  it("returns OWNER when discordId matches OWNER_DISCORD_ID", () => {
    expect(resolveOrgRole({ discordId: "owner123" })).toBe("OWNER");
  });

  it("returns OWNER even if orgRole is set to something else", () => {
    expect(resolveOrgRole({ discordId: "owner123", orgRole: "PLAYER" })).toBe("OWNER");
  });

  it("returns the orgRole field when discordId does not match", () => {
    expect(resolveOrgRole({ discordId: "user1", orgRole: "ORG_ADMIN" })).toBe("ORG_ADMIN");
    expect(resolveOrgRole({ discordId: "user2", orgRole: "HEAD_COACH" })).toBe("HEAD_COACH");
    expect(resolveOrgRole({ discordId: "user3", orgRole: "MANAGER" })).toBe("MANAGER");
    expect(resolveOrgRole({ discordId: "user4", orgRole: "CAPTAIN" })).toBe("CAPTAIN");
    expect(resolveOrgRole({ discordId: "user5", orgRole: "PLAYER" })).toBe("PLAYER");
  });

  it("defaults to PLAYER when no orgRole provided", () => {
    expect(resolveOrgRole({ discordId: "user1" })).toBe("PLAYER");
  });

  it("defaults to PLAYER when orgRole is null", () => {
    expect(resolveOrgRole({ discordId: "user1", orgRole: null })).toBe("PLAYER");
  });

  it("defaults to PLAYER when orgRole is an invalid string", () => {
    expect(resolveOrgRole({ discordId: "user1", orgRole: "SUPERADMIN" })).toBe("PLAYER");
  });

  it("defaults to PLAYER when discordId is undefined and no orgRole", () => {
    expect(resolveOrgRole({})).toBe("PLAYER");
  });
});

// ─── isOwner ─────────────────────────────────────────────────────────────────

describe("isOwner", () => {
  it("returns true for matching discordId", () => {
    expect(isOwner("owner123")).toBe(true);
  });

  it("returns false for non-matching discordId", () => {
    expect(isOwner("someone_else")).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isOwner(undefined)).toBe(false);
  });
});

// ─── hasRole ─────────────────────────────────────────────────────────────────

describe("hasRole", () => {
  const allRoles: OrgRole[] = ["OWNER", "ORG_ADMIN", "HEAD_COACH", "MANAGER", "CAPTAIN", "PLAYER"];

  it("same role always meets requirement", () => {
    for (const role of allRoles) {
      expect(hasRole(role, role)).toBe(true);
    }
  });

  it("OWNER meets every role requirement", () => {
    for (const required of allRoles) {
      expect(hasRole("OWNER", required)).toBe(true);
    }
  });

  it("PLAYER only meets PLAYER requirement", () => {
    expect(hasRole("PLAYER", "PLAYER")).toBe(true);
    expect(hasRole("PLAYER", "CAPTAIN")).toBe(false);
    expect(hasRole("PLAYER", "MANAGER")).toBe(false);
    expect(hasRole("PLAYER", "HEAD_COACH")).toBe(false);
    expect(hasRole("PLAYER", "ORG_ADMIN")).toBe(false);
    expect(hasRole("PLAYER", "OWNER")).toBe(false);
  });

  it("higher role meets lower role requirement", () => {
    expect(hasRole("OWNER", "PLAYER")).toBe(true);
    expect(hasRole("ORG_ADMIN", "PLAYER")).toBe(true);
    expect(hasRole("HEAD_COACH", "MANAGER")).toBe(true);
    expect(hasRole("MANAGER", "CAPTAIN")).toBe(true);
    expect(hasRole("CAPTAIN", "PLAYER")).toBe(true);
  });

  it("lower role does not meet higher role requirement", () => {
    expect(hasRole("PLAYER", "OWNER")).toBe(false);
    expect(hasRole("CAPTAIN", "MANAGER")).toBe(false);
    expect(hasRole("MANAGER", "HEAD_COACH")).toBe(false);
    expect(hasRole("HEAD_COACH", "ORG_ADMIN")).toBe(false);
    expect(hasRole("ORG_ADMIN", "OWNER")).toBe(false);
  });
});

// ─── can.* permission checks ─────────────────────────────────────────────────

describe("can — OWNER-only permissions", () => {
  const ownerOnly = [
    "manageRoles",
    "deletePlayer",
    "accessFinancials",
    "viewAuditLog",
    "manageInvites",
  ] as const;

  for (const perm of ownerOnly) {
    it(`${perm} — OWNER is true`, () => {
      expect(can[perm]("OWNER")).toBe(true);
    });

    it(`${perm} — ORG_ADMIN is false`, () => {
      expect(can[perm]("ORG_ADMIN")).toBe(false);
    });

    it(`${perm} — PLAYER is false`, () => {
      expect(can[perm]("PLAYER")).toBe(false);
    });
  }
});

describe("can — ORG_ADMIN+ permissions", () => {
  const orgAdminPerms = [
    "editPlayerProfiles",
    "movePlayersBetweenTeams",
    "postAnnouncements",
    "approveLineups",
  ] as const;

  for (const perm of orgAdminPerms) {
    it(`${perm} — OWNER is true`, () => {
      expect(can[perm]("OWNER")).toBe(true);
    });

    it(`${perm} — ORG_ADMIN is true`, () => {
      expect(can[perm]("ORG_ADMIN")).toBe(true);
    });

    it(`${perm} — HEAD_COACH is false`, () => {
      expect(can[perm]("HEAD_COACH")).toBe(false);
    });

    it(`${perm} — PLAYER is false`, () => {
      expect(can[perm]("PLAYER")).toBe(false);
    });
  }
});

describe("can — HEAD_COACH+ permissions", () => {
  const coachPerms = ["viewAllRosters", "addVodNotes", "submitLineup"] as const;

  for (const perm of coachPerms) {
    it(`${perm} — HEAD_COACH is true`, () => {
      expect(can[perm]("HEAD_COACH")).toBe(true);
    });

    it(`${perm} — OWNER is true`, () => {
      expect(can[perm]("OWNER")).toBe(true);
    });

    it(`${perm} — MANAGER is false`, () => {
      expect(can[perm]("MANAGER")).toBe(false);
    });
  }
});

describe("can — MANAGER+ permissions", () => {
  it("manageScrim — MANAGER is true", () => {
    expect(can.manageScrim("MANAGER")).toBe(true);
  });

  it("manageScrim — ORG_ADMIN is true", () => {
    expect(can.manageScrim("ORG_ADMIN")).toBe(true);
  });

  it("manageScrim — OWNER is true", () => {
    expect(can.manageScrim("OWNER")).toBe(true);
  });

  it("manageScrim — CAPTAIN is false", () => {
    expect(can.manageScrim("CAPTAIN")).toBe(false);
  });

  it("viewAllAvailability — MANAGER is true", () => {
    expect(can.viewAllAvailability("MANAGER")).toBe(true);
  });

  it("viewAllAvailability — CAPTAIN is false", () => {
    expect(can.viewAllAvailability("CAPTAIN")).toBe(false);
  });
});

describe("can — CAPTAIN+ permissions", () => {
  it("flagTeamAvailability — CAPTAIN is true", () => {
    expect(can.flagTeamAvailability("CAPTAIN")).toBe(true);
  });

  it("flagTeamAvailability — PLAYER is false", () => {
    expect(can.flagTeamAvailability("PLAYER")).toBe(false);
  });

  it("flagTeamAvailability — OWNER is true", () => {
    expect(can.flagTeamAvailability("OWNER")).toBe(true);
  });
});

describe("can — universal permissions", () => {
  const allRoles: OrgRole[] = ["OWNER", "ORG_ADMIN", "HEAD_COACH", "MANAGER", "CAPTAIN", "PLAYER"];

  it("viewTeamHub — every role is true", () => {
    for (const role of allRoles) {
      expect(can.viewTeamHub(role)).toBe(true);
    }
  });
});
