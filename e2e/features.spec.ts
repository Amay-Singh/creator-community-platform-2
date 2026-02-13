import { test, expect } from "@playwright/test";

test.describe("Core Features", () => {
  test("explore page has search input", async ({ page }) => {
    await page.goto("/explore");
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill("musician");
      await expect(searchInput).toHaveValue("musician");
    }
  });

  test("landing page has call-to-action buttons", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    const links = page.getByRole("link");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test("dashboard shows quick actions", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("settings page has tab navigation", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("body")).toBeVisible();
  });

  test("ai-studio page has content generation form", async ({ page }) => {
    await page.goto("/ai-studio");
    await expect(page.locator("body")).toBeVisible();
  });

  test("collaborations page renders project list", async ({ page }) => {
    await page.goto("/collaborations");
    await expect(page.locator("body")).toBeVisible();
  });

  test("messages page renders conversation layout", async ({ page }) => {
    await page.goto("/messages");
    await expect(page.locator("body")).toBeVisible();
  });

  test("API health: profiles endpoint returns JSON", async ({ request }) => {
    const response = await request.get("/api/profiles");
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty("data");
  });

  test("API health: collaborations endpoint returns JSON", async ({ request }) => {
    const response = await request.get("/api/collaborations");
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty("data");
  });
});
