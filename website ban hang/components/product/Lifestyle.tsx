"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ProductModel } from "@/data/products";
export default function Lifestyle({ product }: { product: ProductModel }) {
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
        alt="Robo on a desk beside a laptop and books"
        fill
        sizes="100vw"
      />
      <div>
        <p className="eyebrow">A PLACE IN YOUR EVERYDAY</p>
        <h2>
          AI THAT
          <br />
          LIVES WITH YOU.
        </h2>
        <p>WORK / LEARN / TALK / CREATE</p>
      </div>
    </section>
  );
}
