import Image from "next/image";
import { useState } from "react";
import { SectionTitle } from "./ui/SectionTitle";
const moods = [
  {
    name: "NORMAL",
    image: "bieucam_binhthuong.png",
    text: "Ready for whatever comes next.",
    face: "• •",
  },
  {
    name: "HAPPY",
    image: "bieucam_vuive.png",
    text: "A little more joy in every interaction.",
    face: "^ ^",
  },
  {
    name: "CURIOUS",
    image: "bieucam_khohieu.png",
    text: "Always listening. Always learning.",
    face: "• ?",
  },
  {
    name: "SLEEPY",
    image: "bieucam_chandoi.png",
    text: "Even robots need a moment to recharge.",
    face: "– –",
  },
];
export default function Personality() {
  const [mood, setMood] = useState(0);
  return (
    <section id="experience" className="personality section-space">
      <div className="section-heading">
        <SectionTitle index="06" label="A PERSONALITY OF ITS OWN">
          MORE THAN
          <br />A MACHINE.
        </SectionTitle>
        <p data-reveal>
          One robot.
          <br />
          <span className="accent">Many moods.</span>
        </p>
      </div>
      <div className="mood-visual" data-cursor="VIEW">
        <div className="mood-glow" />
        {moods.map((item, i) => (
          <Image
            key={item.name}
            src={`/images/${item.image}`}
            alt={`Robo looking ${item.name.toLowerCase()}`}
            fill
            sizes="(max-width: 768px) 100vw, 65vw"
            className={i === mood ? "mood-image selected" : "mood-image"}
            aria-hidden={i !== mood}
          />
        ))}
        <span className="mood-side micro">
          A LITTLE MORE
          <br />
          HUMAN.
        </span>
      </div>
      <div
        className="mood-controls"
        role="group"
        aria-label="Choose Robo’s mood"
      >
        {moods.map((item, i) => (
          <button
            key={item.name}
            className={mood === i ? "selected" : ""}
            aria-pressed={mood === i}
            onMouseEnter={() => setMood(i)}
            onClick={() => setMood(i)}
          >
            <span aria-hidden="true">{item.face}</span>
            {item.name}
          </button>
        ))}
      </div>
      <p className="mood-description" aria-live="polite">
        {moods[mood].text}
      </p>
    </section>
  );
}
