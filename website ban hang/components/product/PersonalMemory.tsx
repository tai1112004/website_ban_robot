"use client";
import TranslatedHeading from "@/components/ui/TranslatedHeading";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import Heading from "./ProductSectionHeading";
export default function PersonalMemory() {
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState(true);
  return (
    <section id="memory" className="pdp-section pdp-memory">
      <div className="pdp-heading-row">
        <Heading index="04" label={t("PERSONAL MEMORY")}>
          <TranslatedHeading message="A LITTLE MORE<br><accent>YOU.</accent>" />
        </Heading>
        <div>
          <p className="pdp-copy">
            {t("You're always in control of what Robo remembers.")} </p>
          <button
            className="pdp-switch"
            role="switch"
            aria-label={t("Memory demo")}
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
          >
            <span className="pdp-switch-track">
              <i />
            </span>
            {t("MEMORY")} {t(enabled ? "ON" : "OFF")}
          </button>
          <p className="pdp-fine">{t("Interactive demo. Nothing is saved.")}</p>
        </div>
      </div>
      <div className={`pdp-memory-cards ${enabled ? "" : "is-off"}`}>
        {[
          {
            title: "01 / PROFILE",
            values: ["Name", "Nickname", "Preferred language"],
          },
          {
            title: "02 / PREFERENCES",
            values: ["Voice", "Response style", "Volume"],
          },
          {
            title: "03 / CONVERSATION",
            values: [
              "Selected context",
              "What matters to you",
              "Only what you allow",
            ],
          },
        ].map((card) => (
          <article key={card.title}>
            <h3>{t(card.title)}</h3>
            {card.values.map((value) => (
              <p key={value}>
                <span>{t(value)}</span>
                <span>{t(enabled ? "Your choice" : "Off")}</span>
              </p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
