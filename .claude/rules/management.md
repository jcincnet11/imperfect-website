---
paths:
  - "src/app/management/**/*"
  - "src/components/management/**/*"
  - "src/app/api/management/**/*"
---

# Management Domain

Org admin dashboard for tournament tracking, sponsor CRM, revenue management, and merch launch planning.

## Conventions

- All management routes require ORG_ADMIN+ role. The management layout (`src/app/management/layout.tsx`) enforces this — individual pages don't need to re-check.
- Management API routes (`/api/management/*`) follow the same auth pattern as team-hub routes but use `management-db.ts` instead of `db.ts`.
- `management-db.ts` has no JSON fallback — it requires a live Supabase connection. Functions throw or return empty arrays when Supabase is unavailable.
- Management pages are NOT locale-routed (no `[locale]` prefix). They're English-only internal tools, bypassed by `proxy.ts` middleware.
- The sidebar (`ManagementSidebar`) is separate from the team-hub sidebar. It links to tournaments, sponsors, merch, and press sections.
- `getManagementStats()` aggregates across tournaments, sponsors, and revenue tables — use it for the dashboard summary instead of making multiple queries.
- Sponsor tiers: `founding`, `gold`, `silver`, `bronze`, `community`. Tier determines display order and styling.
- Revenue entries track `amount` (gross) and `cost` separately, plus a `received` boolean for cash flow tracking.
- MerchChecklist uses a generic checklist pattern (section + label + completed) that could be reused for other launch checklists.
- `CopyBoilerplateButton` generates pre-filled sponsor outreach text — keep the template professional and aligned with the IMPerfect brand voice.

## Interfaces

- Connects to: auth (ORG_ADMIN+ gating), data-layer (`management-db.ts` for all queries)
- Standalone from team-hub — no shared components or state
