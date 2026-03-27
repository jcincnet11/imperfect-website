# IMPerfect Team Hub — Setup Guide

A protected dashboard for IMPerfect players, coaches, and staff.
Accessible at `/team-hub` · Login via Discord OAuth · Data stored in Supabase.

---

## 1. Create a Discord OAuth App

1. Go to [https://discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **New Application** → name it "IMPerfect Team Hub"
3. Go to **OAuth2** in the left sidebar
4. Under **Redirects**, add:
   ```
   https://imperfect-sage.vercel.app/api/auth/callback/discord
   ```
   For local dev also add: `http://localhost:3000/api/auth/callback/discord`
5. Copy the **Client ID** and **Client Secret** — you'll need these for env vars
6. Under **OAuth2 → General**, set **Default Authorization Link** if desired

---

## 2. Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose the closest region to Puerto Rico — `us-east-1`)
3. Once created, go to **Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
4. Go to **SQL Editor** and run the contents of `supabase-schema.sql` to create all tables

---

## 3. Configure Environment Variables

### Local development

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Generate a strong `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Vercel deployment

Go to your Vercel project → **Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `NEXTAUTH_SECRET` | Your random secret (same as local) |
| `NEXTAUTH_URL` | `https://imperfect-sage.vercel.app` |
| `DISCORD_CLIENT_ID` | From Discord Developer Portal |
| `DISCORD_CLIENT_SECRET` | From Discord Developer Portal |
| `APPROVED_DISCORD_IDS` | Comma-separated Discord IDs |
| `SUPABASE_URL` | From Supabase project settings |
| `SUPABASE_ANON_KEY` | From Supabase project settings |

After adding variables, redeploy the project.

---

## 4. Add a New Player

### Step 1: Add to approved list
Add their Discord ID to `APPROVED_DISCORD_IDS` (comma-separated):
```
APPROVED_DISCORD_IDS=111111111111111111,222222222222222222,333333333333333333
```

**How to find a Discord ID:**
- Enable Developer Mode in Discord: User Settings → App Settings → Advanced → Developer Mode
- Right-click on the player's username → **Copy User ID**

### Step 2: Have them log in
Direct them to `https://imperfect-sage.vercel.app/team-hub` — they can log in immediately with their Discord account.

### Step 3: Add to Supabase (for proper display name and division)
In Supabase → Table Editor → `players`, insert a row:
```json
{
  "discord_id": "their-discord-id",
  "display_name": "PlayerTag",
  "division": "OW2",
  "role": "player",
  "is_admin": false
}
```
If they log in before being in the `players` table, they'll still have access — the app defaults their role to `player`.

---

## 5. Promote a Player to Coach or Admin

In Supabase → Table Editor → `players`:
1. Find the player by their `display_name` or `discord_id`
2. Click the cell in the `role` column
3. Change from `player` to `coach` or `admin`

Role permissions:
| Role | Can view schedule | Can edit schedule | See all availability | Manage player list |
|---|:---:|:---:|:---:|:---:|
| `player` | ✓ | — | Own only | — |
| `coach` | ✓ | ✓ | ✓ | View only |
| `admin` | ✓ | ✓ | ✓ | ✓ |

Alternatively, run this SQL in Supabase:
```sql
UPDATE players SET role = 'coach' WHERE discord_id = 'their-discord-id';
```

---

## 6. Remove a Player

Remove their Discord ID from `APPROVED_DISCORD_IDS` and redeploy (or update the env var in Vercel). They will be redirected to the "not on roster" page on their next login attempt.

---

## Local Development Without Supabase

If `SUPABASE_URL` and `SUPABASE_ANON_KEY` are not set, the app falls back to JSON files in the `/data` directory:

- `data/players.json` — player roster
- `data/schedule.json` — schedule blocks
- `data/availability.json` — availability entries

This is useful for development. **Do not use JSON fallback in production** — the `/data` directory is not included in Vercel deployments as persistent storage.

---

## Pages Reference

| URL | Description | Access |
|---|---|---|
| `/team-hub` | Login page | Public |
| `/team-hub/dashboard` | Overview, stats, quick links | All members |
| `/team-hub/schedule` | Weekly practice schedule grid | All members (edit: coach/admin) |
| `/team-hub/availability` | Mark daily availability | All members (full grid: coach/admin) |
| `/team-hub/players` | Manage player roster | Coach/Admin only |
