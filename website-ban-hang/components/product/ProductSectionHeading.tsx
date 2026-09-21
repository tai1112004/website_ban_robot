"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { ReactNode } from "react";
export default function Heading({
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
    <div className="pdp-heading" data-pdp-reveal>
      <p className="eyebrow">
        {index} / {t(label)}
      </p>
      <h2>{children}</h2>
    </div>
  );
}
