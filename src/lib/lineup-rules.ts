/**
 * Game-aware lineup rules.
 * OW2 = 5v5 role queue: 1 Tank / 2 DPS / 2 Support.
 * MR  = 6v6 with flex: 1 Vanguard / 2 Duelists / 2 Strategists + 1 Flex.
 */

export type Game = "OW2" | "MR";

export type LineupRole = {
  key: string;
  label: string;
  count: number;
};

const OW2_ROLES: LineupRole[] = [
  { key: "tank",    label: "Tank",    count: 1 },
  { key: "dps",     label: "DPS",     count: 2 },
  { key: "support", label: "Support", count: 2 },
];

const MR_ROLES: LineupRole[] = [
  { key: "vanguard",   label: "Vanguard",   count: 1 },
  { key: "duelist",    label: "Duelist",    count: 2 },
  { key: "strategist", label: "Strategist", count: 2 },
  { key: "flex",       label: "Flex",       count: 1 },
];

export function rolesForGame(game: Game): LineupRole[] {
  return game === "OW2" ? OW2_ROLES : MR_ROLES;
}

export function slotCountForGame(game: Game): number {
  return rolesForGame(game).reduce((acc, r) => acc + r.count, 0);
}

/** Expands role definitions into an ordered list of expected slot roles. */
export function expectedSlotRoles(game: Game): string[] {
  const out: string[] = [];
  for (const r of rolesForGame(game)) {
    for (let i = 0; i < r.count; i++) out.push(r.key);
  }
  return out;
}

/** Valid role keys for a game. */
export function isValidRole(game: Game, role: string): boolean {
  return rolesForGame(game).some((r) => r.key === role);
}
