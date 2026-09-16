"use client";
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
  const [mood, setMood] = useState<number | null>(null);
  return (
    <section id="experience" className="pdp-section pdp-personality">
      <Heading index="03" label="A PERSONALITY OF ITS OWN">
        MORE THAN A VOICE.
        <br />
        <span className="accent">A LITTLE CHARACTER.</span>
      </Heading>
      <div className="pdp-expression-stage">
        {mood === null ? (
          <ViewportVideo
            src={product.media.expressions}
            poster={moods[0].image}
            label="personality video"
            suspended={suspended}
          />
        ) : (
          <Image
            key={mood}
            src={moods[mood].image}
            alt={`Robo looking ${moods[mood].name.toLowerCase()}`}
            fill
            sizes="(max-width:767px) 90vw, 70vw"
          />
        )}
      </div>
      <div className="pdp-mood-tabs" aria-label="Robo expressions">
        {moods.map((item, i) => (
          <button
            key={item.name}
            aria-pressed={mood === i}
            onClick={() => setMood(i)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="pdp-mood-caption" aria-live="polite">
        {mood === null
          ? "Expression brings every conversation to life."
          : moods[mood].description}
      </p>
      <button
        className="pdp-text-button"
        onClick={() => setMood(null)}
        disabled={mood === null}
      >
        WATCH EXPRESSIONS <ArrowUpRight size={16} />
      </button>
    </section>
  );
}
