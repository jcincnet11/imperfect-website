# CLAUDE.md

## Project Overview

IMPerfect is a full-featured esports organization website for Puerto Rico's top competitive hero-shooter team, built with Next.js 16 (App Router). It serves dual audiences: a public-facing marketing site (homepage, roster, results, sponsorship, i18n EN/ES) and a private management layer (Discord OAuth–gated Team Hub for players, admin-only Management Dashboard for tournament tracking, sponsor CRM, and merch ops). Deployed on Vercel, backed by Supabase (PostgreSQL), with a JSON fallback for offline dev.

## Tech Stack

- **Framework:** Next.js 16.2.1 (App Router, React 19)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4 via PostCSS plugin
- **Animation:** Framer Motion 12
- **Auth:** NextAuth v5 (Discord OAuth) — approved Discord IDs stored in env
- **Database:** Supabase (PostgreSQL) — `@supabase/supabase-js`; JSON fallback in `data/` for dev
- **i18n:** next-intl v4 — EN + ES, `[locale]` dynamic segment in App Router
- **Hosting:** Vercel (prod: `imperfect-sage.vercel.app`)
- **Linting:** ESLint v9

## Commands

All operations go through the `Makefile` — the single entry point for build, run, test, and deploy. Run `make help` for the full list.

```bash
make build
make test
make run
make deploy TARGET=prod
make logs TARGET=prod
make status
```

Complex commands that need real bash logic live in `scripts/` and are called from Makefile targets.

## Project Structure

```
src/
  app/
    [locale]/         # Public pages with i18n routing (EN/ES)
    api/              # API routes (auth, players, schedule, management)
    management/       # Admin dashboard (outside i18n)
    team-hub/         # Authenticated team area (outside i18n)
  components/
    layout/           # Navbar, Footer
    sections/         # Homepage sections (Hero, RosterTeaser, etc.)
    team-hub/         # Team Hub UI (AvailabilityGrid, Sidebar)
    management/       # Admin UI (TournamentsTable, SponsorsPanel)
    ui/               # Shared primitives (LanguageToggle, SectionHeader)
  lib/
    db.ts             # Data layer — Supabase + JSON fallback
    management-db.ts  # Admin data — Supabase only
    auth.ts           # NextAuth config (Discord OAuth + role lookup)
    supabase.ts       # Supabase client
    discord-notify.ts # Discord webhook notifications
  i18n/               # next-intl config and routing
  messages/           # Translation JSON files (en.json, es.json)
  types/              # TypeScript type augmentations
  proxy.ts            # Middleware: i18n + auth routing
data/                 # JSON fallback data (dev mode only)
public/
  players/            # Player profile photos
supabase/             # Supabase project config
supabase-schema.sql   # Database schema (source of truth)
docs/                 # Living documentation
Makefile              # Project operations — single entry point for all commands
scripts/              # Complex build/deploy scripts called from Makefile
TODO.md               # Task tracking (see TODO Workflow below)
.claude/
  skills/             # Claude skills — conventions and slash commands
```

## Architecture

**Dual routing pattern:** `src/proxy.ts` middleware splits traffic — `/team-hub` and `/management` bypass i18n and go straight to Next.js; everything else flows through next-intl's locale routing (`/en/...`, `/es/...`, default `en`).

**Auth flow:** NextAuth v5 Discord provider checks the user's Discord ID against `APPROVED_DISCORD_IDS` env var. On success, the JWT callback fetches the player's `role` and `division` from Supabase and injects them into the session. Role values: `player`, `coach`, `admin`.

**Data layer abstraction:** `src/lib/db.ts` wraps Supabase with automatic fallback to JSON files in `data/` when Supabase is not configured — useful for local dev without credentials. Management endpoints (`management-db.ts`) are Supabase-only and throw if unconfigured.

**Component organization:** Public page sections live in `components/sections/`. Team Hub and Management components are siloed in their own subdirectories. Shared primitives are in `components/ui/`.

**Database:** 8 tables — `players`, `schedule_blocks`, `availability`, `tournaments`, `sponsors`, `revenue`, `checklist_items`. Schema source of truth is `supabase-schema.sql`.

## Key Workflows

### Docs

The `docs/` folder is the single source of truth for institutional knowledge.

**For AI agents:** Before starting work on an unfamiliar area, check `docs/` for existing context. When you learn something significant during a task — integration quirks, architectural decisions, incident learnings — write it up or update an existing doc. Don't wait to be asked.

- Markdown files organized by topic — one topic per file
- Write as if explaining to a new team member who may be an AI agent

### TODO

`TODO.md` is a lightweight task tracker for human/AI collaboration.

**For AI agents:** Mark items `[~]` (pending) before starting so parallel agents don't collide. Mark `[x]` when done. Start from the top unless told otherwise.

### Skills

`.claude/skills/` teaches Claude project-specific conventions and provides reusable workflows as slash commands. See `docs/vibestack.md` for how to create new ones.

**Reference skills** (auto-loaded as context):
- `cli-first` — Use CLI tools and `.env*` files for third-party services
- `lsp` — Use language servers for type checking, references, and code navigation

**Task skills** (invoked via `/command`):
- `/vibestack` — Set up VibeStack conventions for an existing project (CLAUDE.md, Makefile, docs, TODO.md)
- `/docs` — Capture conversation learnings into docs and clean up stale content
- `/todo` — Work through TODO.md tasks sequentially (`/todo populate` to re-analyze the codebase and seed the next batch of tasks)
- `/squad` — Analyze the project and generate domain-specific rules and specialist subagents (`/squad refresh` to update)

## External Services

This project uses CLI tools for all third-party service interactions. Before using any external API or SDK, check `.env*` files for existing credentials and project configuration. Prefer CLI tools (`aws`, `vercel`, `supabase`, `gh`, `stripe`, `gcloud`, etc.) over web dashboards or raw API calls. See the `cli-first` skill for details.

**Service map:**
- **Supabase** — `SUPABASE_URL` + `SUPABASE_ANON_KEY` — PostgreSQL database; use `supabase` CLI for migrations
- **Discord OAuth** — `DISCORD_CLIENT_ID` + `DISCORD_CLIENT_SECRET` — player authentication; `APPROVED_DISCORD_IDS` controls access
- **Vercel** — `vercel` CLI for deploys, logs, env management

## Conventions

- **Path alias:** `@/*` maps to `./src/*` — always use `@/` imports, never relative `../../`
- **Route organization:** Public i18n pages → `src/app/[locale]/`. Private pages → `src/app/team-hub/` or `src/app/management/` (no locale prefix)
- **API routes:** All under `src/app/api/`. Management APIs under `src/app/api/management/`
- **Component naming:** PascalCase files. Sections are standalone exports (no barrel index files)
- **Design tokens:** Primary `#C8E400` (lime), BG `#1A1A1A`, Card `#222222`, Border `#2A2A2A`. 3px accent bars on cards. `border-radius: 3px`. Buttons uppercase. Fonts: Barlow Condensed (headings), Inter (body)
- **Data access:** Always go through `lib/db.ts` or `lib/management-db.ts` — never call Supabase directly from components or API routes
- **i18n:** All user-visible strings in public pages must have translations in `src/messages/en.json` and `src/messages/es.json`
- **Next.js version:** This is Next.js 16 — APIs and file conventions may differ from training data. Check `node_modules/next/dist/docs/` before writing new patterns
