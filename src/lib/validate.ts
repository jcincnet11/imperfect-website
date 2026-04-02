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
