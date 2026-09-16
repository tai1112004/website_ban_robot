import { test, expect } from "@playwright/test";

test("mobile chapter controls and Memory links reach the right AI chapter", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.core-navigation').getByRole('button', { name: /PERSONALITY/ }).click();
  await expect(page.locator('.core-phase[aria-hidden="false"]')).toContainText('A PERSONALITY OF ITS OWN.');
  await page.screenshot({ path: 'test-results/mobile-core-personality.png' });
  await page.locator('footer').getByRole('link', { name: 'Memory', exact: true }).click();
  await expect(page.locator('.core-phase[aria-hidden="false"]')).toContainText('IT REMEMBERS YOU.');
  await expect(page.locator('.core-phase[aria-hidden="false"]')).toHaveCSS('opacity', '1');
  await expect(page.locator('.core-phase[aria-hidden="false"]')).toBeInViewport();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/mobile-core-memory.png' });
});

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole('button', {name:'SKIP INTRO'}).click();
  await expect(page.locator(".site-ready")).toBeVisible();
});

test("Home follows the discovery story and has no purchase UI or price", async ({
  page,
}) => {
  await expect
    .poll(() =>
      page
        .locator("main > section")
        .evaluateAll((sections) => sections.map((section) => section.id)),
    )
    .toEqual([
      "home",
      "features",
      "core-ai",
      "robot",
      "technology",
      "expression",
      "experience",
      "knowledge",
      "design",
      "models",
      "companion",
    ]);
  await expect(page.locator("main")).not.toContainText("$499");
  await expect(
    page.getByRole("button", { name: /cart|checkout|buy now/i }),
  ).toHaveCount(0);
  await expect(page.locator(".desktop-nav")).toContainText("FEATURES");
  await expect(page.locator(".desktop-nav")).toContainText("MODELS");
  for (const model of ["basic", "plus", "custom"]) {
    await expect(
      page.locator(`#models a[href="/products/${model}"]`),
    ).toHaveCount(1);
  }
  await expect(page.locator("#models")).toContainText(
    "PRICING TO BE ANNOUNCED",
  );
});

test("AI narrative progresses through voice, personality and permission-based memory", async ({
  page,
}) => {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  for (const [progress, title] of [
    [0.1, "REAL-TIME VOICE"],
    [0.5, "A PERSONALITY OF ITS OWN."],
    [0.9, "IT REMEMBERS YOU."],
  ] as const) {
    await page.evaluate((progress) => {
      const section = document.querySelector("#core-ai") as HTMLElement;
      window.scrollTo(
        0,
        section.offsetTop + progress * (section.offsetHeight - innerHeight),
      );
    }, progress);
    await expect(
      page.locator('.core-phase[aria-hidden="false"]'),
    ).toContainText(title);
  }
  await expect(page.locator("#core-ai")).toContainText(
    "Only what you allow it to remember.",
  );
});

test("knowledge concepts and six hardware hotspots are available", async ({
  page,
}) => {
  for (const pack of [
    "GENERAL ASSISTANT",
    "EDUCATION",
    "ENGLISH PRACTICE",
    "KIDS",
    "MUSEUM GUIDE",
    "BUSINESS",
    "CUSTOM",
  ]) {
    await expect(page.locator("#knowledge")).toContainText(pack);
  }
  await expect(page.locator("#knowledge")).toContainText("HÁT SẮC BÙA");
  await expect(page.locator("#knowledge")).toContainText(
    "FIRST KNOWLEDGE PACK",
  );
  await expect(page.locator("#technology .hotspot")).toHaveCount(6);
  await page.getByRole("button", { name: "POWER", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "POWER", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
});

test("all three AI phases stay readable with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#core-ai")).toHaveClass(/core-static/);
  await expect(page.locator('.core-phase[aria-hidden="false"]')).toHaveCount(3);
});
