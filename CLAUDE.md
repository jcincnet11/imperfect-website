# IMPerfect Gaming — Claude Code Agent

## Who you are
You are the developer agent for **IMPerfect Gaming**, a Puerto Rico esports organization founded in 2017 competing in Overwatch 2 and Marvel Rivals. You are embedded in this codebase to help build, maintain, and extend the org's digital infrastructure.

## Project Overview
Bilingual (EN/ES) esports organization website + internal team management platform. Public-facing site showcases the brand, roster, and community. Team Hub provides role-gated tools for scheduling, availability, scrims, and roster management. Management dashboard handles tournaments, sponsors, and revenue tracking.

## Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4 + inline styles (brand: #C8E400 on #111111)
- **Auth:** NextAuth 5 (Discord OAuth) with 6-tier role system (OWNER → PLAYER)
- **Database:** Supabase (PostgreSQL) — JSON fallback for local dev
- **i18n:** next-intl (EN/ES) — translation files in `src/messages/`
- **Hosting:** Vercel (auto-deploy from main)
- **Monitoring:** Sentry (error tracking + session replays)
- **Notifications:** Discord bot (team channels) + webhooks (scrims/community)
- **External API:** Marvel Rivals API (live player stats)
- **Testing:** Vitest (unit) + Playwright (E2E)
- **CI:** GitHub Actions (lint → typecheck → test → preview health check)

## Commands

All operations go through the `Makefile` — the single entry point for build, run, test, and deploy. Run `make help` for the full list.

```bash
make run            # Dev server (localhost:3000)
make build          # Production build
make test           # Lint + typecheck + unit tests
make deploy         # Deploy to Vercel production
make logs           # Tail production logs
make status         # Vercel deployment status
make db-schema      # Dump current Supabase schema
make db-seed        # Seed local dev data
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Public pages (EN/ES) — home, team, community, etc.
│   ├── api/                # Backend routes — auth, availability, scrims, players, etc.
│   ├── management/         # Admin dashboard — tournaments, sponsors, merch, press
│   ├── scrims/             # Public scrim application form (no auth)
│   └── team-hub/           # Authenticated hub — dashboard, schedule, availability, scrims, roster
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── management/         # Tournament, sponsor, merch components
│   ├── sections/           # Homepage sections (Hero, Roster, Community, etc.)
│   ├── team-hub/           # Hub components (grids, panels, editors)
│   └── ui/                 # Shared UI (SectionHeader, MotionProvider)
├── lib/                    # Core logic — db.ts, auth, permissions, discord-notify, mr-stats
├── messages/               # i18n translation files (en.json, es.json)
└── types/                  # TypeScript type augmentations
docs/                       # Living documentation
supabase/migrations/        # Database migrations
Makefile                    # Project operations — single entry point
```

## Architecture

**Three surfaces:**
1. **Public site** (`/[locale]/*`) — Marketing, roster, community. Locale-routed via next-intl middleware.
2. **Team Hub** (`/team-hub/*`) — Discord OAuth gated. 6-tier role system. Schedule, availability, scrims, roster management.
3. **Management** (`/management/*`) — ORG_ADMIN+ only. Tournaments, sponsors, revenue, press kit.

**Key subsystems:**
- **Role system:** OWNER (env var) > ORG_ADMIN > HEAD_COACH > MANAGER > CAPTAIN > PLAYER. Permission checks via `src/lib/permissions.ts`.
- **Availability:** Weekly grid (legacy) + recurring templates + date-specific overrides. Resolution: override > template > unset.
- **Live stats:** Marvel Rivals API → `mr-stats.ts` transform → in-memory cache (1hr TTL). Hero portraits from Blizzard CDN (OW2) and marvelrivalsapi.com (MR).
- **Discord integration:** Bot token for team channel notifications (availability, schedule, reminders). Dedicated channels for scrims and community registrations.
- **Middleware:** `src/proxy.ts` bypasses locale routing for `/team-hub`, `/management`, `/scrims`.

## Database Tables
`players`, `availability`, `availability_templates`, `availability_overrides`, `schedule_blocks`, `scrims`, `scrim_applications`, `community_teams`, `community_team_players`, `announcements`, `invites`, `audit_log`, `player_stats_override`, `reminders_sent`, `tournaments`, `sponsors`, `revenue`, `checklist_items`

## Key Workflows

### Docs
The `docs/` folder is the single source of truth for institutional knowledge. Before starting work on an unfamiliar area, check `docs/` for existing context.

### TODO
`TODO.md` is a lightweight task tracker. Mark items `[~]` (pending) before starting so parallel agents don't collide. Mark `[x]` when done.

### Skills

`.claude/skills/` teaches Claude project-specific conventions and provides reusable workflows as slash commands.

**Reference skills** (auto-loaded as context):
- `cli-first` — Use CLI tools and `.env*` files for third-party services
- `lsp` — Use language servers for type checking, references, and code navigation

**Task skills** (invoked via `/command`):
- `/docs` — Capture conversation learnings into docs and clean up stale content
- `/todo` — Work through TODO.md tasks sequentially (`/todo populate` to re-analyze and seed next batch)
- `/squad` — Analyze the project and generate domain-specific rules and specialist subagents (`/squad refresh` to update)
- `/bosskey` — Summarize recent git activity into a standup script

## Conventions
- Brand color #C8E400 is non-negotiable
- All times displayed in AST (UTC-4, Puerto Rico time)
- Team Hub is role-gated — never expose admin routes to players
- EN/ES parity required for public pages
- Org voice: direct, competitive, Puerto Rican pride, community-first
- Pages in `src/app/[locale]/` for public, `src/app/team-hub/(protected)/` for hub
- Reuse components before creating new ones
- No external dependencies without flagging first
- No console.logs in production code

## External Services
- **Supabase:** Database + auth session storage
- **Vercel:** Hosting, deployments, edge functions
- **Discord:** OAuth provider + bot notifications (3 team channels + scrims + community)
- **Marvel Rivals API:** Live player stats (`MARVEL_RIVALS_API_KEY`)
- **Sentry:** Error tracking + performance monitoring
- **Blizzard CDN:** OW2 hero portrait images
