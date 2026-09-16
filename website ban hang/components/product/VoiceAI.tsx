"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductModel } from "@/data/products";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Heading from "./ProductSectionHeading";
export default function VoiceAI({ product }: { product: ProductModel }) {
  const root = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pdp-wave i",
        { scaleY: 0.3 },
        {
          scaleY: 1,
          stagger: { each: 0.05, from: "center" },
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "bottom 30%",
            scrub: 0.4,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: "top 75%",
      end: "bottom 30%",
      onUpdate: (self) => setPhase(Math.min(2, Math.floor(self.progress * 3))),
    });
    return () => trigger.kill();
  }, []);
  return (
    <section ref={root} className="pdp-section pdp-split pdp-voice">
      <div>
        <Heading index="02" label="REALTIME VOICE AI">
          TALK NATURALLY.
          <br />
          <span className="accent">ROBO LISTENS.</span>
        </Heading>
        <p className="pdp-copy">
          A conversation that feels at home in your world. Ask a question,
          explore an idea, or simply say hello.
        </p>
        <div className="pdp-voice-state">
          <div className="pdp-wave" aria-hidden="true">
            {Array.from({ length: 21 }, (_, i) => (
              <i key={i} style={{ height: `${12 + ((i * 17) % 39)}px` }} />
            ))}
          </div>
          <div className="pdp-phase-list">
            {["LISTENING", "THINKING", "SPEAKING"].map((name, i) => (
              <span key={name} className={phase === i ? "is-active" : ""}>
                {name}
              </span>
            ))}
          </div>
          <p className="pdp-fine">A preview of the conversation experience.</p>
        </div>
      </div>
      <div className="pdp-portrait" data-pdp-reveal>
        <Image
          src={product.media.closeup}
          alt="A close look at Robo's face"
          fill
          sizes="(max-width: 767px) 90vw, 45vw"
        />
      </div>
    </section>
  );
}
