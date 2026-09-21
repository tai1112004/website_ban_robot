"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ScanFace, AudioLines, MoveUpRight, Blocks } from "lucide-react";
import { SectionTitle } from "./ui/SectionTitle";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
const features = [
  {
    title: "EXPRESSIVE DISPLAY",
    text: "A face for every interaction.",
    Icon: ScanFace,
  },
  {
    title: "VOICE INTERACTION",
    text: "Natural conversation.",
    Icon: AudioLines,
  },
  {
    title: "PHYSICAL ACTION",
    text: "Personality expressed through movement.",
    Icon: MoveUpRight,
  },
  {
    title: "MODULAR DESIGN",
    text: "Different possibilities, brought together.",
    Icon: Blocks,
  },
];
export default function ProductDesign() {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 45%",
            end: "bottom 65%",
            scrub: 0.6,
          },
        })
        .to(".design-front", { opacity: 0, scale: 1.03, duration: 1 }, 0)
        .fromTo(
          ".design-angle",
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 1 },
          0,
        );
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <section ref={root} id="design" className="product-design section-space">
      <div className="design-copy">
        <SectionTitle index="08" label={t("FORM MEETS FEELING")}>
          {t("DESIGNED TO")} <br />
          <span className="accent">{t("STAND OUT.")}</span>
        </SectionTitle>
        <p className="section-description" data-reveal>
          {t("Compact by design.")} <br />
          {t("Full of personality.")} </p>
        <div className="design-features">
          {features.map(({ title, text, Icon }) => (
            <div key={title} data-reveal>
              <Icon size={22} strokeWidth={1.4} />
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="design-render" data-cursor="VIEW">
        <span className="render-label micro">{t("ROBO AI / INDUSTRIAL DESIGN")}</span>
        <Image
          src="/images/product_render_chinh_dien.png?v=20260921-1635"
          alt={t("Robo AI, front view")}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="design-front"
        />
        <Image
          src="/images/product_render_goc_nghieng.png?v=20260921-1635"
          alt={t("Robo AI, three-quarter view")}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="design-angle"
        />
        <span className="render-bottom micro">
          {t("EVERY ANGLE. A LITTLE CHARACTER.")} </span>
      </div>
    </section>
  );
}
