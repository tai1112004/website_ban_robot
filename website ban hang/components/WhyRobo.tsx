"use client";
import TranslatedHeading from "@/components/ui/TranslatedHeading";
import { useLanguage } from "@/context/LanguageContext";
import { AudioLines, Fingerprint, Brain, BookOpen } from "lucide-react";
import { SectionTitle } from "./ui/SectionTitle";

const values = [
  {
    Icon: AudioLines,
    title: "VOICE AI",
    text: "Talk naturally in real time.",
    href: "#core-ai",
  },
  {
    Icon: Fingerprint,
    title: "PERSONALITY",
    text: "Choose how Robo speaks and behaves.",
    href: "#experience",
  },
  {
    Icon: Brain,
    title: "MEMORY",
    text: "Robo remembers the things you allow it to remember.",
    href: "#memory",
  },
  {
    Icon: BookOpen,
    title: "KNOWLEDGE",
    text: "Give Robo the knowledge that matters to you.",
    href: "#knowledge",
  },
];

export default function WhyRobo() {
  const { t } = useLanguage();
  return (
    <section id="features" className="why-robo section-space">
      <div className="section-heading">
        <SectionTitle index="01" label={t("WHY ROBO AI?")}>
          <TranslatedHeading message="INTELLIGENCE<br>THAT FEELS <accent>PERSONAL.</accent>" />
        </SectionTitle>
        <p data-reveal>
          {t("AI is more meaningful when it feels like a connection. Meet a companion with a voice, a character and a place in your everyday life.")} </p>
      </div>
      <div className="value-columns">
        {values.map(({ Icon, title, text, href }, index) => (
          <a href={href} key={title} className="value-item" data-reveal>
            <div className="value-top">
              <Icon size={29} strokeWidth={1.3} />
              <span>0{index + 1}</span>
            </div>
            <h3>{t(title)}</h3>
            <p>{t(text)}</p>
            <span className="value-link" aria-hidden="true">
              {t("DISCOVER")} <span>↗</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
