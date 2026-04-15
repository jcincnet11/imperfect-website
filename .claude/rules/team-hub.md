---
paths:
  - "src/app/team-hub/(protected)/**/*"
  - "src/components/team-hub/**/*"
  - "src/app/api/availability/**/*"
  - "src/app/api/scrims/**/*"
  - "src/app/api/scrim-applications/**/*"
  - "src/app/api/schedule/**/*"
  - "src/app/api/players/**/*"
  - "src/app/api/announcements/**/*"
  - "src/app/api/admin/**/*"
  - "src/app/api/cron/**/*"
  - "src/app/api/community-teams/**/*"
  - "src/app/api/marvel-rivals/**/*"
  - "src/app/scrims/**/*"
  - "src/lib/discord-notify.ts"
  - "src/lib/mr-stats.ts"
  - "e2e/**/*"
---

# Team Hub Domain

Authenticated team management portal — availability, schedule, scrims, roster, admin tools, and related API routes.

## Conventions

- All protected pages are under `src/app/team-hub/(protected)/` with a shared layout that enforces session auth and renders the `Sidebar`. The `(protected)` route group name matters — it triggers the auth check in `layout.tsx`.
- Every API route follows the pattern: `auth()` → `resolveOrgRole()` → permission check via `can.*` → DB operation → response. Don't skip steps.
- Availability has three layers with strict resolution order: **override > template > unset**. The `resolveAvailability()` function in `db.ts` handles this. Never read raw availability without resolving.
- Templates (`availability_templates`) define recurring weekly patterns with morning/afternoon/evening blocks. Overrides (`availability_overrides`) are date-specific exceptions. The legacy `availability` table stores the simple per-day grid.
- When all players on a division submit their weekly availability, `notifyAvailabilityComplete()` fires a Discord embed with a day-by-day breakdown. Don't break this trigger when modifying availability logic.
- Scrims have two flows: internal (team creates via ScrimsPanel) and external (public application via `/scrims/apply`). ScrimApplicationsPanel shows pending external apps to MANAGER+ roles.
- Discord notifications (`discord-notify.ts`) are fire-and-forget with `.catch(() => {})`. They should never block or fail the parent operation.
- Marvel Rivals stats (`mr-stats.ts`) use a 1-hour in-memory cache per player username. The API key is `MARVEL_RIVALS_API_KEY` env var.
- Schedule blocks are per-division, per-week, with day + time_slot + block_type. The `ScheduleSuggestions` component uses resolved availability to suggest optimal practice times.
- Admin panel (`/team-hub/admin`) is OWNER-only. It manages invites, role assignments, audit log, and player stats overrides.

## Interfaces

- Connects to: auth (session + role checks on every route), data-layer (all CRUD via `db.ts`), public-site (roster data shared)
- Discord channels: `DISCORD_CHANNEL_IMPERFECT`, `DISCORD_CHANNEL_SHADOWS`, `DISCORD_CHANNEL_SCRIMS`, `DISCORD_CHANNEL_COMMUNITY`
