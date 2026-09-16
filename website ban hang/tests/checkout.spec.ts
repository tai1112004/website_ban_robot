import { test, expect, type Page } from "@playwright/test";
async function seed(page: Page) {
  await page.goto("/products/basic");
  await page.getByRole("button", { name: "ADD TO CART", exact: true }).click();
  await page.getByRole("link", { name: "VIEW CART", exact: true }).click();
  await page.getByRole("link", { name: "PROCEED TO CHECKOUT" }).click();
}
async function fill(page: Page) {
  for (const [name, value] of Object.entries({
    email: "demo@example.com",
    phone: "+84 912 345 678",
    firstName: "Demo",
    lastName: "Visitor",
    address: "123 Sample Street",
    city: "Sample City",
    province: "Sample Province",
  }))
    await page.locator(`#checkout-${name}`).fill(value);
  await page.getByRole("checkbox").check();
}

test("full shopping flow creates one local demo order, clears cart and survives success reload", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await seed(page);
  await expect(page).toHaveURL("/checkout");
  await expect(page.locator("#checkout-country")).toHaveValue("Vietnam");
  await fill(page);
  let posts = 0;
  page.on("request", (request) => {
    if (request.method() === "POST") posts++;
  });
  await page
    .getByRole("button", { name: "PLACE ORDER", exact: true })
    .dblclick();
  await expect(page).toHaveURL("/order-success");
  await expect(
    page.getByRole("heading", { name: "ORDER RECEIVED." }),
  ).toBeVisible();
  const state = await page.evaluate(() => ({
    orders: JSON.parse(localStorage.getItem("robo-ai-orders") ?? "[]"),
    cart: JSON.parse(localStorage.getItem("robo-ai-cart") ?? "[]"),
    last: sessionStorage.getItem("robo-ai-last-order"),
  }));
  expect(state.orders).toHaveLength(1);
  expect(state.orders[0].id).toMatch(/^ROBO-\d{8}-[A-Z0-9]{4}$/);
  expect(state.orders[0].total).toBeNull();
  expect(state.orders[0].items[0].quantity).toBe(1);
  expect(state.last).toBe(state.orders[0].id);
  expect(state.cart).toEqual([]);
  expect(posts).toBe(0);
  await page.reload();
  await expect(page.locator(".order-reference")).toHaveValue(
    state.orders[0].id,
  );
  await seed(page);
  await fill(page);
  await page.getByRole("button", { name: "PLACE ORDER", exact: true }).click();
  await expect(page).toHaveURL("/order-success");
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("robo-ai-orders") ?? "[]").length,
    ),
  ).toBe(2);
  expect(errors).toEqual([]);
});

test("inline validation identifies first error and empty cart cannot submit", async ({
  page,
}) => {
  await page.goto("/checkout");
  await expect(
    page.getByRole("heading", { name: "NOTHING TO CHECK OUT." }),
  ).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
  await seed(page);
  await expect(page.locator(".checkout-field-error")).toHaveCount(0);
  await page.getByRole("button", { name: "PLACE ORDER", exact: true }).click();
  await expect(page.locator("#checkout-email")).toBeFocused();
  await expect(page.locator("#error-email")).toHaveText(
    "Please enter your email.",
  );
  await fill(page);
  await page.locator("#checkout-email").fill("invalid");
  await page.locator("#checkout-phone").fill("abc123");
  await page.locator("#checkout-address").fill("   ");
  await page.getByRole("checkbox").uncheck();
  await page.getByRole("button", { name: "PLACE ORDER", exact: true }).click();
  await expect(page.locator("#error-email")).toContainText("valid email");
  await expect(page.locator("#error-phone")).toContainText("valid phone");
  await expect(page.locator("#error-address")).toContainText(
    "shipping address",
  );
  await expect(page.locator("#error-confirmed")).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("robo-ai-orders")),
  ).toBeNull();
});

test("failed storage preserves cart and retry saves exactly once; corrupt history recovers", async ({
  page,
}) => {
  await seed(page);
  await fill(page);
  await page.evaluate(() => {
    localStorage.setItem("robo-ai-orders", "broken");
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "robo-ai-orders") throw new Error("Quota");
      return original.call(this, key, value);
    };
    (window as unknown as { restore: () => void }).restore = () => {
      Storage.prototype.setItem = original;
    };
  });
  await page.getByRole("button", { name: "PLACE ORDER", exact: true }).click();
  await expect(page.locator(".checkout-submit-error")).toContainText(
    "Your cart has not been changed",
  );
  await expect(page.locator(".nav-cart-badge")).toHaveText("1");
  expect(
    await page.evaluate(() => sessionStorage.getItem("robo-ai-last-order")),
  ).toBeNull();
  await page.evaluate(() =>
    (window as unknown as { restore: () => void }).restore(),
  );
  await page.getByRole("button", { name: "PLACE ORDER", exact: true }).click();
  await expect(page).toHaveURL("/order-success");
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("robo-ai-orders") ?? "[]").length,
    ),
  ).toBe(1);
});

test("responsive checkout has no overflow, hydration errors or video and mobile summary expands", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const videos: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) videos.push(request.url());
  });
  await page.addInitScript(() =>
    localStorage.setItem(
      "robo-ai-cart",
      JSON.stringify([{ id: "basic", quantity: 2 }]),
    ),
  );
  await page.goto("/checkout");
  await expect(page.locator("form")).toBeVisible();
  for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `${width}px`,
    ).toBeTruthy();
    if (width === 1440) {
      await page.locator(".checkout-product img").evaluate(async (node) => {
        await (node as HTMLImageElement).decode();
      });
      await page.screenshot({
        path: "test-results/checkout-desktop.png",
        fullPage: true,
      });
    }
  }
  await expect(page.locator(".checkout-summary-details")).toBeHidden();
  await page.getByRole("button", { name: "SHOW DETAILS" }).click();
  await expect(page.locator(".checkout-summary-details")).toBeVisible();
  await page.screenshot({
    path: "test-results/checkout-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
  expect(videos).toEqual([]);
});

test("blocked session handoff cannot save an order or clear the cart", async ({
  page,
}) => {
  await seed(page);
  await fill(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "robo-ai-last-order") throw new Error("Session unavailable");
      return original.call(this, key, value);
    };
  });
  await page.getByRole("button", { name: "PLACE ORDER", exact: true }).click();
  await expect(page.locator(".checkout-submit-error")).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("robo-ai-orders")),
  ).toBeNull();
  await expect(page.locator(".nav-cart-badge")).toHaveText("1");
});
