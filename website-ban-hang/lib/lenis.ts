import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
export function startSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    anchors: { offset: -80 },
  });
  const tick = (time: number) => lenis.raf(time * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
