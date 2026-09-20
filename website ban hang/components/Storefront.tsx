"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { startSmoothScroll } from "@/lib/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import IntroTrailer from "./IntroTrailer";
import Navbar from "./Navbar";
import Hero from "./Hero";
import RobotStory from "./RobotStory";
import Technology from "./Technology";
import ProductDesign from "./ProductDesign";
import Personality from "./Personality";
import WhyRobo from "./WhyRobo";
import CoreAI from "./CoreAI";
import ExpressiveRobot from "./ExpressiveRobot";
import KnowledgePacks from "./KnowledgePacks";
import Models from "./Models";
import CTA from "./CTA";
import Footer from "./Footer";
import CustomCursor from "./ui/CustomCursor";
import { Modal } from "./ui/Modal";

const infoCopy: Record<string, string> = {
  About:
    "Robo AI explores a more personal relationship with technology: a small, expressive companion designed around everyday connection.",
  Research:
    "Explore how voice, memory, personality and knowledge come together in the Core AI and Technology sections. More research stories will be shared here in the future.",
  Help: "Use Features to discover Robo’s AI, Technology to explore its components, and Models to compare Basic, Plus and Custom. WATCH FILM replays the introduction.",
  FAQ: "Pricing and availability have not been announced. Basic, Plus and Custom are previews; their product detail pages are planned for a later phase. Knowledge Packs introduce how Robo can adapt to different purposes.",
  Contact:
    "Contact details will be published when the store launches. No messages are collected by this demo.",
  Privacy:
    "This website stores your cart and demo orders in this browser. Demo orders include the contact and shipping details you submit. The Memory section describes a product concept; this website does not record conversations. No real order or payment is sent.",
  Terms:
    "This website introduces the Robo AI concept and model previews. Pricing, availability and final specifications have not been announced. No purchase contract is created and no payment is collected.",
};
export default function Storefront() {
  const { t, localeTag } = useLanguage();
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [localeTag]);
  const [phase, setPhase] = useState<"loading" | "intro" | "home">("loading");
  const [info, setInfo] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    setPhase(matchMedia("(prefers-reduced-motion: reduce)").matches ? "home" : "intro");
  }, []);
  const locked = phase !== "home" || info !== null || menu;
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (locked) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
  useEffect(() => {
    if (locked || reduced) return;
    return startSmoothScroll();
  }, [locked, reduced]);
  useEffect(() => {
    if (phase !== "home") return;
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(
        ".hero-image",
        { scale: 1.06 },
        { scale: 1, duration: 1.8, ease: "power3.out" },
      );
      gsap.from("[data-hero]", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(".navbar", { y: -20, opacity: 0, duration: 0.8 });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        }),
      );
      gsap.fromTo(
        ".cta > img",
        { scale: 1.04 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: ".cta",
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        },
      );
    }, root);
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(frame);
      ctx.revert();
    };
  }, [phase, reduced]);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  const watchFilm = () => {
    setMenu(false);
    setPhase("intro");
  };
  return (
    <div ref={root}>
      <div
        className={`site ${phase === "home" ? "site-ready" : ""}`}
        inert={phase !== "home"}
        aria-hidden={phase !== "home"}
      >
        <a href="#main" className="skip-link">
          {t("Skip to content")} </a>
        <Navbar watchFilm={watchFilm} menu={menu} setMenu={setMenu} />
        <main id="main" inert={menu}>
          <Hero watchFilm={watchFilm} />
          <WhyRobo />
          <CoreAI />
          <RobotStory />
          <Technology />
          <ExpressiveRobot />
          <Personality />
          <KnowledgePacks />
          <ProductDesign />
          <Models />
          <CTA />
        </main>
        <div inert={menu}>
          <Footer info={setInfo} />
        </div>
      </div>
      {phase === "loading" && (
        <div className="initial-loading" role="status">
          {t("ROBO AI")}<span>{t("YOUR INTELLIGENT COMPANION")}</span>
        </div>
      )}
      {phase === "intro" && <IntroTrailer onClose={() => setPhase("home")} />}
      {info && (
        <Modal title={t(info)} onClose={() => setInfo(null)}>
          <p className="info-copy">
            {t(infoCopy[info] ??
              `The official Robo AI ${info} channel has not been connected to this demo yet.`)}
          </p>
        </Modal>
      )}
      <CustomCursor />
    </div>
  );
}
