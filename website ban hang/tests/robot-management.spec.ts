import { test, expect, type Page } from "@playwright/test";
const robot = {
  id: "managed-robo",
  deviceId: "RB-MANAGE",
  serialNumber: "SN-DEMO",
  name: "Desk Robo",
  model: "BASIC",
  status: "OFFLINE",
  pairedAt: "2026-09-16T08:00:00.000Z",
};
async function seed(page: Page) {
  await page.addInitScript((robot) => {
    if (!localStorage.getItem("robo-ai-devices"))
      localStorage.setItem(
        "robo-ai-devices",
        JSON.stringify([
          robot,
          {
            ...robot,
            id: "other-robo",
            deviceId: "RB-OTHER",
            name: "Other Robo",
          },
        ]),
      );
  }, robot);
}
test("management tabs persist in URL and personality saves per robot with drafts retained", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/my-robots/managed-robo?tab=personality");
  await expect(
    page.getByRole("tab", { name: "PERSONALITY", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("radio", { name: /CUSTOM/ }).check();
  await page.getByLabel("Humor", { exact: true }).press("End");
  await page.getByRole("tab", { name: "VOICE", exact: true }).click();
  await page.getByRole("tab", { name: "PERSONALITY", exact: true }).click();
  await expect(page.getByLabel("Humor", { exact: true })).toHaveValue("100");
  await page.getByRole("button", { name: "SAVE PERSONALITY" }).click();
  await expect(
    page.getByText("PERSONALITY UPDATED", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Humor", { exact: true })).toHaveValue("100");
  await page.goto("/my-robots/other-robo?tab=personality");
  await expect(page.getByRole("radio", { name: /CHEERFUL/ })).toBeChecked();
});
test("memory permissions save and clear only after confirmation", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/my-robots/managed-robo?tab=memory");
  await expect(
    page.getByRole("switch", { name: "Profile memory", exact: true }),
  ).toBeDisabled();
  await page.getByRole("switch", { name: "Memory enabled" }).check();
  await page
    .getByRole("switch", { name: "Profile memory", exact: true })
    .check();
  await page.getByRole("button", { name: "SAVE MEMORY", exact: true }).click();
  await expect(
    page.getByText("MEMORY SETTINGS SAVED", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("switch", { name: "Profile memory", exact: true }),
  ).toBeChecked();
  await page.getByRole("button", { name: "CLEAR MEMORY", exact: true }).click();
  await page.getByRole("button", { name: "CANCEL", exact: true }).click();
  await expect(
    page.getByRole("switch", { name: "Memory enabled" }),
  ).toBeChecked();
  await page.getByRole("button", { name: "CLEAR MEMORY", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "CLEAR MEMORY", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("switch", { name: "Memory enabled" }),
  ).not.toBeChecked();
  await expect(
    page.getByRole("button", { name: "CLEAR MEMORY", exact: true }),
  ).toBeFocused();
});
test("knowledge, voice and expression settings persist and update the overview", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/my-robots/managed-robo?tab=knowledge");
  await page
    .getByRole("button", { name: "INSTALL HÁT SẮC BÙA", exact: true })
    .click();
  await expect(
    page.getByText("KNOWLEDGE PACK INSTALLED", { exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "VOICE", exact: true }).click();
  await page.getByLabel("Voice Profile").selectOption("WARM");
  await page
    .getByRole("combobox", { name: "Language", exact: true })
    .selectOption("EN");
  await page.getByLabel("Volume", { exact: true }).press("End");
  await page.getByRole("button", { name: "SAVE VOICE", exact: true }).click();
  await expect(
    page.getByText("VOICE SETTINGS UPDATED", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "PREVIEW VOICE" }),
  ).toBeDisabled();
  await page.getByRole("tab", { name: "FACE & DISPLAY", exact: true }).click();
  await page.getByRole("radio", { name: "HAPPY", exact: true }).check();
  await expect(
    page.getByRole("img", { name: "HAPPY expression preview" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "APPLY EXPRESSION" }).click();
  await expect(
    page.getByText("EXPRESSION APPLIED", { exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "OVERVIEW", exact: true }).click();
  await expect(page.locator(".management-summary")).toContainText("1 PACKS");
  await expect(page.locator(".management-summary")).toContainText("WARM");
  await expect(page.locator(".management-summary")).toContainText("HAPPY");
  await page.reload();
  await expect(page.locator(".management-summary")).toContainText("HAPPY");
  await page
    .getByRole("button", { name: "Manage knowledge", exact: true })
    .click();
  await page
    .getByRole("button", { name: "REMOVE HÁT SẮC BÙA", exact: true })
    .click();
  await expect(
    page.getByText("KNOWLEDGE PACK REMOVED", { exact: true }),
  ).toBeVisible();
});
test("rename refreshes device cards and unpair returns to list without touching orders", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/my-robots/managed-robo?tab=device");
  await page.getByRole("button", { name: "RENAME ROBO", exact: true }).click();
  await page.getByRole("dialog").getByLabel("Robot Name").fill("Study Buddy");
  await page.getByRole("button", { name: "SAVE NAME", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Study Buddy",
  );
  await page.goto("/my-robots");
  await expect(page.locator(".robot-card").first()).toContainText(
    "Study Buddy",
  );
  await page.goto("/my-robots/managed-robo?tab=device");
  await page.evaluate(() =>
    localStorage.setItem("robo-ai-orders", "preserve-this-order-history"),
  );
  await page.getByRole("button", { name: "UNPAIR ROBO", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "UNPAIR", exact: true })
    .click();
  await expect(page).toHaveURL("/my-robots");
  await expect(page.locator(".robot-card")).toHaveCount(1);
  expect(
    await page.evaluate(() => localStorage.getItem("robo-ai-orders")),
  ).toBe("preserve-this-order-history");
});
test("motion requires both capability and online status; commands never claim movement", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/my-robots/managed-robo?tab=actions");
  await expect(page.locator(".action-command:disabled")).toHaveCount(6);
  await expect(
    page.getByText("ROBO IS OFFLINE.", { exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    const devices = JSON.parse(localStorage.getItem("robo-ai-devices")!);
    devices[0].capabilities = ["MOTION"];
    devices[0].status = "ONLINE";
    localStorage.setItem("robo-ai-devices", JSON.stringify(devices));
  });
  await page.reload();
  await page
    .getByRole("button", { name: "WAVE SEND COMMAND", exact: true })
    .click();
  await expect(
    page.getByText("SENDING COMMAND...", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "COMMAND SENT · DEMO ONLY. No physical movement has been confirmed.",
      { exact: true },
    ),
  ).toBeVisible();
});
test("failed saves preserve drafts and malformed configuration is not overwritten", async ({
  page,
}) => {
  await seed(page);
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith("robo-ai-config:")) throw new Error("denied");
      return original.call(this, key, value);
    };
  });
  await page.goto("/my-robots/managed-robo?tab=voice");
  await page.getByLabel("Voice Profile").selectOption("ENERGETIC");
  await page.getByRole("button", { name: "SAVE VOICE", exact: true }).click();
  await expect(
    page.locator(".management-content").getByRole("alert"),
  ).toContainText("changes are still in the form");
  await expect(page.getByLabel("Voice Profile")).toHaveValue("ENERGETIC");
  await expect(
    page.getByRole("button", { name: "SAVE VOICE", exact: true }),
  ).toBeEnabled();
});
test("invalid config and missing robot have honest recoverable states", async ({
  page,
}) => {
  await seed(page);
  await page.addInitScript(() =>
    localStorage.setItem("robo-ai-config:managed-robo", "broken"),
  );
  await page.goto("/my-robots/managed-robo");
  await expect(
    page.getByRole("heading", { name: "SETTINGS UNAVAILABLE." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "TRY AGAIN" })).toBeVisible();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("robo-ai-config:managed-robo"),
    ),
  ).toBe("broken");
  await page.goto("/my-robots/missing");
  await expect(
    page.getByRole("heading", { name: "ROBO NOT FOUND." }),
  ).toBeVisible();
});
test("all management tabs fit the required breakpoints and support keyboard navigation", async ({
  page,
}) => {
  test.setTimeout(120000);
  await seed(page);
  const errors: string[] = [];
  const media: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error")
      errors.push(`${message.text()} ${message.location().url}`);
  });
  page.on("request", (request) => {
    if (/\.(mp4|mp3|wav)(\?|$)/.test(request.url())) media.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/my-robots/managed-robo");
  await expect(
    page.getByRole("heading", { name: "MEET YOUR ROBO." }),
  ).toBeVisible();
  const labels = [
    "OVERVIEW",
    "PERSONALITY",
    "MEMORY",
    "KNOWLEDGE",
    "VOICE",
    "FACE & DISPLAY",
    "ACTIONS",
    "DEVICE",
  ];
  for (const label of labels) {
    await page.getByRole("tab", { name: label, exact: true }).click();
    await expect(
      page.getByRole("tabpanel", { name: label, exact: true }),
    ).toBeVisible();
    for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${label} ${width}`,
      ).toBeTruthy();
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: `test-results/management-${label.replaceAll(" ", "-")}-${width}.png`,
          fullPage: true,
        });
    }
  }
  await page.getByRole("tab", { name: "DEVICE", exact: true }).focus();
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("tab", { name: "OVERVIEW", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("tab", { name: "OVERVIEW", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "PERSONALITY", exact: true }),
  ).toBeFocused();
  expect(errors).toEqual([]);
  expect(media).toEqual([]);
});
