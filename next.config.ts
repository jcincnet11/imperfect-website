import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/avatars/**",
      },
      {
        protocol: "https",
        hostname: "marvelrivalsapi.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d15f34w2p8l1cc.cloudfront.net",
        pathname: "/overwatch/**",
      },
    ],
  },
};

export default withSentryConfig(
  withNextIntl(nextConfig),
  {
    // Suppress noisy Sentry build output unless DSN is set
    silent: !process.env.SENTRY_DSN,
    // Disable source map uploads unless auth token is configured
    authToken: process.env.SENTRY_AUTH_TOKEN,
    telemetry: false,
  }
);
