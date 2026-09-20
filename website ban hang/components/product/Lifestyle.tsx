"use client";
import TranslatedHeading from "@/components/ui/TranslatedHeading";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ProductModel } from "@/data/products";
export default function Lifestyle({ product }: { product: ProductModel }) {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "img",
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <section ref={root} className="pdp-lifestyle">
      <Image
        src={product.media.lifestyle}
        alt={t("Robo on a desk beside a laptop and books")}
        fill
        sizes="100vw"
      />
      <div>
        <p className="eyebrow">{t("A PLACE IN YOUR EVERYDAY")}</p>
        <h2>
          <TranslatedHeading message="AI THAT<br><accent>LIVES WITH YOU.</accent>" /> </h2>
        <p>{t("WORK / LEARN / TALK / CREATE")}</p>
      </div>
    </section>
  );
}
