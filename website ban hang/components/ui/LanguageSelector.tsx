"use client";
import { Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { isLocale, languageNames, locales } from "@/i18n/locales";
export default function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage();
  return (
    <label className="language-selector">
      <Languages size={16} aria-hidden="true" />
      <span className="sr-only">{t("Website language")}</span>
      <span className="language-code" aria-hidden="true">{{ en: "EN", vi: "VI", ja: "日本", ko: "한국", "zh-CN": "中文" }[locale]}⌄</span>
      <select data-language-selector value={locale} onChange={(event) => {
        if (isLocale(event.target.value)) setLocale(event.target.value);
      }}>
        {locales.map((code) => <option key={code} value={code} lang={code}>{languageNames[code]}</option>)}
      </select>
    </label>
  );
}
