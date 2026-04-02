# TODO

Task tracking for IMPerfect esports site. Mark `[~]` when starting, `[x]` when done.

## Security & Auth

- [x] Move `APPROVED_DISCORD_IDS` to Supabase `players` table lookup — env var approach breaks when roster changes and requires a redeploy
- [x] Add CSRF protection to all management API routes (currently unauthenticated POST/PATCH/DELETE)
- [x] Validate and sanitize all API route inputs — `src/app/api/management/` routes accept raw request body with no schema validation
- [x] Add rate limiting to public API routes (`/api/players`, `/api/schedule`) to prevent scraping/abuse
- [x] Audit management routes for authorization checks — all `/api/management/*` routes verified; fixed unprotected `/api/cron/reminders` (add `CRON_SECRET` env var + pass as `x-cron-secret` header from your cron scheduler)

## Core Reliability

- [x] Add error boundaries around Team Hub and Management dashboard pages so a data fetch failure doesn't crash the whole page
- [x] Handle Supabase connection failures gracefully in `management-db.ts` — currently throws uncaught errors
- [x] Add a `/api/health` route that checks Supabase connectivity — needed for uptime monitoring
- [x] Fix data fallback behavior: `db.ts` JSON fallback silently serves stale data in prod if env vars are misconfigured — add a warning or hard fail in non-dev environments

## Testing

- [x] Add unit tests for `src/lib/db.ts` and `src/lib/management-db.ts` data layer functions
- [x] Add integration tests for critical API routes (`/api/auth`, `/api/players`, `/api/availability`)
- [x] Add E2E test for Team Hub login flow (Discord OAuth → dashboard)

## CI/CD

- [x] Create GitHub Actions workflow: run `make test` (lint + typecheck) on every PR
- [x] Add Vercel preview deployment check to PRs
- [x] Add `supabase-schema.sql` migration tracking — currently the schema file is the only source of truth with no migration history

## Observability

- [x] Add error tracking (Sentry or Vercel error monitoring) — currently no visibility into runtime exceptions
- [x] Add structured logging to API routes — request/response logging for debugging production issues
- [x] Set up uptime monitoring on `imperfect-sage.vercel.app` (e.g., Better Uptime, UptimeRobot)

## Performance

- [x] Add `next/image` optimization to player profile photos in `public/players/` — currently using plain `<img>` tags
- [x] Implement caching headers on `/api/players` and `/api/schedule` — data changes infrequently
- [x] Lazy-load Framer Motion animations — the bundle includes the full library even on pages with no animation

## UX Polish

- [x] Build out the News page — currently "coming soon"
- [x] Build out Shadows and Echoes team rosters on the Team page — currently placeholders
- [x] Add loading states to Team Hub data fetches — no skeleton/spinner shown while schedule and availability load
- [x] Add mobile navigation menu — Navbar has no hamburger/drawer on small screens

## Developer Experience

- [x] Add `npm run typecheck` script to `package.json` so it works without `npx`
- [x] Create `.env.example` with all required variables documented (already exists — verify it's up to date)
- [x] Add seed script for local Supabase dev data (`data/*.json` files are already there — automate the import)
