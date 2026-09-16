"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { designFeatures, type ProductModel } from "@/data/products";
import Heading from "./ProductSectionHeading";
export default function ProductDesign({ product }: { product: ProductModel }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(".pdp-design-angle", {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 55%",
          end: "bottom 70%",
          scrub: 1,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <section
      ref={root}
      id="design"
      className="pdp-section pdp-split pdp-design"
    >
      <div className="pdp-design-images">
        <Image
          src={product.media.gallery[0].src}
          alt="Robo front design"
          fill
          sizes="(max-width:767px) 90vw, 45vw"
        />
        <Image
          className="pdp-design-angle"
          src={product.media.gallery[1].src}
          alt="Robo angled design"
          fill
          sizes="(max-width:767px) 90vw, 45vw"
        />
      </div>
      <div>
        <Heading index="07" label="DESIGNED TO BE HERE">
          SMALL FORM.
          <br />
          <span className="accent">REAL PRESENCE.</span>
        </Heading>
        <div className="pdp-design-points">
          {designFeatures.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
