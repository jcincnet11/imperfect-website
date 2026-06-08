/**
 * Returns the name of the first missing required field, or null if all present.
 * A field is considered missing if it is undefined, null, or an empty string.
 */
export function missingField(body: Record<string, unknown>, fields: string[]): string | null {
  for (const field of fields) {
    const val = body[field];
    if (val === undefined || val === null || String(val).trim() === "") return field;
  }
  return null;
}

/**
 * Converts a value to a number, returning `fallback` (default 0) if the result is NaN.
 */
export function safeNumber(val: unknown, fallback = 0): number {
  const n = Number(val ?? fallback);
  return isNaN(n) ? fallback : n;
}

/**
 * Returns an error message if `val` is a non-empty string that isn't in `allowed`.
 * Returns null if val is empty/undefined (treated as optional) or is a valid value.
 */
export function invalidEnum(field: string, val: unknown, allowed: readonly string[]): string | null {
  if (val === undefined || val === null || String(val).trim() === "") return null;
  if (!allowed.includes(String(val))) return `Invalid ${field}: must be one of ${allowed.join(", ")}`;
  return null;
}

// ─── Shared enums / formats for write-endpoint validation ───────────────────

export const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
export const AVAILABILITY_STATUSES = ["AVAILABLE", "UNAVAILABLE", "UNSURE"] as const;
export const AVAILABILITY_BLOCKS = ["available", "unavailable", "unset"] as const;
export const BLOCK_TYPES = [
  "PRACTICE", "SCRIM", "VOD_REVIEW", "MEETING", "TOURNAMENT", "FLEX", "REST",
] as const;
export const SCRIM_GAMES = ["OW2", "MR"] as const;
export const SCRIM_STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed"] as const;
export const SCRIM_RESULTS = ["W", "L", "Draw"] as const;
export const ANNOUNCEMENT_AUDIENCES = [
  "ALL", "IMPERFECT", "SHADOWS", "ECHOES", "COACHES", "MANAGERS", "PLAYERS",
] as const;
export const ORG_ROLES = [
  "OWNER", "ORG_ADMIN", "HEAD_COACH", "MANAGER", "CAPTAIN", "PLAYER",
] as const;
export const PLAYER_ROLES = ["admin", "coach", "player"] as const;
export const PLAYER_GAMES = ["OW2", "MR", "BOTH"] as const;
export const DIVISIONS = ["OW2", "MR", "IMPerfect", "Shadows", "Echoes"] as const;

/** Format checks. */
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;      // YYYY-MM-DD
export const TIME_SLOT_RE = /^\d{2}:\d{2}$/;       // HH:MM (cron .split(":") guard)
export const DISCORD_ID_RE = /^\d{5,25}$/;         // Discord snowflake

/**
 * Returns an error message if `val` is present but doesn't match `re`.
 * Empty/undefined is treated as optional (returns null) — pair with missingField
 * when the field is required.
 */
export function invalidFormat(field: string, val: unknown, re: RegExp): string | null {
  if (val === undefined || val === null || String(val).trim() === "") return null;
  if (!re.test(String(val))) return `Invalid ${field} format`;
  return null;
}

/**
 * Returns an error message if `val` is a string longer than `max` characters.
 * Returns null otherwise (including for non-strings / empty).
 */
export function tooLong(field: string, val: unknown, max: number): string | null {
  if (typeof val === "string" && val.length > max) return `${field} exceeds ${max} characters`;
  return null;
}
