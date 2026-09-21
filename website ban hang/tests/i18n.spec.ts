import { test, expect } from "@playwright/test";
import { messages, messageKey, translate } from "../i18n/messages";
import { locales } from "../i18n/locales";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

test("language selection persists across pages and reloads", async ({ page }) => {
  await page.goto("/cart");
  const selector = page.locator("select[data-language-selector]");
  await expect(selector).toBeVisible();
  await expect(selector.locator("option")).toHaveCount(5);
  await selector.selectOption("vi");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.locator("h1")).toContainText("GIỎ HÀNG");
  await page.reload();
  await expect(selector).toHaveValue("vi");
  await page.goto("/account");
  await expect(selector).toHaveValue("vi");
  for (const locale of ["ja", "ko", "zh-CN", "en"]) {
    await selector.selectOption(locale);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
  }
});

test("all message entries have four translations with matching interpolation parameters", () => {
  const parameters = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
  for (const [key, values] of Object.entries(messages)) {
    expect(values, key).toHaveLength(4);
    for (const value of values) {
      expect(value.trim(), key).not.toBe("");
      expect(parameters(value), key).toEqual(parameters(key));
      // Line breaks may vary by language; emphasis must remain balanced.
      expect((value.match(/<\/?accent>/g) ?? []).sort(), key).toEqual((key.match(/<\/?accent>/g) ?? []).sort());
      expect(value.replace(/<accent>.*?<\/accent>|<br>/g, ""), key).not.toMatch(/<[^>]*>/);
    }
  }
  const brands = /^(ROBO(?: AI)?(?: One| — 2026)?\.?|AI|BASIC|PLUS|HÁT|SẮC BÙA|HÁT SẮC BÙA|RB-A8F2K91)$/i;
  const missing: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (file.endsWith(".tsx")) {
        const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
        const visit = (node: ts.Node) => {
          if (ts.isCallExpression(node) && node.expression.getText(source) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
            const key = node.arguments[0].text;
            const normalized = messageKey(key);
            if (!brands.test(key) && !messages[normalized] && !messages[normalized.replace(/[.:]$/, "")]) missing.push(`${file}: ${key}`);
          }
          if (ts.isJsxAttribute(node) && node.name.getText(source) === "message" && node.initializer && ts.isStringLiteral(node.initializer)) {
            const key = node.initializer.text;
            if (!messages[messageKey(key)]) missing.push(`${file}: ${key}`);
          }
          ts.forEachChild(node, visit);
        };
        visit(source);
      }
    }
  }
  walk(path.resolve("components"));
  expect(missing).toEqual([]);
  for (const locale of locales) {
    expect(translate(locale, "Remove {value0} from cart", { value0: "HOME" })).toContain("HOME");
    expect(translate(locale, "Unknown API text")).toBe("Unknown API text");
    expect(translate(locale, "constructor")).toBe("constructor");
    expect(translate(locale, "__proto__")).toBe("__proto__");
  }
});

test("invalid locale and unavailable storage still allow switching", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("robo-ai-language", "<invalid>"));
  await page.goto("/cart");
  const selector = page.locator("[data-language-selector]");
  await expect(selector).toHaveValue("en");
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("Blocked storage"); };
    Storage.prototype.setItem = () => { throw new Error("Blocked storage"); };
  });
  await page.reload();
  await selector.selectOption("ja");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator("h1")).toHaveText("カート。");
});

test("switching language preserves checkout input, cart and visible validation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("robo-ai-cart", JSON.stringify([{ id: "basic", quantity: 2 }])));
  await page.goto("/checkout");
  await page.locator("#checkout-firstName").fill("HOME");
  await page.locator("#checkout-email").fill("not-an-email");
  await page.getByRole("button", { name: "PLACE ORDER", exact: true }).click();
  const selector = page.locator("[data-language-selector]");
  await selector.selectOption("vi");
  await expect(page.locator("#error-email")).toHaveText("Vui lòng nhập địa chỉ email hợp lệ.");
  await expect(page.locator("#checkout-firstName")).toHaveValue("HOME");
  await selector.selectOption("ja");
  await expect(page.locator("#error-email")).toHaveText("有効なメールアドレスを入力してください。");
  await expect(page.locator("#checkout-country")).toHaveValue("Vietnam");
  for (const [key, value] of Object.entries({email:"demo@example.com",phone:"+84 912345678",lastName:"MEMORY",address:"123 Demo",city:"Hanoi",province:"Hanoi"})) {
    await page.locator(`#checkout-${key}`).fill(value);
  }
  await page.getByRole("checkbox").check();
  await selector.selectOption("ko");
  await page.locator(".checkout-submit").click();
  await expect(page).toHaveURL("/order-success");
  await expect(page.locator(".order-contact")).toContainText("HOME MEMORY");
  const snapshot = await page.evaluate(() => localStorage.getItem("robo-ai-orders"));
  for (const locale of ["zh-CN", "vi", "en"]) {
    await selector.selectOption(locale);
    expect(await page.evaluate(() => localStorage.getItem("robo-ai-orders"))).toBe(snapshot);
    await expect(page.locator(".order-contact")).toContainText("HOME MEMORY");
  }
  expect(errors).toEqual([]);
});

test("robot drafts survive locale changes and user names stay unchanged", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("robo-ai-devices", JSON.stringify([{
    id:"locale-robo",deviceId:"RB-LOCALE",serialNumber:"SN-DEMO",name:"HOME",model:"BASIC",status:"OFFLINE",pairedAt:"2026-09-16T08:00:00.000Z",
  }])));
  await page.goto("/my-robots/locale-robo?tab=personality");
  await page.getByRole("radio", { name: /CUSTOM/ }).check();
  await page.locator("#humor").fill("80");
  const selector = page.locator("[data-language-selector]");
  for (const locale of ["vi", "ja", "ko", "zh-CN"]) {
    await selector.selectOption(locale);
    await expect(page.locator("#humor")).toHaveValue("80");
    await expect(page.locator(".management-save button")).toBeEnabled();
    await expect(page.locator("h1")).toHaveText("HOME");
  }
  await page.locator(".management-save button").click();
  await expect(page.locator(".management-feedback")).toContainText("个性已更新");
  await selector.selectOption("vi");
  await expect(page.locator(".management-feedback")).toContainText("ĐÃ CẬP NHẬT TÍNH CÁCH");
  await page.reload();
  await expect(page.locator("#humor")).toHaveValue("80");
});

for (const locale of ["vi", "ja", "ko", "zh-CN"] as const) {
  test(`${locale}: main routes fit mobile and show localized content`, async ({ page }, testInfo) => {
    test.setTimeout(120000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(locale => localStorage.setItem("robo-ai-language", locale), locale);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const route of ["/", "/products/basic", "/cart", "/checkout", "/account", "/orders", "/my-robots", "/my-robots/pair"]) {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("[data-language-selector]")).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), {message:route}).toBe(true);
      if (route === "/products/basic") {
        await expect(page.locator(".pdp-hero")).not.toContainText("Your personal AI companion.");
        await page.screenshot({ path: testInfo.outputPath(`${locale}-product-mobile.png`) });
      }
      if (route === "/") await page.screenshot({ path: testInfo.outputPath(`${locale}-home-mobile.png`) });
    }
    expect(errors).toEqual([]);
  });
}
