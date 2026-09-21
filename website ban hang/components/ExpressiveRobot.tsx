"use client";
import TranslatedHeading from "@/components/ui/TranslatedHeading";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { AudioLines, Ear, Lightbulb, Smile, MoveUpRight } from "lucide-react";
import { SectionTitle } from "./ui/SectionTitle";

const states = [
  {
    Icon: Ear,
    name: "LISTENING",
    copy: "A face that lets you know you have its attention.",
  },
  {
    Icon: Lightbulb,
    name: "THINKING",
    copy: "A little curiosity you can see.",
  },
  {
    Icon: AudioLines,
    name: "SPEAKING",
    copy: "Expression that brings a conversation to life.",
  },
  { Icon: Smile, name: "HAPPY", copy: "A small reaction. A shared moment." },
];
export default function ExpressiveRobot() {
  const { t } = useLanguage();
  return (
    <section id="expression" className="expressive section-space">
      <div className="expressive-layout">
        <div className="expressive-portrait" data-reveal>
          <div className="expression-glow" />
          <Image
            src="/images/bieucam_vuive.png?v=20260921-1623"
            alt={t("Robo with a happy expressive face and its hand raised in greeting")}
            fill
            sizes="(max-width: 767px) 90vw, 45vw"
          />
          <span className="micro">{t("A FACE. A VOICE. A PHYSICAL PRESENCE.")}</span>
        </div>
        <div className="expressive-copy">
          <SectionTitle index="05" label={t("EXPRESSION YOU CAN FEEL")}>
            <TranslatedHeading message="IT DOESN’T<br>JUST TALK.<br><accent>IT REACTS.</accent>" />
          </SectionTitle>
          <p className="section-description" data-reveal>
            {t("From a thoughtful look to a friendly wave.")} <br />{t("A little personality, made physical.")} </p>
          <div className="expression-states">
            {states.map(({ Icon, name, copy }) => (
              <div key={name} data-reveal>
                <Icon size={19} strokeWidth={1.3} />
                <div>
                  <h3>{t(name)}</h3>
                  <p>{t(copy)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="physical-actions" data-reveal>
        <div>
          <MoveUpRight size={22} />
          <span>{t("PHYSICAL ACTION")}</span>
        </div>
        <p>{t("Wave.")}</p>
        <p>{t("Nod.")}</p>
        <p>{t("Turn.")}</p>
        <a href="#models">{t("EXPLORE ROBO PLUS ↗")}</a>
      </div>
    </section>
  );
}
