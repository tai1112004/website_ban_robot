"use client";
import TranslatedHeading from "@/components/ui/TranslatedHeading";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProductModel } from "@/data/products";
export default function FinalCTA({
  product,
  onInterest,
}: {
  product: ProductModel;
  onInterest: () => void;
}) {
  const { t } = useLanguage();
  return (
    <section id="final-cta" className="pdp-final">
      <Image
        src={product.media.cta}
        alt={t("Robo in a cinematic orange environment")}
        fill
        sizes="100vw"
      />
      <div>
        <p className="eyebrow">{t("THE NEXT CHAPTER STARTS HERE.")}</p>
        <h2>
          <TranslatedHeading message="READY TO MAKE<br>ROBO YOURS?" /> </h2>
        <button className="button button-primary" onClick={onInterest}>
          {t("JOIN THE LIST")} <ArrowUpRight size={17} />
        </button>
        <a className="pdp-text-button" href="#models">
          {t("COMPARE MODELS")} <ArrowUpRight size={17} />
        </a>
      </div>
    </section>
  );
}
