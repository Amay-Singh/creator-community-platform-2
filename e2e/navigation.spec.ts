import { test, expect } from "@playwright/test";

test.describe("Navigation & Page Loads", () => {
  test("landing page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Colab/);
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  });

  test("dashboard page loads", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("explore page loads", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.locator("body")).toBeVisible();
  });

  test("messages page loads", async ({ page }) => {
    await page.goto("/messages");
    await expect(page.locator("body")).toBeVisible();
  });

  test("collaborations page loads", async ({ page }) => {
    await page.goto("/collaborations");
    await expect(page.locator("body")).toBeVisible();
  });

  test("ai-studio page loads", async ({ page }) => {
    await page.goto("/ai-studio");
    await expect(page.locator("body")).toBeVisible();
  });

  test("settings page loads", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("body")).toBeVisible();
  });

  test("help page loads", async ({ page }) => {
    await page.goto("/help");
    await expect(page.locator("body")).toBeVisible();
  });

  test("404 page renders for unknown routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByText("Page not found")).toBeVisible();
  });

  test("skip to content link exists", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByText("Skip to main content");
    await expect(skipLink).toBeAttached();
  });
});
