"use client";
import { useEffect, useRef, useState } from "react";
import type { ProductModel } from "@/data/products";
import Navbar from "../Navbar";
import Footer from "../Footer";
import IntroTrailer from "../IntroTrailer";
import { Modal } from "../ui/Modal";
import { startSmoothScroll } from "@/lib/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ProductHero from "./ProductHero";
import InterestModal from "./InterestModal";
import KnowledgePacks from "./KnowledgePacks";
import FinalCTA from "./FinalCTA";
import InsideRobot from "./InsideRobot";
import Lifestyle from "./Lifestyle";
import ModelComparison from "./ModelComparison";
import PersonalityShowcase from "./PersonalityShowcase";
import PersonalMemory from "./PersonalMemory";
import Product360 from "./Product360";
import ProductCTA from "./ProductCTA";
import ProductDesign from "./ProductDesign";
import ProductFAQ from "./ProductFAQ";
import QuickFeatures from "./QuickFeatures";
import StickyPurchaseBar from "./StickyPurchaseBar";
import VoiceAI from "./VoiceAI";

export default function ProductPage({ product }: { product: ProductModel }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [menu, setMenu] = useState(false);
  const [film, setFilm] = useState(false);
  const [interest, setInterest] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [thanks, setThanks] = useState(false);
  const locked = menu || film || interest || info !== null;
  useEffect(() => {
    if (!thanks) return;
    const timer = setTimeout(() => setThanks(false), 6500);
    return () => clearTimeout(timer);
  }, [thanks]);
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (locked) document.body.style.overflow = "hidden";
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", escape);
    };
  }, [locked]);
  useEffect(() => {
    if (!locked && !reduced) return startSmoothScroll();
  }, [locked, reduced]);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-pdp-hero]", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.utils
        .toArray<HTMLElement>("[data-pdp-reveal]")
        .forEach((element) =>
          gsap.from(element, {
            y: 28,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
          }),
        );
    }, root);
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(frame);
      ctx.revert();
    };
  }, [reduced]);
  const openInterest = () => {
    setThanks(false);
    setInterest(true);
  };
  return (
    <div ref={root} className="product-page">
      <div inert={film}>
        <a className="skip-link" href="#product-main">
          Skip to content
        </a>
        <Navbar
          homeHref="/"
          discoverHref="#models"
          discoverLabel="DISCOVER"
          watchFilm={() => setFilm(true)}
          menu={menu}
          setMenu={setMenu}
        />
        <main id="product-main" inert={menu}>
          <ProductHero product={product} onInterest={openInterest} />
          <Product360 product={product} suspended={locked} />
          <QuickFeatures />
          <VoiceAI product={product} />
          <PersonalityShowcase product={product} suspended={locked} />
          <PersonalMemory />
          <KnowledgePacks />
          <InsideRobot product={product} />
          <ProductDesign product={product} />
          <Lifestyle product={product} />
          <ModelComparison product={product} />
          <ProductCTA
            product={product}
            onInterest={openInterest}
            onContact={() => setInfo("Contact")}
          />
          <ProductFAQ />
          <FinalCTA product={product} onInterest={openInterest} />
        </main>
        <div inert={menu}>
          <Footer homeHref="/" overviewHref="#product" info={setInfo} />
        </div>
      </div>
      <StickyPurchaseBar
        product={product}
        onInterest={openInterest}
        hidden={locked}
      />
      {film && <IntroTrailer onClose={() => setFilm(false)} />}
      {interest && (
        <InterestModal
          model={product.id}
          onClose={() => setInterest(false)}
          onSubmit={() => {
            setInterest(false);
            setThanks(true);
          }}
        />
      )}
      {info && (
        <Modal title={info} onClose={() => setInfo(null)}>
          <p className="info-copy">
            {info === "Contact"
              ? "Official contact details will be announced as Robo moves toward release. You can preview the pre-order interest form on this page."
              : info === "Privacy"
                ? "This frontend does not store or transmit interest form entries. Product privacy details will be announced before release."
                : "Robo is currently in development. Explore this page for its planned features and the frequently asked questions. Final specifications and commercial details will be announced as the product moves toward release."}
          </p>
        </Modal>
      )}
      {thanks && (
        <div className="pdp-thanks" role="status">
          <strong>Thanks. We&apos;ll keep you updated.</strong>
          <span>Demo only — no information was sent or saved.</span>
          <button
            aria-label="Dismiss confirmation"
            onClick={() => setThanks(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
