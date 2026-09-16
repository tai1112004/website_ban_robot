import { test, expect } from "@playwright/test";
test("capture desktop and mobile compositions with clean console", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await page.getByRole('button', {name:'SKIP INTRO'}).click();
  await expect(page.locator(".site-ready")).toBeVisible();
  await page.waitForTimeout(2200);
  await page.screenshot({ path: "test-results/desktop-hero.png" });
  // Capture the whole composition with every reveal visible; motion is tested separately.
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const id of [
    "features",
    "technology",
    "expression",
    "experience",
    "knowledge",
    "design",
    "models",
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await page
      .locator(`#${id}`)
      .screenshot({ path: `test-results/desktop-${id}.png`, style: '.navbar, .skip-link { visibility: hidden !important; }' });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/mobile-hero.png" });
  for (const id of ["features", "knowledge", "models"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page
      .locator(`#${id}`)
      .screenshot({ path: `test-results/mobile-${id}.png`, style: '.navbar, .skip-link { visibility: hidden !important; }' });
  }
  expect(errors).toEqual([]);
});
