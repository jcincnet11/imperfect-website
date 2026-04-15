---
paths:
  - "src/app/[locale]/**/*"
  - "src/components/sections/**/*"
  - "src/components/layout/**/*"
  - "src/components/ui/**/*"
  - "src/messages/**/*"
  - "src/i18n/**/*"
---

# Public Site Domain

Bilingual (EN/ES) marketing pages, homepage sections, and shared layout components.

## Conventions

- All public pages live under `src/app/[locale]/` and are routed by next-intl middleware. Use `useTranslations()` hook for all user-facing text — never hardcode strings.
- EN/ES parity is required. When adding or changing text on any public page, update both `src/messages/en.json` and `src/messages/es.json`. Missing translations break the build.
- Translation keys are nested by page/section (e.g., `home.hero.title`, `community.join.heading`). Follow the existing nesting structure — don't create flat keys.
- Homepage is composed of section components in `src/components/sections/`. Each section is self-contained and imported in `src/app/[locale]/page.tsx`.
- `MotionProvider` wraps framer-motion animations — use it for scroll-triggered animations. Don't import framer-motion directly in page components.
- `SectionHeader` is the standard heading component for public pages. Use it instead of raw `<h2>` tags.
- Navbar and Footer live in `src/components/layout/`. The Navbar handles locale switching via `LanguageToggle`.
- News articles are stored in `src/lib/news-data.ts` as a hardcoded array — not in the database. Dynamic route `[slug]` renders them.
- Brand color `#C8E400` on `#111111` background is non-negotiable. Use Tailwind classes that reference these values.

## Interfaces

- Connects to: auth (no auth required — fully public), data-layer (player data for roster/team pages fetched server-side)
- i18n config: `src/i18n/routing.ts` defines supported locales, `src/i18n/request.ts` provides the translation loader
