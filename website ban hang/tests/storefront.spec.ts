import { test, expect, type Page } from "@playwright/test";
async function enter(page: Page) {
  await page.goto("/");
  if (!(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches))) {
    await page.getByRole('button', { name: 'SKIP INTRO' }).click();
  }
  await expect(page.locator(".site-ready")).toBeVisible();
}
test("intro reopens on every Home visit and reload, with skip and film replay", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("dialog", { name: "Meet Robo film" }),
  ).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.getByRole("button", { name: "SKIP INTRO" }).click();
  await expect(page.locator(".site-ready")).toBeVisible();
  await page.evaluate(() => localStorage.setItem('robo-intro-seen', 'true'));
  await page.reload();
  await expect(page.locator('.intro')).toBeVisible();
  await page.getByRole('button', { name: 'SKIP INTRO' }).click();
  await expect(page.locator(".site-ready")).toBeVisible();
  await expect(page.locator(".intro")).toHaveCount(0);
  await page.locator(".nav-film").click();
  await expect(page.locator(".intro")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".intro")).toHaveCount(0);
  await page.goto('/products/basic');
  await page.locator('.pdp-breadcrumb').getByRole('link', {name:'Home',exact:true}).click();
  await expect(page.locator('.intro')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.site-ready')).toBeVisible();
  expect(errors).toEqual([]);
});
test("footer information opens with keyboard dismissal and no purchase claims", async ({
  page,
}) => {
  await enter(page);
  await page.getByRole("button", { name: "FAQ", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "FAQ" })).toBeVisible();
  await expect(page.locator("dialog")).toContainText(
    "Pricing and availability have not been announced.",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).toHaveCount(0);
});
test("mood selection and technology hotspots", async ({ page }) => {
  await enter(page);
  await page.getByRole("button", { name: "HAPPY", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "HAPPY", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".mood-description")).toHaveText(
    "A little more joy in every interaction.",
  );
  await page.getByRole("button", { name: "VOICE INPUT", exact: true }).focus();
  await expect(page.locator("#tech-1")).toBeVisible();
});
test("scroll seeks video forward and backward with synchronized copy", async ({
  page,
}) => {
  await enter(page);
  const video = page.locator("#robot video");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState))
    .toBeGreaterThanOrEqual(2);
  for (const progress of [0.1, 0.3, 0.5, 0.7, 0.9, 0.3]) {
    await page.evaluate((p) => {
      const section = document.querySelector("#robot") as HTMLElement;
      window.scrollTo(
        0,
        section.offsetTop + p * (section.offsetHeight - window.innerHeight),
      );
    }, progress);
    await expect
      .poll(async () =>
        video.evaluate((v: HTMLVideoElement) => v.currentTime / v.duration),
      )
      .toBeCloseTo(progress, 1);
    const panel = page.locator(".story-panel").nth(Math.floor(progress * 5));
    await expect(panel).toHaveCSS("opacity", "1");
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
      .toBe(true);
  }
});
test("story eases toward scroll position and settles after forward and reverse jumps", async ({
  page,
}) => {
  await enter(page);
  // Let the initial font/layout refresh finish before measuring scroll motion.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  await expect
    .poll(() =>
      page
        .locator("#robot video")
        .evaluate((v: HTMLVideoElement) => v.readyState),
    )
    .toBeGreaterThanOrEqual(2);
  const progress = () =>
    page
      .locator("#robot")
      .evaluate((el) =>
        Number((el as HTMLElement).style.getPropertyValue("--story-progress")),
      );
  await page.evaluate(() => {
    const section = document.querySelector("#robot") as HTMLElement;
    window.scrollTo(
      0,
      section.offsetTop + 0.1 * (section.offsetHeight - innerHeight),
    );
  });
  await expect.poll(progress).toBeCloseTo(0.1, 2);
  for (const target of [0.7, 0.3]) {
    const samples = await page.evaluate(
      (target) =>
        new Promise<number[]>((resolve) => {
          const section = document.querySelector("#robot") as HTMLElement;
          const values: number[] = [];
          const start = performance.now();
          window.scrollTo(
            0,
            section.offsetTop + target * (section.offsetHeight - innerHeight),
          );
          const sample = () => {
            values.push(
              Number(section.style.getPropertyValue("--story-progress")),
            );
            if (performance.now() - start < 180) requestAnimationFrame(sample);
            else resolve(values);
          };
          requestAnimationFrame(sample);
        }),
      target,
    );
    expect(
      new Set(samples.map((value) => value.toFixed(3))).size,
      JSON.stringify(samples),
    ).toBeGreaterThan(2);
    await expect.poll(progress).toBeCloseTo(target, 2);
    await expect
      .poll(() =>
        page
          .locator("#robot video")
          .evaluate((v: HTMLVideoElement) => v.currentTime / v.duration),
      )
      .toBeCloseTo(target, 2);
    await expect(
      page.locator(".story-panel").nth(Math.floor(target * 5)),
    ).toHaveCSS("opacity", "1");
  }
});

test("responsive layouts have no horizontal overflow and all images load", async ({
  page,
}) => {
  await enter(page);
  for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "PERSONALITY" })
    .click();
  await expect(page.locator(".mobile-nav")).toHaveCount(0);
  for (const id of [
    "technology",
    "design",
    "experience",
    "expression",
    "models",
    "companion",
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page
          .locator(`#${id} img`)
          .evaluateAll((images) =>
            images.every(
              (img) =>
                (img as HTMLImageElement).complete &&
                (img as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
  }
});
test("reduced motion bypasses intro and scroll scrubbing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".site-ready")).toBeVisible();
  await expect(page.locator("#robot")).toHaveClass(/story-static/);
  await expect(page.locator("#robot video")).not.toHaveAttribute("src");
});
test("intro video failure preserves skip and page access", async ({ page }) => {
  await page.route("**/videos/video_trailler.mp4", (route) => route.abort());
  await page.goto("/");
  await expect(
    page.getByText("The film couldn’t load.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "SKIP INTRO" }).click();
  await expect(page.locator(".site-ready")).toBeVisible();
});
