# IMPerfect Esports — Project Summary
**Last updated:** March 27, 2026

---

## Website — imperfect-sage.vercel.app

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + custom design tokens
- **Animations:** Framer Motion
- **i18n:** next-intl (English + Spanish routing)
- **Auth:** NextAuth v5 with Discord OAuth
- **Database:** Supabase (Team Hub data)
- **Hosting:** Vercel

### Pages Built
| Page | URL | Status |
|------|-----|--------|
| Home | `/en` | Live |
| Team | `/en/team` | Live |
| Games | `/en/games` | Live |
| About | `/en/about` | Live |
| Sponsorship | `/en/sponsorship` | Live |
| Community | `/en/community` | Live |
| Results | `/en/results` | Live |
| News | `/en/news` | Coming Soon placeholder |
| Team Hub | `/team-hub` | Live (Discord auth required) |

### Design System
- **Primary color:** `#C8E400` (lime)
- **Background:** `#1A1A1A` (dark)
- **Font:** Barlow Condensed (headings) + Inter (body)
- **Buttons:** Sharp `border-radius: 3px`, uppercase
- **Cards:** `#222222` bg, `#2A2A2A` border, 3px top accent on key elements

### Homepage Sections
1. **Hero** — Full-screen with video background support (`public/hero.mp4`), stat strip, CTAs
2. **Marquee Ticker** — Scrolling org announcements
3. **Roster Teaser** — 4-col player cards with full-bleed photos
4. **Games Section** — Marvel Rivals + Overwatch 2 cards
5. **About Section** — Brand card with org stats
6. **Community Section** — Discord CTA
7. **Sponsorship Teaser** — Tier overview with email link

### Team Page
- 8 players on IMPerfect roster with real photos
- Shadows + Echoes rosters set to "Coming Soon"
- Player photos located in `public/players/`

| Tag | Role | Label | Photo |
|-----|------|-------|-------|
| iaguacate | Strategist | Coach | AGUACATE_3.png |
| lblazerowl | Strategist | Coach | BLAZER_3.png |
| crazyturnx | Duelist | Player | FILTHYPRYDE.png |
| georgierican | Strategist | Player | GEORGIE.png |
| spooit | Vanguard | Player | KEVO.png |
| the_mofn_ninja | Duelist | Player | MOFN_2.png |
| tides100ping | Duelist | Player | TIDES.png |
| zoivanni | Vanguard | Player | VANNI.png |

### Results Page — Tournament History
**Marvel Rivals**
- UPRM Tournament — 1st Place
- Winter Clash — 1st Place

**Overwatch 2**
- Estarei ×3 — 1st Place
- Heroes de La Bahía — 1st Place
- UPRM Tournament — 1st Place

> Tournament dates not yet added — to be updated when available.

### Sponsorship Page
Three tiers defined (no prices listed — to be negotiated):
- **Associate** — Social + Discord exposure
- **Partner** — Jersey logo, stream overlay, 5 posts/month *(most popular)*
- **Title Sponsor** — Full naming rights, exclusive content, 10 posts/month

Contact email: `sponsorships@imperfectorg.gg` *(confirm with org leadership)*

### Social Links
- **Twitter/X:** x.com/Imperfectow
- **Instagram:** instagram.com/Imperfectgamingpr
- **Discord:** discord.gg/VuTAEqPT
- **TikTok:** *handle pending*
- **YouTube:** *handle pending*

---

## Team Hub — `/team-hub`

Private internal tool for players and coaches. Access requires a Discord account that is in the approved roster list.

### Features
- Discord OAuth login
- Weekly practice schedule (per team: IMPerfect, Shadows, Echoes)
- Player availability tracking
- Player roster management (admin/coach only)
- Dashboard with upcoming sessions + stats

### Access Control
Approved Discord IDs are stored in `src/auth.ts` in the `APPROVED_DISCORD_IDS` array. Add a player's Discord ID to grant access.

### Roles
- `player` — Can view schedule, mark availability
- `coach` — Can view schedule, manage players
- `admin` — Full access

---

## Pending / To Do

### Content
- [ ] Add hero background video (`public/hero.mp4`) — source from MR/OW2 gameplay
- [ ] Add tournament dates to Results page
- [ ] Add Shadows roster (6 players) with photos
- [ ] Add Echoes roster with photos
- [ ] Add OW2 roster when ready
- [ ] Add TikTok and YouTube handles to Footer
- [ ] Confirm sponsorship email address
- [ ] Populate News page when content is ready

### Growth
- [ ] Close first 2–3 sponsorships
- [ ] Reach 1K combined social followers
- [ ] Launch weekly content schedule
- [ ] Register for 3+ open tournaments

---

## Org Documents on File

Located in `IMP docs/extracted/`:

| File | Description |
|------|-------------|
| `IMPerfect_Org_Operations_Bible.docx` | Internal ops, roles, structure |
| `IMPerfect_Org_Sponsorship_Deck.pptx` | Sponsorship presentation deck |
| `IMPerfect_Sponsorship_Growth_Kit.docx` | Sponsor outreach materials |
| `IMPerfect_Brand_and_Media_Pack.html` | Brand guidelines, colors, fonts |
| `IMPerfect_Asset_Index.docx` | Index of all org assets |
| `IMPerfect_Practice_Schedule.xlsx` | Practice schedule template |
| `IMPerfect_Stream_Overlay_Spec.docx` | Stream overlay specifications |
| `JohnVincent_Business_Plan.docx` | Full business plan |

---

## Repository Structure

```
src/
├── app/
│   ├── [locale]/          # Public pages (en/es)
│   │   ├── page.tsx       # Homepage
│   │   ├── team/
│   │   ├── games/
│   │   ├── about/
│   │   ├── sponsorship/
│   │   ├── community/
│   │   ├── results/
│   │   └── news/
│   └── team-hub/          # Private team area
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # Homepage sections
│   └── team-hub/          # Team Hub UI
public/
├── players/               # Player photos
└── hero.mp4               # (add this — video background)
```
