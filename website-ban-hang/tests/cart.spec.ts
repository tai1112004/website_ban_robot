import { test, expect } from "@playwright/test";

test("add, persist, update and remove Robo through the shopping interface", async ({
  page,
}) => {
  await page.goto("/products/basic");
  await page.getByRole("button", { name: "ADD TO CART", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("ADDED TO CART");
  await expect(page.locator(".nav-cart-badge")).toHaveText("1");
  await page
    .getByRole("button", { name: "CONTINUE SHOPPING", exact: true })
    .click();
  await page.getByRole("button", { name: "ADD TO CART", exact: true }).click();
  await page.getByRole("link", { name: "VIEW CART", exact: true }).click();
  await expect(page).toHaveURL("/cart");
  await expect(page.locator(".cart-quantity output")).toHaveText("2");
  await page.reload();
  await expect(page.locator(".cart-quantity output")).toHaveText("2");
  await page
    .getByRole("button", { name: "Decrease Robo Basic quantity" })
    .click();
  await expect(
    page.getByRole("button", { name: "Decrease Robo Basic quantity" }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Increase Robo Basic quantity" })
    .click();
  await expect(page.locator(".nav-cart-badge")).toHaveText("2");
  await expect(page.locator(".cart-summary")).toContainText("TO BE ANNOUNCED");
  await expect(
    page.getByRole("link", { name: "PROCEED TO CHECKOUT" }),
  ).toHaveAttribute("href", "/checkout");
  await page
    .getByRole("button", { name: "Remove Robo Basic from cart" })
    .click();
  await expect(
    page.getByRole("heading", { name: "YOUR CART IS FEELING A LITTLE EMPTY." }),
  ).toBeVisible();
  await expect(page.locator(".cart-summary")).toHaveCount(0);
  await expect(page.locator(".nav-cart-badge")).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("link", { name: "EXPLORE BASIC", exact: true }),
  ).toBeVisible();
});

test("damaged storage resets safely and blocked storage keeps in-page controls usable", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("robo-ai-cart", "{broken"),
  );
  await page.goto("/cart");
  await expect(page.locator(".cart-empty")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("robo-ai-cart")))
    .toBe("[]");
  await page.addInitScript(() => {
    Storage.prototype.getItem = function () {
      throw new Error("Storage unavailable");
    };
    Storage.prototype.setItem = function () {
      throw new Error("Storage unavailable");
    };
  });
  await page.goto("/products/basic");
  await page.getByRole("button", { name: "ADD TO CART", exact: true }).click();
  await expect(page.locator(".nav-cart-badge")).toHaveText("1");
  await expect(page.locator(".cart-added")).toContainText(
    "storage is unavailable",
  );
});

test("restored cart uses real product data, enforces quantity limit and handles failed image", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "robo-ai-cart",
      JSON.stringify([
        {
          id: "basic",
          quantity: 99,
          price: 499,
          name: "Untrusted name",
          image: "/fake.png",
        },
        { id: "unknown", quantity: 2 },
      ]),
    ),
  );
  await page.route("**/_next/image?*", (route) => route.abort());
  await page.goto("/cart");
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await expect(page.locator(".cart-quantity output")).toHaveText("5");
  await expect(
    page.getByRole("button", { name: "Increase Robo Basic quantity" }),
  ).toBeDisabled();
  await expect(page.locator(".cart-image")).toContainText(
    "Product preview unavailable",
  );
  await expect(page.locator(".cart-item-price")).toHaveText(
    "PRICE TO BE ANNOUNCED",
  );
});

test("cart synchronizes selections between tabs", async ({ page, context }) => {
  await page.goto("/cart");
  await expect(page.locator(".cart-empty")).toBeVisible();
  const product = await context.newPage();
  await product.goto("/products/basic");
  await product
    .getByRole("button", { name: "ADD TO CART", exact: true })
    .click();
  await expect(page.locator(".cart-quantity output")).toHaveText("1");
  await page
    .getByRole("button", { name: "Increase Robo Basic quantity" })
    .click();
  await expect(product.locator(".nav-cart-badge")).toHaveText("2");
  await product.close();
});

test("cart layouts stay within viewport and load no video", async ({
  page,
}) => {
  const errors: string[] = [];
  const videos: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    if (/\.mp4/.test(request.url())) videos.push(request.url());
  });
  await page.addInitScript(() =>
    localStorage.setItem(
      "robo-ai-cart",
      JSON.stringify([{ id: "basic", quantity: 1 }]),
    ),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cart");
  await expect(page.locator(".cart-item")).toBeVisible();
  for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `${width}px`,
    ).toBeTruthy();
    await expect(page.locator(".nav-cart")).toBeVisible();
    if (width === 1440 || width === 390) {
      await page.locator(".cart-image img").evaluate(async (image) => {
        await (image as HTMLImageElement).decode();
      });
      await page.screenshot({
        path: `test-results/cart-${width}.png`,
        fullPage: true,
      });
    }
  }
  await page
    .getByRole("button", { name: "Remove Robo Basic from cart" })
    .click();
  await expect(page.locator(".cart-empty")).toBeVisible();
  await page.screenshot({
    path: "test-results/cart-empty-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
  expect(videos).toEqual([]);
});
