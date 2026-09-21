"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { SectionTitle } from "./ui/SectionTitle";
const models = [
  {
    name: "BASIC",
    number: "01",
    tagline: "For everyday AI companionship.",
    features: [
      "Voice AI",
      "Personality",
      "Memory",
      "Knowledge Packs",
      "Expressive Display",
    ],
    button: "EXPLORE BASIC",
    href: "/products/basic",
    note: "YOUR EVERYDAY COMPANION",
  },
  {
    name: "PLUS",
    number: "02",
    tagline: "More movement. More interaction.",
    features: [
      "Everything in Basic",
      "Physical Actions",
      "Servo Motion",
      "Sensors",
      "Enhanced Interaction",
    ],
    button: "EXPLORE PLUS",
    href: "/products/plus",
    note: "A LITTLE MORE EXPRESSION",
  },
  {
    name: "CUSTOM",
    number: "03",
    tagline: "Made for your idea.",
    features: [
      "Custom Shell",
      "Custom Personality",
      "Custom Knowledge",
      "Branding",
      "Integration Options",
    ],
    button: "TALK TO US",
    href: "/products/custom",
    note: "YOUR IDEA. YOUR ROBO.",
  },
];
export default function Models() {
  const { t } = useLanguage();
  return (
    <section id="models" className="models section-space">
      <div className="section-heading">
        <SectionTitle index="09" label={t("THREE WAYS TO MAKE IT YOURS")}>
          {t("CHOOSE")} <br />
          <span className="accent">{t("YOUR ROBO.")}</span>
        </SectionTitle>
        <div className="models-heading-note">
          <p>
            {t("Different possibilities.")} <br />
            {t("The same personal connection.")} </p>
          <span>{t("PRICING TO BE ANNOUNCED")}</span>
        </div>
      </div>
      <div className="models-introduction">
        <div className="models-portrait">
          <Image
            src="/images/robot_phongtrang.png"
            alt={t("The signature orange and white Robo design")}
            fill
            sizes="(max-width: 767px) 80vw, 35vw"
          />
        </div>
        <p data-reveal>
          {t("YOUR VOICE.")} <br />
          {t("YOUR WORLD.")} <br />
          <span>{t("YOUR COMPANION.")}</span>
        </p>
        <span className="micro">{t("MEET THE ROBO FAMILY")}</span>
      </div>
      <div className="model-columns">
        {models.map((model) => (
          <article
            key={model.name}
            className={`model-preview model-${model.name.toLowerCase()}`}
            data-reveal
          >
            <div className="model-kicker">
              <span>{model.number} /</span>
              <span>{t("COMING SOON")}</span>
            </div>
            <h3>{t("ROBO")} {model.name}</h3>
            <p className="model-tagline">{t(model.tagline)}</p>
            <ul>
              {model.features.map((feature) => (
                <li key={feature}>
                  <Check size={14} strokeWidth={1.5} />
                  {t(feature)}
                </li>
              ))}
            </ul>
            <a className="model-cta" href={model.href}>
              {t(model.button)}
              <ArrowUpRight size={18} />
            </a>
            <span className="model-note">{t(model.note)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
