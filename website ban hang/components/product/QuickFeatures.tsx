"use client";
import { Mic, Smile, Brain, BookOpen } from "lucide-react";
import { quickFeatures } from "@/data/products";
export default function QuickFeatures() {
  const icons = [Mic, Smile, Brain, BookOpen];
  return (
    <section id="features" className="pdp-quick">
      {quickFeatures.map((item, i) => {
        const Icon = icons[i];
        return (
          <article key={item.title} data-pdp-reveal>
            <Icon size={26} strokeWidth={1.2} />
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        );
      })}
    </section>
  );
}
