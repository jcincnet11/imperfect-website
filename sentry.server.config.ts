import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!(process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN),

  // Sample 20% of transactions for performance monitoring
  tracesSampleRate: 0.2,

  // Tag environment for filtering in Sentry dashboard
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
});
