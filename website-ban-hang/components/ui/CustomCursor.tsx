import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export default function CustomCursor() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouchDevice();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (touch || reduced) return;
    const cursor = ref.current;
    if (!cursor) return;
    const move = (e: PointerEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      cursor.style.opacity = "1";
      const target = e.target as HTMLElement;
      const view = target.closest("[data-cursor]");
      cursor.dataset.active = target.closest("a,button,input")
        ? "link"
        : view
          ? "view"
          : "";
      cursor.textContent =
        view && !target.closest("a,button,input") ? t("VIEW") : "";
    };
    const leave = () => {
      cursor.style.opacity = "0";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [touch, reduced, t]);
  return touch || reduced ? null : (
    <div ref={ref} className="custom-cursor" aria-hidden="true" />
  );
}
