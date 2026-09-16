import { test, expect, type Page } from "@playwright/test";
import { createDemoOrder, initialCheckout } from "../lib/orders";
import { toCartItem } from "../lib/cart";
import { roboBasic } from "../data/products";
const fixture = () =>
  createDemoOrder(
    {
      ...initialCheckout,
      email: "demo@example.com",
      phone: "+84 912 345 678",
      firstName: "Demo",
      lastName: "Visitor",
      address: "123 Sample Street",
      city: "Sample City",
      province: "Sample Province",
    },
    [toCartItem(roboBasic, 2)],
  );
async function seed(page: Page) {
  const order = fixture();
  await page.addInitScript((order) => {
    localStorage.setItem("robo-ai-orders", JSON.stringify([order]));
    sessionStorage.setItem("robo-ai-last-order", order.id);
    localStorage.setItem(
      "robo-ai-cart",
      JSON.stringify([{ id: "basic", quantity: 3 }]),
    );
  }, order);
  return order;
}
test("success renders saved snapshot and refreshes without modifying orders or cart", async ({
  page,
}) => {
  const order = await seed(page);
  await page.goto("/order-success");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "ORDER RECEIVED.",
  );
  await expect(page.locator(".order-reference")).toHaveValue(order.id);
  await expect(page.locator(".order-contact")).toContainText(
    order.customer.email,
  );
  await expect(page.locator(".order-delivery")).toContainText(
    "123 Sample Street",
  );
  await expect(page.locator(".order-summary")).toContainText("TO BE ANNOUNCED");
  await expect(page.locator(".order-product")).toContainText("2");
  await expect(
    page.locator(".order-progress [aria-current=step]"),
  ).toContainText("Order received");
  await expect(page.locator(".nav-cart-badge")).toHaveText("3");
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("robo-ai-orders") ?? "[]"),
    ),
  ).toEqual([order]);
  await page.reload();
  await expect(page.locator(".order-reference")).toHaveValue(order.id);
  await expect(
    page.getByRole("link", { name: "VIEW ORDER", exact: true }),
  ).toHaveAttribute("href", `/orders/${order.id}`);
  await expect(
    page.getByRole("link", { name: "CONTINUE EXPLORING" }),
  ).toHaveAttribute("href", "/#models");
});
test("direct access and missing or corrupt history have distinct safe states", async ({
  page,
}) => {
  await page.goto("/order-success");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "NO RECENT ORDER FOUND.",
  );
  await page.evaluate(() => {
    sessionStorage.setItem("robo-ai-last-order", "ROBO-20260916-TEST");
    localStorage.setItem("robo-ai-orders", "broken");
  });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "ORDER NOT FOUND.",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("robo-ai-orders")),
  ).toBe("broken");
  await page.addInitScript(() => {
    Storage.prototype.getItem = function () {
      throw new Error("blocked");
    };
  });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "ORDER STORAGE UNAVAILABLE.",
  );
});
test("copy uses Clipboard API and offers selected-text fallback on failure", async ({
  page,
}) => {
  const order = await seed(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as unknown as { copied: string }).copied = text;
        },
      },
    });
  });
  await page.goto("/order-success");
  await page.getByRole("button", { name: "Copy order number" }).click();
  await expect(page.locator("#order-copy-status")).toHaveText(
    "ORDER NUMBER COPIED",
  );
  expect(
    await page.evaluate(() => (window as unknown as { copied: string }).copied),
  ).toBe(order.id);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("denied");
        },
      },
    });
    document.execCommand = () => false;
  });
  await page.getByRole("button", { name: "Copy order number" }).click();
  await expect(page.locator("#order-copy-status")).toContainText(
    "number is selected",
  );
  await expect(page.locator(".order-reference")).toBeFocused();
  expect(
    await page
      .locator(".order-reference")
      .evaluate(
        (node: HTMLInputElement) => node.selectionEnd! - node.selectionStart!,
      ),
  ).toBe(order.id.length);
});
test("stored status and numeric totals render without inventing progress", async ({
  page,
}) => {
  const order = fixture();
  order.status = "SHIPPED";
  order.items[0].price = 100;
  order.subtotal = 200;
  order.shipping = 20;
  order.total = 220;
  await page.addInitScript((order) => {
    localStorage.setItem("robo-ai-orders", JSON.stringify([order]));
    sessionStorage.setItem("robo-ai-last-order", order.id);
  }, order);
  await page.goto("/order-success");
  await expect(page.locator(".order-status-badge")).toHaveText("Shipped");
  await expect(
    page.locator(".order-progress [aria-current=step]"),
  ).toContainText("Shipped");
  await expect(page.locator(".order-totals")).toContainText("$220.00");
  await expect(page.locator(".order-progress li").last()).toContainText(
    "UPCOMING",
  );
});
test("responsive order page has clean runtime, no video, and image fallback", async ({
  page,
}) => {
  const errors: string[] = [];
  const videos: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    if (request.url().includes(".mp4")) videos.push(request.url());
  });
  await seed(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/order-success");
  await expect(page.locator(".order-product img")).toBeVisible();
  await page
    .locator(".order-product img")
    .evaluate(async (node: HTMLImageElement) => node.decode());
  for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `${width}px`,
    ).toBeTruthy();
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: `test-results/order-success-${width}.png`,
        fullPage: true,
      });
  }
  expect(errors).toEqual([]);
  expect(videos).toEqual([]);
  await page.route("**/_next/image?*", (route) => route.abort());
  await page.reload();
  await expect(page.locator(".order-product-image")).toContainText(
    "Product preview unavailable",
  );
});
