/**
 * Simple in-memory rate limiter. Best-effort on Vercel serverless — rate limits are per instance,
 * not global. Provides meaningful protection against bursts within a single instance.
 *
 * Default: 60 requests per minute per IP.
 */

const store = new Map<string, { count: number; reset: number }>();

const LIMIT = 60;
const WINDOW_MS = 60_000;

export function checkRateLimit(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.reset) {
    store.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}
