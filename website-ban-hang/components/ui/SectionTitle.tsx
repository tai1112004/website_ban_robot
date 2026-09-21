"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { ReactNode } from "react";
export function SectionTitle({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <div data-reveal>
      <p className="eyebrow">
        <span>{index} /</span> {t(label)}
      </p>
      <h2>{children}</h2>
    </div>
  );
}
