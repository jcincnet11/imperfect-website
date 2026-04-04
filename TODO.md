# TODO

Task tracking for IMPerfect esports site. Mark `[~]` when starting, `[x]` when done.

## Content & Features

- [ ] Fill in real OW2 roster data — 5 players use placeholder names/bios/socials (`src/app/[locale]/team/page.tsx`)
- [ ] Populate Shadows and Echoes subteam rosters — currently TBA ghost cards (`src/app/[locale]/team/page.tsx`)
- [ ] Build news article detail pages — cards show "Coming Soon", no `/news/[slug]` route exists
- [ ] Add TikTok and YouTube handles to Footer — currently hardcoded to `#` with TODO comments
- [ ] Translate remaining data strings (community events, milestones, game descriptions, tier perks) to Spanish

## SEO & Metadata

- [x] Add `generateMetadata` to every `[locale]` page — currently zero pages export metadata
- [ ] Add Open Graph images per page
- [x] Add canonical URLs and hreflang alternate links for EN/ES locale pages

## Code Quality

- [x] Fix React Hook conditional call in `ScheduleGrid.tsx` — `useState` called after early return
- [x] Replace `<a>` tags with `<Link>` in `team-hub/join/[token]/page.tsx` and `team-hub/page.tsx`
- [x] Remove unused `hColor` variable in team page player card rendering
- [x] Clean up unused imports: `archivePlayer` in users route, `DAYS`/`TIME_SLOTS` in reminders route

## Accessibility

- [x] Add meaningful alt text to avatar images in Management and Team Hub sidebars
- [ ] Increase ARIA labels on interactive elements (buttons, toggles, modals) across the site
- [x] Add `onError` fallback handlers for player profile images

## Performance & Infra

- [ ] Optimize player profile images in `public/players/` — files are 1.9–2.8 MB each (served via next/image, low priority)
- [ ] Seed `data/availability.json` and `data/schedule.json` with sample data for local dev
- [ ] Standardize API error response format across `/api/management/` routes
- [x] Replace `console.error()` calls with structured logger in error boundaries and management-db

---

## Completed (previous sprint)

<details>
<summary>30+ items — click to expand</summary>

### Security & Auth
- [x] Move `APPROVED_DISCORD_IDS` to Supabase `players` table lookup
- [x] Add CSRF protection to all management API routes
- [x] Validate and sanitize all API route inputs
- [x] Add rate limiting to public API routes
- [x] Audit management routes for authorization checks

### Core Reliability
- [x] Add error boundaries around Team Hub and Management dashboard
- [x] Handle Supabase connection failures gracefully in `management-db.ts`
- [x] Add `/api/health` route for uptime monitoring
- [x] Fix data fallback behavior in `db.ts`

### Testing
- [x] Add unit tests for `db.ts` and `management-db.ts`
- [x] Add integration tests for critical API routes
- [x] Add E2E test for Team Hub login flow

### CI/CD
- [x] Create GitHub Actions workflow for PRs
- [x] Add Vercel preview deployment check
- [x] Add `supabase-schema.sql` migration tracking

### Observability
- [x] Add Sentry error tracking
- [x] Add structured logging to API routes
- [x] Set up uptime monitoring

### Performance
- [x] Add `next/image` optimization to player photos
- [x] Implement caching headers on public API routes
- [x] Lazy-load Framer Motion animations

### UX Polish
- [x] Build out News page
- [x] Build out Shadows and Echoes team sections
- [x] Add loading states to Team Hub data fetches
- [x] Add mobile navigation menu

### Developer Experience
- [x] Add `npm run typecheck` script
- [x] Create `.env.example`
- [x] Add seed script for local dev data

### Bug Fixes (April 2026)
- [x] Fix language switch — full i18n across all pages
- [x] Fix active nav highlight (#C8E400)
- [x] Fix sponsorship page blank render
- [x] Fix availability team scoping for players
- [x] Update Discord invite link

</details>
</content>
</invoke>