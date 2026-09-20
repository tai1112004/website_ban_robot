"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { ArrowDown, Play } from "lucide-react";
import { Button } from "./ui/Button";
const HOME_HERO_IMAGE = "/images/hinh2.png?v=20260921-012220";
export default function Hero({ watchFilm }: { watchFilm: () => void }) {
  const { t } = useLanguage();
  return (
    <section id="home" className="hero">
      <Image
        className="hero-image"
        src={HOME_HERO_IMAGE}
        alt={t("Orange and white Robo waving hello on a desk at sunset")}
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="eyebrow" data-hero>
          <span className="status-dot" />  {t("AI COMPANION ROBOT")} </p>
        <h1>
          <span data-hero>{t("SMALL ROBOT.")}</span>
          <span data-hero className="accent">
            {t("BIG")} <br className="desktop-break" />  {t("PERSONALITY.")} </span>
        </h1>
        <p className="hero-description" data-hero>
          {t("More than a robot.")} <br />
          {t("An intelligent companion designed to listen,")} <br className="desktop-break" />  {t("remember, respond and grow with you.")} </p>
        <div className="button-row" data-hero>
          <Button href="/products/basic">{t("VIEW ROBO BASIC")}</Button>
          <button className="film-button" onClick={watchFilm}>
            <span>
              <Play size={14} fill="currentColor" />
            </span>{" "}
            {t("WATCH FILM")} </button>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#features">
          {t("SCROLL TO DISCOVER")} <ArrowDown size={16} />
        </a>
        <span>
          {t("THOUGHTFULLY ENGINEERED.")} <i>{t("PERSONALLY YOURS.")}</i>
        </span>
        <span className="edition">{t("ROBO AI — 2026")}</span>
      </div>
    </section>
  );
}
