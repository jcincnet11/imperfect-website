import { test, expect } from "@playwright/test";

test.describe("Community team registration", () => {
  test("renders the community registration page", async ({ page }) => {
    await page.goto("/en/community/join");
    await expect(page.locator("body")).toBeVisible();
    // Page should contain the registration heading with translated text
    await expect(
      page.getByText(/Bring Your Team/i).or(page.getByText(/Community/i)).first()
    ).toBeVisible();
    // Submit button should be present
    await expect(
      page.getByRole("button", { name: /Register Our Team/i })
    ).toBeVisible();
  });

  test("navigates to the page from the English community page", async ({
    page,
  }) => {
    await page.goto("/en/community");
    // The community page or homepage section has a "Register Your Team" link
    const registerLink = page
      .getByRole("link", { name: /Register/i })
      .or(page.getByRole("link", { name: /Join/i }));
    await expect(registerLink.first()).toBeVisible();
    await registerLink.first().click();
    await expect(page).toHaveURL(/\/community\/join/);
  });
});
