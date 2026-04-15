# TODO

AGENTS: When prompted, complete tasks from the list below. Before starting work, mark the item as pending `[~]` so parallel agents don't collide. After completion, mark it `[x]`. Start at the top unless the user specifies otherwise.

## Security & Data Integrity

- [x] Add try-catch error handling to all 14 unprotected API routes — `scrims`, `scrim-applications/[id]`, `schedule`, `players`, `announcements`, `availability/template`, `availability/override`, `admin/users`, `admin/invites`, `admin/audit-log`, `admin/stats-override`. Use `apiError()` from `src/lib/api-error.ts` for consistent responses.
- [x] Add CSRF origin verification (`verifyCsrfOrigin()` from `src/lib/csrf.ts`) to all POST/PATCH/DELETE routes outside `/api/management/` — currently only management routes check it.
- [x] Add rate limiting (`checkRateLimit()`) to public POST endpoints: `/api/scrim-applications` and `/api/community-teams`.
- [x] Add input validation for enum fields in management routes — `game` should be `OW2|MR`, sponsor `tier` should be `founding|gold|silver|bronze|community`, revenue `category` and `payment_method` need defined allowed values.
- [x] Add max-length validation on all user-submitted string fields (team_name, captain_name, notes, etc.) in public endpoints to prevent oversized payloads.
- [x] Add missing env vars to `.env.example` — `OWNER_DISCORD_ID`, `DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_IMPERFECT`, `DISCORD_CHANNEL_SHADOWS`, `DISCORD_CHANNEL_SCRIMS`, `DISCORD_CHANNEL_COMMUNITY`.

## Error Handling & Reliability

- [x] Add React error boundaries for public routes — `src/app/scrims/apply/error.tsx` and `src/app/[locale]/error.tsx`. Team Hub and Management already have them.
- [x] Log Discord notification failures instead of swallowing them with `.catch(() => {})` — use `logger.error()` in `src/app/api/scrim-applications/route.ts`, `src/app/api/community-teams/route.ts`, and `src/lib/discord-notify.ts`.
- [x] Remove hardcoded division list `["IMPerfect", "Shadows", "Echoes"]` in `/api/cron/reminders/route.ts` — query active divisions from the `players` table instead.

## Testing

- [x] Add E2E tests for scrim application flow — submit `/scrims/apply`, verify success state, verify duplicate guard.
- [x] Add E2E tests for community team registration — submit `/[locale]/community/join`, verify success, verify duplicate guard.
- [x] Add unit tests for permission checks — verify each `can.*` function in `src/lib/permissions.ts` against all 6 roles.
- [x] Add unit tests for admin API routes — role changes (`/api/admin/users`), invite CRUD (`/api/admin/invites`), audit log reads.
- [x] Add unit tests for availability resolution — verify override > template > unset priority in `resolveAvailability()`.

## Performance

- [x] Add database indexes: `players(division, archived)`, `availability(week_start, player_discord_id)`, `schedule_blocks(week_start, division)`, `scrims(division, scheduled_at)`. Create a new Supabase migration.
- [x] Add `loading.tsx` skeletons for Team Hub pages missing them: `roster`, `scrims`, `announcements`, `admin`, `community`. Match the style of existing `dashboard/loading.tsx`.
- [x] Optimize player profile images in `public/players/` — files are 1.9–2.8 MB each. Convert to WebP and resize to max 800px width.
- [x] Use `next/image` for Discord avatars and hero portrait images from external CDNs — `remotePatterns` is already configured in `next.config.ts`.

## Observability

- [x] Initialize Sentry properly in `sentry.server.config.ts` and `sentry.edge.config.ts` — currently placeholder files (~232 bytes each) with no real configuration.
- [x] Add `logRequest()` calls to management and admin API routes — currently only `/api/schedule` and `/api/players` use structured request logging.

## Content & Features

- [ ] Get MR username for **the_mofn_ninja** — API returns NOT FOUND, can't pull live stats.
- [ ] Get MR username for **tides100ping** — API returns NOT FOUND, can't pull live stats.
- [ ] Fill in real OW2 roster data — currently 5 placeholder players (OW2 division rebuilding).
- [ ] Populate Echoes subteam roster — currently TBA ghost cards.
- [ ] Add TikTok and YouTube handles to Footer — currently hardcoded to `#`.
- [x] Add Open Graph images per page for better social sharing.

## Future Enhancements

- [x] Pre-resolve and cache availability for next 4 weeks when Manager views scrim scheduling overlay.
- [x] Add "Schedule" action on scrim applications that pre-fills the scrim creation form.
- [ ] Build merch store (Phase 3 — planned but not started).
