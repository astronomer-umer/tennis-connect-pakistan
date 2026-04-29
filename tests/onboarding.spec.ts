import { test, expect } from "@playwright/test";

test.describe("Onboarding Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("new user should be redirected to onboarding", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/onboarding");
    await expect(page.locator("text=PlayPlan")).toBeVisible();
  });

  test("onboarding welcome screen shows get started button", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.locator("text=Get Started")).toBeVisible();
  });

  test("complete onboarding flow and navigate to discover", async ({ page }) => {
    await page.goto("/onboarding");

    // Step 0: Welcome - click Get Started
    await page.click("text=Get Started");

    // Step 1: Profile - fill in name
    await page.fill('input[type="text"]', "Test Player");

    // Select a city (Lahore should be selected by default)
    await page.click('button:has-text("Lahore")');

    // Click Continue
    await page.click("text=Continue");

    // Step 2: Level - just click Continue (default level is 3.5)
    await page.click("text=Continue");

    // Step 3: Bio - add a bio and complete
    await page.fill("textarea", "Looking for tennis partners!");
    await page.click("text=Explore Now");

    // Should be on discover page
    await page.waitForURL("**/");
    await expect(page.locator("text=Discover")).toBeVisible();
  });

  test("bottom tabs are visible on main pages", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/onboarding");

    // Complete onboarding first
    await page.click("text=Get Started");
    await page.fill('input[type="text"]', "Test");
    await page.click("text=Continue");
    await page.click("text=Continue");
    await page.fill("textarea", "Bio");
    await page.click("text=Explore Now");

    await expect(page.locator("nav >> text=Discover")).toBeVisible();
    await expect(page.locator("nav >> text=Courts")).toBeVisible();
    await expect(page.locator("nav >> text=Matches")).toBeVisible();
    await expect(page.locator("nav >> text=Profile")).toBeVisible();
  });

  test("navigation between tabs works", async ({ page }) => {
    // Go to discover page (after onboarding)
    await page.goto("/");
    await page.waitForURL("**/onboarding");
    await page.click("text=Get Started");
    await page.fill('input[type="text"]', "Test");
    await page.click("text=Continue");
    await page.click("text=Continue");
    await page.fill("textarea", "Test");
    await page.click("text=Explore Now");

    // Click on Courts tab
    await page.click("nav >> text=Courts");
    await expect(page).toHaveURL("**/courts");

    // Click on Matches tab
    await page.click("nav >> text=Matches");
    await expect(page).toHaveURL("**/matches");

    // Click on Profile tab
    await page.click("nav >> text=Profile");
    await expect(page).toHaveURL("**/profile");

    // Click back to Discover
    await page.click("nav >> text=Discover");
    await expect(page).toHaveURL("**/");
  });
});