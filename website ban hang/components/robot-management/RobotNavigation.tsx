"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";
export const tabs = [
  "overview",
  "personality",
  "memory",
  "knowledge",
  "voice",
  "display",
  "actions",
  "device",
] as const;
export type RobotTab = (typeof tabs)[number];
export const tabNames: Record<RobotTab, string> = {
  overview: "OVERVIEW",
  personality: "PERSONALITY",
  memory: "MEMORY",
  knowledge: "KNOWLEDGE",
  voice: "VOICE",
  display: "FACE & DISPLAY",
  actions: "ACTIONS",
  device: "DEVICE",
};
export default function RobotNavigation({
  active,
  select,
}: {
  active: RobotTab;
  select: (tab: RobotTab) => void;
}) {
  const { t } = useLanguage();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const navigation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = navigation.current;
    if (!element) return;
    const revealActive = () => {
      const button = refs.current[tabs.indexOf(active)];
      if (button && element.scrollWidth > element.clientWidth) {
        const left =
          button.getBoundingClientRect().left -
          element.getBoundingClientRect().left +
          element.scrollLeft;
        element.scrollLeft =
          left - (element.clientWidth - button.clientWidth) / 2;
      }
    };
    revealActive();
    const observer = new ResizeObserver(revealActive);
    observer.observe(element);
    return () => observer.disconnect();
  }, [active]);
  return (
    <div
      className="management-navigation"
      ref={navigation}
      role="tablist"
      aria-label={t("Robot management")}
    >
      {tabs.map((tab, index) => (
        <button
          key={tab}
          ref={(element) => {
            refs.current[index] = element;
          }}
          role="tab"
          id={`robot-tab-${tab}`}
          aria-controls={`robot-panel-${tab}`}
          aria-selected={active === tab}
          tabIndex={active === tab ? 0 : -1}
          onClick={() => select(tab)}
          onKeyDown={(event) => {
            let next: number | undefined;
            if (["ArrowRight", "ArrowDown"].includes(event.key))
              next = (index + 1) % tabs.length;
            if (["ArrowLeft", "ArrowUp"].includes(event.key))
              next = (index - 1 + tabs.length) % tabs.length;
            if (event.key === "Home") next = 0;
            if (event.key === "End") next = tabs.length - 1;
            if (next !== undefined) {
              event.preventDefault();
              select(tabs[next]);
              refs.current[next]?.focus();
              refs.current[next]?.scrollIntoView({
                block: "nearest",
                inline: "nearest",
              });
            }
          }}
        >
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          {t(tabNames[tab])}
        </button>
      ))}
    </div>
  );
}
