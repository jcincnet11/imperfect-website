# Observability

## Error Tracking — Sentry

Sentry is configured via `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`. It's loaded automatically via `instrumentation.ts`.

**Setup:**
1. Create a project at [sentry.io](https://sentry.io) (free tier covers small teams)
2. Copy the DSN from **Settings → Client Keys (DSN)**
3. Add to Vercel environment variables:
   - `NEXT_PUBLIC_SENTRY_DSN` — used by client + server
   - `SENTRY_DSN` — server-only (can be the same value)
   - `SENTRY_AUTH_TOKEN` — optional, enables readable source map uploads

Sentry is silently disabled when `SENTRY_DSN` is not set, so local dev works without configuration.

**What gets captured:**
- Unhandled exceptions in server components, API routes, and client components
- Client-side session replays on error (100% of errors, 10% of sessions)
- Performance traces (20% sample rate)

## Structured Logging

`src/lib/logger.ts` exports a `logger` object and `logRequest` helper.

**Usage in API routes:**
```typescript
import { logRequest } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const start = Date.now();
  // ... handler logic ...
  const res = Response.json(data);
  logRequest(request, res, start, { userId: session.user.id });
  return res;
}
```

In **production**, logs are emitted as JSON (compatible with Vercel Log Drains → Datadog/Logtail/Papertrail). In **development**, logs are human-readable with color.

**Log fields:** `level`, `ts`, `msg`, `route`, `method`, `status`, `durationMs`, `userId`

### Forwarding logs from Vercel

1. Vercel Dashboard → Project → Settings → Log Drains
2. Add a drain for your logging provider (Datadog, Logtail, Papertrail, etc.)
3. All `console.log` JSON output from API routes will be forwarded automatically

## Uptime Monitoring

The `/api/health` endpoint is the canonical health check:
- Returns `200` with `{ ok: true, supabase: "connected" }` when healthy
- Returns `503` when Supabase is unreachable

**Setting up UptimeRobot (free):**
1. Go to [uptimerobot.com](https://uptimerobot.com) → Add New Monitor
2. Monitor type: **HTTP(s)**
3. URL: `https://imperfect-sage.vercel.app/api/health`
4. Monitoring interval: **5 minutes**
5. Alert contacts: your email or Discord webhook

**Setting up Better Uptime (alternative, has Discord alerts):**
1. Go to [betteruptime.com](https://betteruptime.com) → New monitor
2. URL: `https://imperfect-sage.vercel.app/api/health`
3. Add a Discord integration for alerts

Both services will alert you within 5 minutes of the site going down.

## Vercel Built-in Monitoring

Vercel automatically tracks:
- **Web Vitals** (LCP, FID, CLS) — visible at vercel.com/[project] → Analytics
- **Function invocations and errors** — visible in the Vercel dashboard → Logs
- **Deployment previews** — one per PR branch

Enable Vercel Analytics by adding `@vercel/analytics` if you want more detailed metrics.

## Discord Bot Notifications

The app uses a Discord bot (`DISCORD_BOT_TOKEN`) to post notifications to team channels via the Discord API v10.

**Channels (env vars):**
| Env Var | Purpose |
|---|---|
| `DISCORD_CHANNEL_IMPERFECT` | IMPerfect team: availability completion, schedule changes, reminders |
| `DISCORD_CHANNEL_SHADOWS` | Shadows team: same as above |
| `DISCORD_CHANNEL_SCRIMS` | Scrim application alerts (with team availability overlay) |
| `DISCORD_CHANNEL_COMMUNITY` | Community team registration + approval notifications |

**Notification types:**
- Schedule block created/updated/deleted → team channel
- Session reminders (1hr + 15min before) → team channel
- All players submit weekly availability → team channel (day-by-day breakdown + best days)
- New scrim application → scrims channel (includes our team availability for requested days)
- New community team registration → community channel
- Community team approved → community channel (welcome message)

**Code:** `src/lib/discord-notify.ts` (schedule/availability), inline in API routes (scrims, community).

## Vercel Cron

Session reminders are triggered by Vercel Cron, configured in `vercel.json`:

```json
{
  "crons": [{ "path": "/api/cron/reminders", "schedule": "*/5 * * * *" }]
}
```

Runs every 5 minutes. Checks for sessions starting in 55–65 min (1hr reminder) or 10–20 min (15min reminder). Deduplicates via `reminders_sent` table. Protected by `CRON_SECRET` env var (Vercel sends as `Authorization: Bearer` header).
