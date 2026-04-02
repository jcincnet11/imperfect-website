/**
 * CSRF origin check for mutating API routes.
 * Returns true if the request origin matches the app host (or if no Origin header is present,
 * which is the case for server-to-server calls and should be allowed).
 */
export function verifyCsrfOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // server-side / non-browser calls — allow
  const host = request.headers.get("host") ?? "";
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
