"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AudioLines, Fingerprint, Brain, LockKeyhole } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const phases = [
  {
    label: "VOICE",
    title: "REAL-TIME VOICE",
    lines: ["Talk.", "Robo listens.", "Robo responds."],
    note: "A conversation that feels like a connection.",
    Icon: AudioLines,
  },
  {
    label: "PERSONALITY",
    title: "A PERSONALITY OF ITS OWN.",
    lines: ["Friendly. Focused.", "Curious. Custom."],
    note: "The same Robo. A character that feels like yours.",
    Icon: Fingerprint,
  },
  {
    label: "MEMORY",
    title: "IT REMEMBERS YOU.",
    lines: ["Your name.", "Your preferences.", "The way you like to interact."],
    note: "Only what you allow it to remember.",
    Icon: Brain,
  },
];

export default function CoreAI() {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(
        ".core-phase",
        root.current,
      );
      let previousPhase = -1;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
        onUpdate: function () {
          const nextPhase = Math.min(2, Math.floor(this.progress() * 3));
          // Only update React when the narrative changes chapter, never each frame.
          if (nextPhase !== previousPhase) {
            previousPhase = nextPhase;
            setActive(nextPhase);
          }
        },
      });
      panels.forEach((panel, index) => {
        if (index > 0)
          timeline.fromTo(
            panel,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.06 },
            index / 3,
          );
        if (index < 2)
          timeline.to(
            panel,
            { autoAlpha: 0, y: -18, duration: 0.06 },
            (index + 1) / 3 - 0.06,
          );
      });
      timeline.to({}, { duration: 1 / 3 - 0.06 }, 2 / 3 + 0.06);
      gsap.to(".core-portrait", {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  function goToPhase(index: number) {
    const section = root.current;
    if (!section) return;
    const start = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: start + ((index + 0.4) / 3) * (section.offsetHeight - innerHeight),
      behavior: "instant",
    });
  }

  return (
    <section
      id="core-ai"
      ref={root}
      className={`core-ai ${reduced ? "core-static" : ""}`}
      aria-label={t("Voice, personality and memory")}
    >
      <div className="core-sticky">
        <div className="core-top">
          <p className="eyebrow">
            <span>02 /</span>  {t("A CONNECTION, NOT A COMMAND")} </p>
          <span className="micro">{t("VOICE. CHARACTER. CONTINUITY.")}</span>
        </div>
        <div className="core-layout">
          <div className="core-panels">
            {phases.map(({ title, lines, note, Icon }, index) => (
              <div
                key={title}
                className="core-phase"
                aria-hidden={!reduced && active !== index}
              >
                <Icon size={30} strokeWidth={1.2} className="core-icon" />
                <h2>{t(title)}</h2>
                <p className="core-lines">
                  {lines.map((line) => (
                    <span key={line}>{t(line)}</span>
                  ))}
                </p>
                <p className="core-note">
                  {index === 2 && <LockKeyhole size={13} />}
                  {t(note)}
                </p>
              </div>
            ))}
          </div>
          <div
            className={`core-visual core-visual-${active}`}
            aria-hidden="true"
          >
            <div className="core-halo" />
            <Image
              src="/images/robot_phongtrang.png"
              alt=""
              fill
              sizes="(max-width: 767px) 70vw, 45vw"
              className="core-portrait"
            />
            <div className="core-visual-caption">
              <span className="status-dot" />
              <span>
                {
                  t(["HERE TO LISTEN", "UNIQUELY YOURS", "FAMILIAR, BY CHOICE"][
                    active
                  ])
                }
              </span>
            </div>
          </div>
        </div>
        {!reduced && (
          <div
            className="core-navigation"
            role="group"
            aria-label={t("AI story chapters")}
          >
            {phases.map(({ label }, index) => (
              <button
                key={label}
                onClick={() => goToPhase(index)}
                aria-pressed={active === index}
              >
                <span>0{index + 1}</span>
                {t(label)}
                <span className="chapter-line" />
              </button>
            ))}
          </div>
        )}
      </div>
      <span id="memory" className="memory-anchor" aria-hidden="true" />
    </section>
  );
}
