import { test, expect, type Page } from "@playwright/test";
import { createDemoOrder, initialCheckout } from "../lib/orders";
import { toCartItem } from "../lib/cart";
import { roboBasic } from "../data/products";
function fixture() {
  const older = createDemoOrder(
    {
      ...initialCheckout,
      email: "older@example.com",
      phone: "+84 912 345 678",
      firstName: "Older",
      lastName: "Visitor",
      address: "123 Sample Street",
      city: "Sample City",
      province: "Sample Province",
    },
    [toCartItem(roboBasic)],
  );
  older.createdAt = "2026-09-01T08:00:00.000Z";
  const newer = createDemoOrder(
    {
      ...initialCheckout,
      email: "newer@example.com",
      phone: "+84 912 345 678",
      firstName: "Latest",
      lastName: "Visitor",
      address: "456 Sample Street",
      city: "Sample City",
      province: "Sample Province",
    },
    [toCartItem(roboBasic, 2)],
  );
  newer.createdAt = "2026-09-16T08:00:00.000Z";
  newer.status = "PROCESSING";
  return [older, newer];
}
async function seed(page: Page) {
  const orders = fixture();
  await page.addInitScript((orders) => {
    localStorage.setItem("robo-ai-orders", JSON.stringify(orders));
    sessionStorage.removeItem("robo-ai-last-order");
  }, orders);
  return orders;
}
test("account derives profile and recent order from latest date; list sorts and opens persistent detail", async ({
  page,
}) => {
  const orders = await seed(page);
  await page.goto("/account");
  await expect(page.locator(".account-profile")).toContainText(
    "newer@example.com",
  );
  await expect(page.locator(".account-count").first()).toContainText("2");
  await expect(page.locator(".account-recent")).toContainText(orders[1].id);
  await expect(page.locator(".account-overview")).toContainText("0 CONNECTED");
  await page.getByRole("link", { name: "VIEW ORDERS", exact: true }).click();
  await expect(page).toHaveURL("/orders");
  await expect(page.locator(".history-card").first()).toContainText(
    orders[1].id,
  );
  await page.getByLabel("SORT BY").selectOption("oldest");
  await expect(page.locator(".history-card").first()).toContainText(
    orders[0].id,
  );
  await page
    .locator(".history-card")
    .last()
    .getByRole("link", { name: "VIEW ORDER" })
    .click();
  await expect(page).toHaveURL(`/orders/${orders[1].id}`);
  await expect(page.locator(".order-contact")).toContainText("Latest Visitor");
  await expect(
    page.locator(".order-progress [aria-current=step]"),
  ).toContainText("Processing");
  await expect(page.locator(".order-progress .is-reached")).toHaveCount(3);
  await expect(page.locator(".detail-next")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "VIEW PRODUCT" }),
  ).toHaveAttribute("href", "/products/basic");
  await page.reload();
  await expect(page.locator(".order-reference")).toHaveValue(orders[1].id);
});
test("zero orders, unknown id and malformed storage stay usable without creating data", async ({
  page,
}) => {
  await page.goto("/account");
  await expect(page.getByText("No profile information yet.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "NO ORDERS YET." }),
  ).toBeVisible();
  await page.goto("/orders");
  await expect(page.locator(".history-empty")).toBeVisible();
  await page.goto("/orders/fake-id");
  await expect(
    page.getByRole("heading", { name: "ORDER NOT FOUND." }),
  ).toBeVisible();
  await page.evaluate(() => localStorage.setItem("robo-ai-orders", "broken"));
  await page.goto("/orders");
  await expect(page.locator(".history-empty")).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("robo-ai-orders")),
  ).toBe("broken");
});
test("missing customer and image data are handled without losing a valid order", async ({
  page,
}) => {
  const order = fixture()[0];
  await page.addInitScript((order) => {
    const raw: Record<string, unknown> = { ...order, customer: null };
    raw.items = order.items.map((item) => ({ ...item, image: "" }));
    localStorage.setItem("robo-ai-orders", JSON.stringify([raw]));
  }, order);
  await page.goto(`/orders/${order.id}`);
  await expect(page.locator(".order-contact")).toContainText("Not provided");
  await expect(page.locator(".order-product img")).toBeVisible();
  await expect(page.locator(".detail-next")).toBeVisible();
  await page.goto("/account");
  await expect(page.getByText("No profile information yet.")).toBeVisible();
  await expect(page.locator(".account-count").first()).toContainText("1");
});
test("storage access failure presents retry and does not pretend history is empty", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      if (key === "robo-ai-orders") throw new Error("denied");
      return original.call(this, key);
    };
  });
  await page.goto("/orders");
  await expect(
    page.getByRole("heading", { name: "ORDERS UNAVAILABLE." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "TRY AGAIN" })).toBeVisible();
});
test("account routes and shared navbar fit all breakpoints without video or runtime errors", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  const videos: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    if (request.url().includes(".mp4")) videos.push(request.url());
  });
  const orders = await seed(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/account", "/orders", `/orders/${orders[1].id}`]) {
    await page.goto(route);
    await expect(page.locator(".account-loading")).toHaveCount(0);
    for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route} ${width}`,
      ).toBeTruthy();
      await expect(
        page.getByRole("link", { name: "My account", exact: true }),
      ).toBeInViewport();
      if (width === 1440 || width === 390) {
        for (const img of await page.locator("main img").all()) {
          await img.scrollIntoViewIfNeeded();
          await expect
            .poll(() =>
              img.evaluate((node: HTMLImageElement) => node.naturalWidth),
            )
            .toBeGreaterThan(0);
        }
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({
          path: `test-results/account-${route.split("/").pop()}-${width}.png`,
          fullPage: true,
        });
      }
    }
  }
  expect(errors).toEqual([]);
  expect(videos).toEqual([]);
});
