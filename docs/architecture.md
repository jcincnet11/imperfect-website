# Architecture

## Overview

IMPerfect is a Next.js 16 App Router application with three distinct surface areas sharing one codebase:

1. **Public site** — Marketing pages, i18n EN/ES, no auth required
2. **Team Hub** — Discord-authenticated area for players, coaches, admins
3. **Management Dashboard** — Admin-only ops tools (tournament tracker, sponsor CRM, merch checklist)

## Routing

Traffic enters through `src/proxy.ts` (Next.js middleware), which acts as a router before any page handler runs:

```
Request
  ├── /team-hub/**  → bypass i18n, enforce NextAuth session
  ├── /management/** → bypass i18n, enforce NextAuth session (admin role)
  └── everything else → next-intl middleware → [locale] routing
```

Public pages live at `src/app/[locale]/` and are accessible at `/en/...` and `/es/...`. The default locale (`en`) also serves at `/` via next-intl's locale detection.

## Authentication

NextAuth v5 with the Discord OAuth provider. The approval flow:

1. User authenticates with Discord
2. `signIn` callback checks `APPROVED_DISCORD_IDS` env var (comma-separated Discord IDs)
3. If approved, `jwt` callback fetches the player's `role` and `division` from Supabase `players` table
4. Role (`player` | `coach` | `admin`) and division are injected into the session via `SessionUser` type augmentation in `src/types/next-auth.d.ts`
5. Unapproved users are redirected to `/team-hub?error=not_approved`

**Current limitation:** The approved ID list is an env var, requiring a redeploy to update when the roster changes. See TODO for the migration path to Supabase-based approval.

## Data Layer

`src/lib/db.ts` provides the abstraction for Team Hub data:

- Checks if `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- If yes → Supabase queries
- If no → reads from JSON files in `data/` (players.json, schedule.json, availability.json)

The JSON fallback is **dev-only**. It exists so contributors can run locally without Supabase credentials. Management data (`src/lib/management-db.ts`) has no fallback — it hard-fails if Supabase is not configured.

## Database

8 tables in Supabase (PostgreSQL). Schema source of truth: `supabase-schema.sql`.

| Table | Purpose |
|---|---|
| `players` | Discord ID, display name, role, division, photo |
| `schedule_blocks` | Weekly practice slots per team |
| `availability` | Per-player daily availability flags |
| `tournaments` | Event tracking with W/L and prize data |
| `sponsors` | Sponsor CRM (contact, tier, status, invoices) |
| `revenue` | Revenue by category for financial reporting |
| `checklist_items` | Merch launch pre-launch checklist (seeded with 21 items) |

The `checklist_items` table is seeded in the schema SQL — no separate seed script needed.

## i18n

next-intl v4 handles locale routing and string translation.

- Config: `src/i18n/routing.ts` (locales: `['en', 'es']`, default: `'en'`)
- Request handler: `src/i18n/request.ts`
- Translations: `src/messages/en.json`, `src/messages/es.json`
- All public page strings must have entries in both translation files

## Key Files

| File | Role |
|---|---|
| `src/proxy.ts` | Middleware: i18n routing + auth enforcement |
| `src/auth.ts` | NextAuth config: Discord provider + role injection |
| `src/lib/db.ts` | Team Hub data: Supabase + JSON fallback |
| `src/lib/management-db.ts` | Management data: Supabase only |
| `src/lib/supabase.ts` | Supabase client singleton |
| `src/lib/discord-notify.ts` | Discord webhook notifications |
| `supabase-schema.sql` | Database schema (source of truth) |
| `.env.example` | All required environment variables |

## Environment Variables

| Variable | Used by |
|---|---|
| `NEXTAUTH_SECRET` | NextAuth session encryption |
| `NEXTAUTH_URL` | NextAuth callback URL |
| `DISCORD_CLIENT_ID` | Discord OAuth app |
| `DISCORD_CLIENT_SECRET` | Discord OAuth app |
| `APPROVED_DISCORD_IDS` | Comma-separated allowed Discord user IDs |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase public API key |

## Deployment

Hosted on Vercel. Production: `imperfect-sage.vercel.app`. Environment variables are configured in the Vercel project dashboard (not committed).

Use `make deploy` (wraps `vercel --prod`) for production deployments. Preview deployments via `make deploy-preview`.
