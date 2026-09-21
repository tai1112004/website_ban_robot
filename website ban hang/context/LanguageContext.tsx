"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { isLocale, localeTags, type Locale } from "@/i18n/locales";
import { translate } from "@/i18n/messages";

const STORAGE_KEY = "robo-ai-language";
type LanguageValue = {
  locale: Locale;
  localeTag: string;
  setLocale: (locale: Locale) => void;
  t: (message: string | null | undefined, values?: Record<string, string | number>) => string;
};
const LanguageContext = createContext<LanguageValue | null>(null);
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLocale(saved)) updateLocale(saved);
    } catch { /* Language selection still works without storage. */ }
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null)
        updateLocale(isLocale(event.newValue) ? event.newValue : "en");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  const setLocale = useCallback((next: Locale) => {
    if (!isLocale(next)) return;
    updateLocale(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* In-memory fallback. */ }
  }, []);
  const t = useCallback((message: string | null | undefined, values?: Record<string, string | number>) =>
    translate(locale, message, values), [locale]);
  const value = useMemo(() => ({ locale, localeTag: localeTags[locale], setLocale, t }), [locale, setLocale, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage requires LanguageProvider");
  return value;
}
