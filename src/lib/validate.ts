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
export function invalidEnum(field: string, val: unknown, allowed: string[]): string | null {
  if (val === undefined || val === null || String(val).trim() === "") return null;
  if (!allowed.includes(String(val))) return `Invalid ${field}: must be one of ${allowed.join(", ")}`;
  return null;
}
