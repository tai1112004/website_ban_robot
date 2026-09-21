import { test, expect, type Page } from "@playwright/test";
import type { RobotDevice } from "../types/robot";
const device: RobotDevice = {
  id: "demo-robo",
  deviceId: "RB-A8F2K91",
  serialNumber: "SN-DEMO",
  name: "My Robo",
  model: "BASIC",
  status: "OFFLINE",
  pairedAt: "2026-09-16T08:00:00.000Z",
};
async function enter(page: Page, id = "RB-A8F2K91") {
  await page.getByLabel("DEVICE ID *", { exact: true }).fill(id);
  await page.getByLabel("ACTIVATION CODE *", { exact: true }).fill("DEMO-CODE");
  await page.getByRole("button", { name: "CONNECT ROBO", exact: true }).click();
}
test("account entry, validation, pairing, persistence, duplicate prevention and unpair preserve orders", async ({
  page,
}) => {
  await page.goto("/account");
  await page.getByRole("link", { name: "VIEW MY ROBOTS", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "NO ROBOS CONNECTED YET." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "PAIR YOUR ROBO" }).click();
  await page.getByRole("button", { name: "CONNECT ROBO", exact: true }).click();
  await expect(page.getByLabel("DEVICE ID *", { exact: true })).toBeFocused();
  await expect(page.getByLabel("DEVICE ID *", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await enter(page, " rb-a8f2k91 ");
  await expect(
    page.getByRole("button", { name: "CONNECTING..." }),
  ).toBeDisabled();
  await expect(
    page.getByRole("heading", { name: "ROBO CONNECTED." }),
  ).toBeFocused();
  await expect(page).toHaveURL("/my-robots/pair");
  const stored = await page.evaluate(() =>
    localStorage.getItem("robo-ai-devices"),
  );
  expect(stored).not.toContain("DEMO-CODE");
  expect(JSON.parse(stored!)).toHaveLength(1);
  await page.getByRole("link", { name: "MANAGE ROBO" }).click();
  await expect(
    page.getByRole("heading", { name: "MEET YOUR ROBO." }),
  ).toBeVisible();
  await expect(page.locator(".management-header .robot-status")).toHaveText(
    "UNKNOWN",
  );
  await page.reload();
  await expect(page.locator(".robot-facts")).toContainText("RB-A8F2K91");
  await page.goto("/account");
  await expect(page.locator(".account-overview")).toContainText("1 CONNECTED");
  await page.goto("/my-robots/pair");
  await enter(page, "rb-a8f2k91");
  await expect(page.locator(".pair-form").getByRole("alert")).toContainText(
    "THIS ROBO IS ALREADY CONNECTED.",
  );
  await page.goto("/my-robots");
  await expect(page.locator(".robot-card")).toHaveCount(1);
  await page.evaluate(() => localStorage.setItem("robo-ai-orders", "[]"));
  await page.getByRole("button", { name: "UNPAIR ROBO" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "UNPAIR ROBO" })).toBeFocused();
  await page.getByRole("button", { name: "UNPAIR ROBO" }).click();
  await page.getByRole("button", { name: "CANCEL", exact: true }).click();
  await expect(page.locator(".robot-card")).toHaveCount(1);
  await page.getByRole("button", { name: "UNPAIR ROBO" }).click();
  await page.getByRole("button", { name: "UNPAIR", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "NO ROBOS CONNECTED YET." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "YOUR ROBOS." }),
  ).toBeFocused();
  expect(
    await page.evaluate(() => localStorage.getItem("robo-ai-orders")),
  ).toBe("[]");
  await page.reload();
  await expect(page.locator(".robot-card")).toHaveCount(0);
});
test("corrupt device data is recoverable and never silently overwritten", async ({
  page,
}) => {
  await page.goto("/my-robots");
  await page.evaluate(() => localStorage.setItem("robo-ai-devices", "broken"));
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "WE COULDN'T LOAD YOUR ROBOS." }),
  ).toBeVisible();
  await page.goto("/my-robots/pair");
  await enter(page);
  await expect(page.locator(".pair-form").getByRole("alert")).toContainText(
    "existing data has not been changed",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("robo-ai-devices")),
  ).toBe("broken");
  await page.goto("/my-robots");
  await expect(
    page.getByRole("heading", { name: "WE COULDN'T LOAD YOUR ROBOS." }),
  ).toBeVisible();
  await page.evaluate(() => localStorage.setItem("robo-ai-devices", "[]"));
  await page.getByRole("button", { name: "TRY AGAIN" }).click();
  await expect(page.locator(".robot-empty")).toBeVisible();
  await page.goto("/my-robots/not-found");
  await expect(
    page.getByRole("heading", { name: "ROBO NOT FOUND." }),
  ).toBeVisible();
});
test("failed write keeps pairing on form and failed unpair preserves device", async ({
  page,
}) => {
  await page.addInitScript((device) => {
    localStorage.setItem("robo-ai-devices", JSON.stringify([device]));
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "robo-ai-devices") throw new Error("quota");
      return set.call(this, key, value);
    };
  }, device);
  await page.goto("/my-robots/pair");
  await enter(page, "RB-NEW123");
  await expect(page.locator(".pair-form").getByRole("alert")).toContainText(
    "Unable to save your Robo",
  );
  await expect(
    page.getByRole("button", { name: "CONNECT ROBO", exact: true }),
  ).toBeEnabled();
  await page.goto("/my-robots");
  await page.getByRole("button", { name: "UNPAIR ROBO" }).click();
  await page.getByRole("button", { name: "UNPAIR", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "Unable to unpair",
  );
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("robo-ai-devices")!).length,
    ),
  ).toBe(1);
});
test("cross-tab changes refresh the Account robot count", async ({
  page,
  context,
}) => {
  await page.goto("/account");
  await expect(page.locator(".account-overview")).toContainText("0 CONNECTED");
  const other = await context.newPage();
  await other.goto("/my-robots/pair");
  await enter(other);
  await expect(
    other.getByRole("heading", { name: "ROBO CONNECTED." }),
  ).toBeVisible();
  await expect(page.locator(".account-overview")).toContainText("1 CONNECTED");
  await other.close();
});
test("robot pages fit desktop, tablet and mobile without console errors or video", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  const videos: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (e) => {
    if (e.type() === "error") errors.push(e.text());
  });
  page.on("request", (r) => {
    if (r.url().includes(".mp4")) videos.push(r.url());
  });
  await page.addInitScript(
    (device) =>
      localStorage.setItem(
        "robo-ai-devices",
        JSON.stringify([
          device,
          {
            ...device,
            id: "second",
            deviceId: "RB-SECOND",
            status: "ONLINE",
            name: "Studio Robo",
          },
          {
            ...device,
            id: "third",
            deviceId: "RB-THIRD",
            status: "PAIRING",
            name: "Office Robo",
          },
        ]),
      ),
    device,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "/my-robots",
    "/my-robots/pair",
    "/my-robots/demo-robo",
  ]) {
    await page.goto(route);
    await expect(page.locator(".robot-skeleton")).toHaveCount(0);
    for (const width of [1440, 1024, 768, 430, 390, 375]) {
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
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: `test-results/robots-${route.split("/").pop()}-${width}.png`,
          fullPage: true,
        });
    }
  }
  expect(errors).toEqual([]);
  expect(videos).toEqual([]);
});
