"use client";
import TranslatedHeading from "@/components/ui/TranslatedHeading";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { Button } from "./ui/Button";
export default function CTA() {
  const { t } = useLanguage();
  return (
    <section className="cta" id="companion">
      <Image
        src="/images/CTA.png"
        alt={t("Robo ready to become your new companion")}
        fill
        sizes="100vw"
      />
      <div className="cta-shade" />
      <div className="cta-copy" data-reveal>
        <p className="eyebrow">{t("THE FUTURE FEELS PERSONAL.")}</p>
        <h2>
          <TranslatedHeading message="READY TO MEET<br>YOUR <accent>NEW COMPANION?</accent>" />
        </h2>
        <p>
          {t("A smarter, more personal way")} <br className="desktop-break" />  {t("to interact with AI.")} </p>
        <div className="button-row">
          <Button href="/products/basic">{t("VIEW ROBO BASIC")}</Button>
          <Button href="#models" secondary>
            {t("EXPLORE MODELS")} </Button>
        </div>
      </div>
      <span className="cta-caption micro">
        {t("BUILT WITH INTELLIGENCE. DESIGNED FOR CONNECTION.")} </span>
    </section>
  );
}
