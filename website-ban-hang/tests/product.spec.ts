import { test, expect } from "@playwright/test";

test("Basic product route renders a priced-later hero and all gallery views", async ({
  page,
}) => {
  const response = await page.goto("/products/basic");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "ROBO BASIC",
  );
  await expect(page.locator("#product")).toContainText("PRICE TO BE ANNOUNCED");
  for (const label of ["FRONT", "ANGLE", "SIDE", "REAR", "DETAIL"]) {
    await page
      .getByRole("button", { name: `View ${label.toLowerCase()}` })
      .click();
    await expect(
      page.getByRole("button", { name: `View ${label.toLowerCase()}` }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".pdp-gallery-image.is-active")).toHaveJSProperty(
      "complete",
      true,
    );
  }
  await expect(page.locator('#product a[href="/products/plus"]')).toHaveCount(
    1,
  );
  await expect(page.locator('#product a[href="/products/custom"]')).toHaveCount(
    1,
  );
});

test("pre-order demo validates input and sends no submission request", async ({
  page,
}) => {
  await page.goto("/products/basic");
  await page
    .getByRole("button", { name: "PRE-ORDER INTEREST", exact: true })
    .click();
  const modal = page.getByRole("dialog", {
    name: "Meet your future companion",
  });
  await expect(modal).toBeVisible();
  await modal.getByRole("button", { name: "SUBMIT INTEREST" }).click();
  await expect(modal).toBeVisible();
  await modal.getByLabel("Name", { exact: true }).fill("Demo Visitor");
  await modal.getByLabel("Email", { exact: true }).fill("invalid");
  await modal.getByRole("button", { name: "SUBMIT INTEREST" }).click();
  await expect(modal).toBeVisible();
  await modal.getByLabel("Email", { exact: true }).fill("demo@example.com");
  await modal.getByLabel("Country", { exact: true }).fill("Vietnam");
  await expect(modal.getByLabel("Interested Model")).toHaveValue("basic");
  let requests = 0;
  page.on("request", (request) => {
    if (request.method() === "POST") requests++;
  });
  await modal.getByRole("button", { name: "SUBMIT INTEREST" }).click();
  await expect(modal).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText(
    "Thanks. We'll keep you updated.",
  );
  await expect(page.getByRole("status")).toContainText("Demo only");
  expect(requests).toBe(0);
});

test("memory demo, moods, FAQ and model comparison explain Basic accurately", async ({
  page,
}) => {
  await page.goto("/products/basic");
  const toggle = page.getByRole("switch", { name: "Memory demo" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await page
    .locator("#experience")
    .getByRole("button", { name: "HAPPY", exact: true })
    .click();
  await expect(page.locator(".pdp-mood-caption")).toContainText(
    "A little more personality",
  );
  await expect(page.locator("#models table")).toContainText("Limited");
  await expect(page.locator("#models table")).toContainText("Optional");
  await page
    .getByText("IS THE FINAL PRICE AVAILABLE?", { exact: true })
    .click();
  await expect(page.locator("details[open]")).toContainText(
    "currently in development",
  );
});

test("sticky interest bar appears after hero and hides at the final CTA", async ({
  page,
}) => {
  await page.goto("/products/basic");
  await expect(page.locator(".pdp-purchase-bar")).toHaveCount(0);
  await page.locator("#features").scrollIntoViewIfNeeded();
  await expect(page.locator(".pdp-purchase-bar")).toBeVisible();
  await page.locator("#final-cta").scrollIntoViewIfNeeded();
  await expect(page.locator(".pdp-purchase-bar")).toHaveCount(0);
});

test("product videos load near viewport, pause offscreen and honor manual pause", async ({
  page,
}) => {
  await page.goto("/products/basic");
  const turntable = page.getByLabel("360 degree product video", {
    exact: true,
  });
  const expressions = page.getByLabel("personality video", { exact: true });
  await expect(expressions).not.toHaveAttribute("src", /mp4/);
  await turntable.scrollIntoViewIfNeeded();
  await expect(turntable).toHaveJSProperty("paused", false);
  await page
    .getByRole("button", { name: "Pause 360 degree product video" })
    .click();
  await expect(turntable).toHaveJSProperty("paused", true);
  await page
    .getByRole("button", { name: "Play 360 degree product video" })
    .click();
  await expect(turntable).toHaveJSProperty("paused", false);
  await expressions.scrollIntoViewIfNeeded();
  await expect(expressions).toHaveJSProperty("paused", false);
  await expect(turntable).toHaveJSProperty("paused", true);
  await page
    .locator(".pdp-purchase-bar")
    .getByRole("button", { name: "JOIN THE LIST" })
    .click();
  await expect(expressions).toHaveJSProperty("paused", true);
  await page.keyboard.press("Escape");
  await expect(expressions).toHaveJSProperty("paused", false);
});

test("reduced motion waits for explicit playback and unavailable video has a fallback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/products/basic");
  const turntable = page.getByLabel("360 degree product video", {
    exact: true,
  });
  await turntable.scrollIntoViewIfNeeded();
  await expect(turntable).toHaveJSProperty("paused", true);
  await page
    .getByRole("button", { name: "Play 360 degree product video" })
    .click();
  await expect(turntable).toHaveJSProperty("paused", false);
  await page.route("**/video_bieucam.mp4", (route) => route.abort());
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await expect(page.locator("#experience .pdp-video-fallback")).toBeVisible();
});

test("gallery supports keyboard and touch swipes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/products/basic");
  const gallery = page.locator(".pdp-gallery-stage");
  await gallery.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("button", { name: "View angle", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await gallery.dispatchEvent("pointerdown", {
    pointerType: "touch",
    clientX: 280,
    clientY: 300,
  });
  await gallery.dispatchEvent("pointerup", {
    pointerType: "touch",
    clientX: 100,
    clientY: 303,
  });
  await expect(
    page.getByRole("button", { name: "View side", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("product responsive layouts have no page overflow, missing media or runtime errors", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && /\/(images|videos)\//.test(response.url()))
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/products/basic");
  for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    for (const selector of [
      "#product",
      "#experience",
      "#technology",
      "#models",
      "#final-cta",
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${width}px at ${selector}`,
      ).toBeTruthy();
    }
    if ([1440, 390].includes(width)) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `test-results/product-${width}.png`,
        fullPage: true,
        animations: "disabled",
      });
    }
  }
  for (const image of await page.locator("#product-main img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((node) => (node as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});
