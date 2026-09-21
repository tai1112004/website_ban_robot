"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { moods, type ProductModel } from "@/data/products";
import ViewportVideo from "./ViewportVideo";
import Heading from "./ProductSectionHeading";
export default function PersonalityShowcase({
  product,
  suspended,
}: {
  product: ProductModel;
  suspended: boolean;
}) {
  const { t } = useLanguage();
  const [mood, setMood] = useState<number | null>(null);
  return (
    <section id="experience" className="pdp-section pdp-personality">
      <Heading index="03" label={t("A PERSONALITY OF ITS OWN")}>
        {t("MORE THAN A VOICE.")} <br />
        <span className="accent">{t("A LITTLE CHARACTER.")}</span>
      </Heading>
      <div className="pdp-expression-stage">
        {mood === null ? (
          <ViewportVideo
            src={product.media.expressions}
            poster={moods[0].image}
            label={t("personality video")}
            suspended={suspended}
          />
        ) : (
          <Image
            key={mood}
            src={moods[mood].image}
            alt={t("Robo looking {value0}", { value0: moods[mood].name.toLowerCase() })}
            fill
            sizes="(max-width:767px) 90vw, 70vw"
          />
        )}
      </div>
      <div className="pdp-mood-tabs" aria-label={t("Robo expressions")}>
        {moods.map((item, i) => (
          <button
            key={item.name}
            aria-pressed={mood === i}
            onClick={() => setMood(i)}
          >
            {t(item.name)}
          </button>
        ))}
      </div>
      <p className="pdp-mood-caption" aria-live="polite">
        {t(mood === null
          ? "Expression brings every conversation to life."
          : moods[mood].description)}
      </p>
      <button
        className="pdp-text-button"
        onClick={() => setMood(null)}
        disabled={mood === null}
      >
        {t("WATCH EXPRESSIONS")} <ArrowUpRight size={16} />
      </button>
    </section>
  );
}
