import { test, expect } from "@playwright/test";

test.describe("Scrim application form", () => {
  test("renders the scrim application form", async ({ page }) => {
    await page.goto("/scrims/apply");
    await expect(
      page.getByRole("heading", { name: /Scrim Application/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Submit Application/i })
    ).toBeVisible();
  });

  test("shows validation errors when submitting empty form", async ({
    page,
  }) => {
    await page.goto("/scrims/apply");
    await page.getByRole("button", { name: /Submit Application/i }).click();
    // At least one "Required" error should appear for empty required fields
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("shows client-side validation for required checkboxes", async ({
    page,
  }) => {
    await page.goto("/scrims/apply");
    // Submit without selecting any preferred days
    await page.getByRole("button", { name: /Submit Application/i }).click();
    await expect(page.getByText("Select at least one day")).toBeVisible();
  });

  test("successfully submits a valid application", async ({ page }) => {
    // Mock the API to return 201 success
    await page.route("**/api/scrim-applications", (route) => {
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: "fake-id", status: "pending" }),
      });
    });

    await page.goto("/scrims/apply");

    // Fill text fields
    await page
      .locator("label", { hasText: "Team / Org Name" })
      .locator("..")
      .locator("input")
      .fill("Test Scrimmers");
    await page
      .locator("label", { hasText: "Captain / Contact Name" })
      .locator("..")
      .locator("input")
      .fill("TestCaptain");
    await page
      .locator("label", { hasText: "Captain Discord Handle" })
      .locator("..")
      .locator("input")
      .fill("testcaptain");
    await page
      .locator("label", { hasText: "Region / Location" })
      .locator("..")
      .locator("input")
      .fill("East US");

    // Select game (ow2)
    await page
      .locator("label", { hasText: "Which game?" })
      .locator("..")
      .locator("select")
      .selectOption("ow2");

    // Select format (5v5)
    await page
      .locator("label", { hasText: "Format" })
      .locator("..")
      .locator("select")
      .selectOption("5v5");

    // Fill rank range
    await page
      .locator("label", { hasText: "Competitive rank range" })
      .locator("..")
      .locator("input")
      .fill("Diamond-GM");

    // Click Monday pill
    await page.getByRole("button", { name: /Monday/i }).click();

    // Click Evening pill
    await page.getByRole("button", { name: /Evening/i }).click();

    // Set earliest date to 10 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const dateStr = futureDate.toISOString().slice(0, 10);
    await page
      .locator("label", { hasText: "Earliest available date" })
      .locator("..")
      .locator('input[type="date"]')
      .fill(dateStr);

    // Check discord confirmation checkbox
    await page.locator('input[type="checkbox"]').check();

    // Submit
    await page.getByRole("button", { name: /Submit Application/i }).click();

    // Verify success screen
    await expect(
      page.getByRole("heading", { name: /Application Submitted!/i })
    ).toBeVisible();
  });

  test("shows duplicate error from server", async ({ page }) => {
    // Mock the API to return 409 duplicate
    await page.route("**/api/scrim-applications", (route) => {
      route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          error: "You already have a pending application",
          duplicate: true,
        }),
      });
    });

    await page.goto("/scrims/apply");

    // Fill all required fields (same as success test)
    await page
      .locator("label", { hasText: "Team / Org Name" })
      .locator("..")
      .locator("input")
      .fill("Test Scrimmers");
    await page
      .locator("label", { hasText: "Captain / Contact Name" })
      .locator("..")
      .locator("input")
      .fill("TestCaptain");
    await page
      .locator("label", { hasText: "Captain Discord Handle" })
      .locator("..")
      .locator("input")
      .fill("testcaptain");
    await page
      .locator("label", { hasText: "Region / Location" })
      .locator("..")
      .locator("input")
      .fill("East US");
    await page
      .locator("label", { hasText: "Which game?" })
      .locator("..")
      .locator("select")
      .selectOption("ow2");
    await page
      .locator("label", { hasText: "Format" })
      .locator("..")
      .locator("select")
      .selectOption("5v5");
    await page
      .locator("label", { hasText: "Competitive rank range" })
      .locator("..")
      .locator("input")
      .fill("Diamond-GM");
    await page.getByRole("button", { name: /Monday/i }).click();
    await page.getByRole("button", { name: /Evening/i }).click();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    await page
      .locator("label", { hasText: "Earliest available date" })
      .locator("..")
      .locator('input[type="date"]')
      .fill(futureDate.toISOString().slice(0, 10));

    await page.locator('input[type="checkbox"]').check();

    // Submit
    await page.getByRole("button", { name: /Submit Application/i }).click();

    // Verify duplicate error message appears
    await expect(
      page.getByText("You already have a pending application")
    ).toBeVisible();
  });
});
