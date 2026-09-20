export const locales = ["en", "vi", "ja", "ko", "zh-CN"] as const;
export type Locale = (typeof locales)[number];
export const languageNames: Record<Locale, string> = {
  en: "English", vi: "Tiếng Việt", ja: "日本語", ko: "한국어", "zh-CN": "简体中文",
};
export const localeTags: Record<Locale, string> = {
  en: "en-US", vi: "vi-VN", ja: "ja-JP", ko: "ko-KR", "zh-CN": "zh-CN",
};
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}
