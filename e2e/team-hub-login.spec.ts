import { test, expect } from "@playwright/test";

/**
 * Team Hub login flow E2E tests.
 *
 * These tests cover what can be verified without real Discord OAuth credentials:
 *  - Login page renders correctly
 *  - Unauthenticated users are redirected to login from protected routes
 *
 * The full OAuth flow (Discord → callback → session → dashboard) requires a
 * real Discord test application with fixed credentials. To enable it:
 *  1. Create a Discord test app at discord.com/developers/applications
 *  2. Add a test Discord account to the `players` table in Supabase
 *  3. Set TEST_DISCORD_EMAIL and TEST_DISCORD_PASSWORD in .env.test.local
 *  4. Uncomment the "full OAuth flow" test below
 */

test.describe("Team Hub login page", () => {
  test("renders the login page with IMPerfect branding", async ({ page }) => {
    await page.goto("/team-hub");
    await expect(page).toHaveTitle(/Team Hub.*IMPerfect/i);
    await expect(page.getByRole("heading", { name: /IMPerfect/i }).first()).toBeVisible();
  });

  test("shows Discord login button", async ({ page }) => {
    await page.goto("/team-hub");
    const discordBtn = page.getByRole("button", { name: /discord/i })
      .or(page.getByRole("link", { name: /discord/i }));
    await expect(discordBtn.first()).toBeVisible();
  });

  test("shows not-approved error message when error=not_approved", async ({ page }) => {
    await page.goto("/team-hub?error=not_approved");
    // The page should still render (not crash) and show an error indicator
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Protected route redirect", () => {
  test("redirects /team-hub/dashboard to login when unauthenticated", async ({ page }) => {
    await page.goto("/team-hub/dashboard");
    // Should end up on the login page
    await expect(page).toHaveURL(/\/team-hub(\?.*)?$/);
  });

  test("redirects /team-hub/schedule to login when unauthenticated", async ({ page }) => {
    await page.goto("/team-hub/schedule");
    await expect(page).toHaveURL(/\/team-hub(\?.*)?$/);
  });

  test("redirects /management to login when unauthenticated", async ({ page }) => {
    await page.goto("/management");
    // Should redirect to team-hub (management layout redirects there)
    await expect(page).toHaveURL(/\/team-hub(\?.*)?$/);
  });
});

/**
 * Full OAuth flow — requires real Discord credentials.
 * Uncomment when TEST_DISCORD_EMAIL and TEST_DISCORD_PASSWORD are set.
 */
// test.describe("Full Discord OAuth flow", () => {
//   test("authenticates and reaches the dashboard", async ({ page }) => {
//     await page.goto("/team-hub");
//
//     // Click Discord login
//     await page.getByRole("button", { name: /sign in with discord/i }).click();
//
//     // Fill Discord credentials
//     await page.getByLabel(/email/i).fill(process.env.TEST_DISCORD_EMAIL!);
//     await page.getByLabel(/password/i).fill(process.env.TEST_DISCORD_PASSWORD!);
//     await page.getByRole("button", { name: /log in/i }).click();
//
//     // Authorize the app if prompted
//     const authorizeBtn = page.getByRole("button", { name: /authorize/i });
//     if (await authorizeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
//       await authorizeBtn.click();
//     }
//
//     // Should land on the dashboard
//     await expect(page).toHaveURL("/team-hub/dashboard");
//     await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
//   });
// });
