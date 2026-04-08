# TODO

Task tracking for IMPerfect esports site. Mark `[~]` when starting, `[x]` when done.

## High Priority

- [ ] Get MR username for **the_mofn_ninja** — API returns NOT FOUND, can't pull live stats
- [ ] Get MR username for **tides100ping** — API returns NOT FOUND, can't pull live stats
- [ ] Fill in real OW2 roster data — currently 5 placeholder players (OW2 division rebuilding)
- [ ] Populate Echoes subteam roster — currently TBA ghost cards

## Content & Features

- [x] Add Spanish translations for `/es/community/join` — uses i18n translation keys
- [ ] Add TikTok and YouTube handles to Footer — currently hardcoded to `#`
- [ ] Add Open Graph images per page for better social sharing
- [ ] Build merch store (Phase 3 — planned but not started)

## Performance

- [ ] Optimize player profile images in `public/players/` — files are 1.9–2.8 MB each

## Future Enhancements

- [ ] Pre-resolve and cache availability for next 4 weeks when Manager views scrim scheduling overlay
- [ ] Add "Schedule" action on scrim applications that pre-fills the scrim creation form
- [x] Add Discord notification when community team is approved
- [x] Set up Vercel Cron for `/api/cron/reminders` (every 5 min)
- [ ] Add E2E tests for scrim application and community registration flows

---

## Completed (April 2026)

<details>
<summary>Click to expand</summary>

### Features Built
- [x] Recurring availability templates (weekly schedule, set once)
- [x] One-off availability overrides (date-specific exceptions)
- [x] Scrim application portal (`/scrims/apply`) — public, no auth
- [x] Community team registration (`/en/community/join`) — public, no auth
- [x] Applications tab in `/team-hub/scrims` for Manager+
- [x] Community teams admin view at `/team-hub/community`
- [x] Discord bot notifications — availability completion, schedule changes, reminders
- [x] Discord bot notifications — scrim applications with team availability overlay
- [x] Discord bot notifications — community team registrations
- [x] Hero portrait images on player cards (OW2 Blizzard CDN + MR headshot icons)
- [x] Management division for non-playing admin staff
- [x] Live Marvel Rivals player stats from API
- [x] Manual stats override system for admins
- [x] Register Your Team CTA on homepage + community page

### Bug Fixes
- [x] Fix language switching (full i18n across all pages)
- [x] Fix active nav highlighting (#C8E400)
- [x] Fix sponsorship page blank render
- [x] Fix availability team scoping for players
- [x] Fix select dropdown options invisible (dark bg)
- [x] Fix MR hero portrait URLs (switched from broken thumbnails to card/headbig icons)
- [x] Filter out Unknown heroes from MR stats display
- [x] Bypass locale middleware for /scrims routes

### Player Updates
- [x] Update spooit IGN → kev0o1
- [x] Update filthypryde IGN → FifiPryde
- [x] Update lblazerowl IGN → BŁXZER
- [x] Update iaguacate IGN → l Aguacate l
- [x] Add PapitaSlayër to Shadows roster
- [x] Add malangas as ORG_ADMIN
- [x] Archive crazyturnx (removed from team)
- [x] Move malangas + astrov_11 to Management division

### Infrastructure
- [x] Supabase migrations for all new tables
- [x] Discord bot connected to 3 channels (team, scrims, community)
- [x] Vercel env vars configured for all services
- [x] CI/CD pipeline (GitHub Actions + Vercel preview checks)
- [x] Sentry error tracking + structured logging

</details>
