import Image from "next/image";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { SectionTitle } from "./ui/SectionTitle";
const features = [
  ["AI CONTROLLER", "Coordinates voice, personality, memory and knowledge."],
  ["VOICE INPUT", "Brings your voice into the conversation."],
  ["AUDIO SYSTEM", "Gives Robo a voice of its own."],
  ["DISPLAY", "Makes listening, thinking and emotion visible."],
  ["MOTION", "Turns interaction into physical expression."],
  ["POWER", "Supports the components that bring Robo to life."],
];
export default function Technology() {
  const [active, setActive] = useState<number | null>(0);
  return (
    <section id="technology" className="technology section-space">
      <div className="section-heading">
        <SectionTitle index="04" label="INSIDE THE ROBOT">
          DESIGNED
          <br />
          FROM THE INSIDE OUT.
        </SectionTitle>
        <p data-reveal>
          Every component works together to give Robo a voice, a face and a
          physical presence.
        </p>
      </div>
      <div className="technology-visual">
        <div className="tech-orbit" aria-hidden="true" />
        <Image
          src="/images/phan_ra_tung_thiet_bi.png"
          alt="Exploded view of Robo’s screen, processor, orange body and motion components"
          width={1122}
          height={1402}
          sizes="(max-width: 768px) 100vw, 65vw"
          className="exploded-image"
        />
        <div className="hotspots">
          {features.map(([title, copy], i) => (
            <div
              className={`hotspot hotspot-${i} ${active === i ? "active" : ""}`}
              key={title}
            >
              <button
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={active === i}
                aria-controls={`tech-${i}`}
              >
                <span className="hotspot-dot">
                  {active === i ? <Minus size={12} /> : <Plus size={12} />}
                </span>
                <span>{title}</span>
                <span className="hotspot-line" />
              </button>
              <p id={`tech-${i}`} hidden={active !== i}>
                {copy}
              </p>
            </div>
          ))}
        </div>
        <span className="tech-caption micro">
          PRECISION IN EVERY DETAIL. PERSONALITY IN EVERY PART.
        </span>
      </div>
    </section>
  );
}
