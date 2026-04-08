# Architecture

## Overview

IMPerfect is a Next.js 16 App Router application with three distinct surface areas sharing one codebase, plus standalone public forms.

## Three Surfaces

### 1. Public Site (`/[locale]/*`)
Marketing and community-facing pages. Locale-routed via next-intl middleware (`src/proxy.ts`). Pages: home, team, games, results, community, sponsorship, about, news.

**Key features:**
- Live Marvel Rivals player stats (API + 1hr cache)
- Hero portrait images (Blizzard CDN for OW2, marvelrivalsapi.com for MR)
- Community team registration form (`/[locale]/community/join`)
- Bilingual EN/ES via translation files in `src/messages/`

### 2. Team Hub (`/team-hub/*`)
Authenticated player and staff portal. Discord OAuth via NextAuth. Protected by server-side session check in `(protected)/layout.tsx`.

**Role hierarchy (6 tiers):**
- OWNER (env var `OWNER_DISCORD_ID`) → full access
- ORG_ADMIN → edit players, approve community teams, post announcements
- HEAD_COACH → view all rosters, submit lineups
- MANAGER → manage scrims, view all availability
- CAPTAIN → flag team availability
- PLAYER → view own team, set own availability

**Features:**
- Dashboard, Schedule (weekly grid), Availability (weekly grid + recurring templates + overrides)
- Scrims (CRUD + applications tab), Roster management, Announcements
- Community team registrations admin view
- Admin panel (invites, roles, audit log, player stats overrides)

### 3. Management Dashboard (`/management/*`)
ORG_ADMIN+ only. Separate from Team Hub. Handles org-level operations: tournaments, sponsors, revenue tracking, merch checklist, press kit.

### 4. Public Forms (`/scrims/*`)
Standalone pages bypassing locale middleware. No auth required.
- `/scrims/apply` — Scrim application form

## Middleware

`src/proxy.ts` handles routing:
- `/team-hub`, `/management`, `/scrims` → bypass i18n, pass through directly
- Everything else → next-intl locale routing (EN/ES)

## Data Layer

`src/lib/db.ts` — single data access layer.
- **Primary:** Supabase (PostgreSQL) when `SUPABASE_URL` + `SUPABASE_ANON_KEY` set
- **Fallback:** Local JSON files in `/data/` (dev only, warns in production)
- Management routes (`src/lib/management-db.ts`) require Supabase — no JSON fallback

### Database Tables (18)
| Table | Purpose |
|---|---|
| players | Roster with roles, division, game, rank |
| availability | Weekly per-day status (legacy grid) |
| availability_templates | Recurring weekly schedule (7 days × 3 blocks) |
| availability_overrides | Date-specific exceptions to template |
| schedule_blocks | Weekly practice/scrim/meeting blocks per division |
| scrims | Scheduled scrimmages with results |
| scrim_applications | Public scrim requests from external teams |
| community_teams | Community team registrations |
| community_team_players | Players within community team registrations |
| announcements | Team Hub announcements with audience targeting |
| invites | Token-based invite system with role assignment |
| audit_log | Append-only action log |
| player_stats_override | Manual MR stats overrides |
| reminders_sent | Deduplication for cron reminders |
| tournaments | Tournament tracker |
| sponsors | Sponsor CRM |
| revenue | Revenue tracking |
| checklist_items | Merch launch checklist |

## Discord Integration

Two notification methods:
1. **Bot token** (`DISCORD_BOT_TOKEN`) → Posts to team-specific channels via Discord API v10
2. **Dedicated channels** → `DISCORD_CHANNEL_IMPERFECT`, `DISCORD_CHANNEL_SHADOWS`, `DISCORD_CHANNEL_SCRIMS`, `DISCORD_CHANNEL_COMMUNITY`

**Notification types:**
- Schedule block created/updated/deleted → team channel
- Session reminders (1hr + 15min) → team channel
- All players submit availability → team channel (with day-by-day breakdown)
- New scrim application → scrims channel (with team availability overlay)
- New community team registration → community channel

## External APIs

- **Marvel Rivals API** (`marvelrivalsapi.com/api/v1`) — Player stats, hero data. API key required. 1hr in-memory cache per player.
- **Blizzard CDN** (`d15f34w2p8l1cc.cloudfront.net`) — OW2 hero portrait images (256x256 PNG)
- **Discord API v10** — Bot messages to channels, OAuth authentication
