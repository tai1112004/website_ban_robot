"use client";
import { Fragment } from "react";
import { useLanguage } from "@/context/LanguageContext";

// Translators can reorder whole heading phrases, including the emphasized line.
// Only these two markers are supported; translated text is never parsed as HTML.
export default function TranslatedHeading({ message }: { message: string }) {
  const { t } = useLanguage();
  return <>{t(message).split(/(<accent>.*?<\/accent>|<br>)/g).filter(Boolean).map((part, index) =>
    part === "<br>" ? <br key={index} /> : part.startsWith("<accent>")
      ? <span className="accent" key={index}>{part.slice(8, -9)}</span>
      : <Fragment key={index}>{part}</Fragment>,
  )}</>;
}
