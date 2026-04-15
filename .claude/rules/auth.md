---
paths:
  - "src/auth.ts"
  - "src/proxy.ts"
  - "src/lib/permissions.ts"
  - "src/lib/csrf.ts"
  - "src/lib/rate-limit.ts"
  - "src/lib/admin.ts"
  - "src/app/api/auth/**/*"
  - "src/app/team-hub/page.tsx"
  - "src/app/team-hub/join/**/*"
---

# Auth Domain

Authentication (Discord OAuth via NextAuth 5), 6-tier role system, and security middleware.

## Conventions

- OWNER is determined solely by `OWNER_DISCORD_ID` env var — never stored in the database. The `resolveOrgRole()` function in `permissions.ts` checks this first.
- Role hierarchy is numeric: OWNER(100) > ORG_ADMIN(80) > HEAD_COACH(60) > MANAGER(40) > CAPTAIN(20) > PLAYER(10). Use `hasRole(role, required)` for comparisons — never compare strings directly.
- Permission checks use the `can.*` object from `permissions.ts` (e.g., `can.manageScrim(role)`). Don't invent new permission logic inline — add a new `can.*` method instead.
- JWT callback in `auth.ts` embeds `discordId`, `orgRole`, `division`, `captainOf`, and `game` into the session. If you need new session fields, add them there.
- Login gate: users must either be OWNER, exist in the `players` table, have a valid unexpired invite, or be in `APPROVED_DISCORD_IDS` env var.
- `src/proxy.ts` middleware bypasses locale routing for `/team-hub`, `/management`, `/scrims`. If you add a new non-public route prefix, add it here.
- CSRF verification (`csrf.ts`) checks `Origin` header against allowed origins. All mutating API routes should call `verifyCsrfOrigin()`.
- Rate limiting (`rate-limit.ts`) is in-memory, 60 req/min per IP. Public endpoints (scrim applications, community teams) must call `checkRateLimit()`.

## Interfaces

- Connects to: data-layer (`getAllPlayers` for login validation, `getInvites` for invite flow), team-hub (session gating in protected layout)
- Shared types: `OrgRole` from `permissions.ts` is used across all API routes and team-hub components
