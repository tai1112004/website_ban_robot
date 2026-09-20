import type { Locale } from "./locales";
import catalog from "./catalog.json";

// English source messages are stable, readable keys (gettext-style).
// Order in every row: Vietnamese, Japanese, Korean, Simplified Chinese.
export const messages: Record<string, readonly string[]> = catalog;
export function messageKey(message: string): string {
  return message.replace(/[’‘]/g, "'").replaceAll("…", "...").replace(/\s+/g, " ").trim().toLowerCase();
}
const positions = { vi: 0, ja: 1, ko: 2, "zh-CN": 3 } as const;
export function translate(locale: Locale, message: string | null | undefined, values?: Record<string, string | number>): string {
  if (!message) return "";
  let translated = message;
  if (locale !== "en") {
    const key = messageKey(message);
    const exact = Object.hasOwn(messages, key);
    const fallback = key.replace(/[.:]$/, "");
    const entry = exact ? messages[key] : Object.hasOwn(messages, fallback) ? messages[fallback] : undefined;
    if (entry) {
      translated = entry[positions[locale]];
      if (!exact && /[:.]$/.test(message)) translated += message.slice(-1);
      const letters = message.replace(/\{\w+\}/g, "");
      if (/[A-Z]/.test(letters) && letters === letters.toUpperCase()) {
        // Protect interpolation names while preserving the original heading style.
        translated = translated.split(/(\{\w+\})/).map(part => /^\{/.test(part) ? part : part.toLocaleUpperCase(locale)).join("");
      }
    }
  }
  return values ? translated.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  ) : translated;
}
