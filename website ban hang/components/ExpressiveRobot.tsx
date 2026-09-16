import Image from "next/image";
import { AudioLines, Ear, Lightbulb, Smile, MoveUpRight } from "lucide-react";
import { SectionTitle } from "./ui/SectionTitle";

const states = [
  {
    Icon: Ear,
    name: "LISTENING",
    copy: "A face that lets you know you have its attention.",
  },
  {
    Icon: Lightbulb,
    name: "THINKING",
    copy: "A little curiosity you can see.",
  },
  {
    Icon: AudioLines,
    name: "SPEAKING",
    copy: "Expression that brings a conversation to life.",
  },
  { Icon: Smile, name: "HAPPY", copy: "A small reaction. A shared moment." },
];
export default function ExpressiveRobot() {
  return (
    <section id="expression" className="expressive section-space">
      <div className="expressive-layout">
        <div className="expressive-portrait" data-reveal>
          <div className="expression-glow" />
          <Image
            src="/images/bieucam_vuive.png"
            alt="Robo with a happy expressive face and its hand raised in greeting"
            fill
            sizes="(max-width: 767px) 90vw, 45vw"
          />
          <span className="micro">A FACE. A VOICE. A PHYSICAL PRESENCE.</span>
        </div>
        <div className="expressive-copy">
          <SectionTitle index="05" label="EXPRESSION YOU CAN FEEL">
            IT DOESN’T
            <br />
            JUST TALK.
            <br />
            <span className="accent">IT REACTS.</span>
          </SectionTitle>
          <p className="section-description" data-reveal>
            From a thoughtful look to a friendly wave.
            <br />A little personality, made physical.
          </p>
          <div className="expression-states">
            {states.map(({ Icon, name, copy }) => (
              <div key={name} data-reveal>
                <Icon size={19} strokeWidth={1.3} />
                <div>
                  <h3>{name}</h3>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="physical-actions" data-reveal>
        <div>
          <MoveUpRight size={22} />
          <span>PHYSICAL ACTION</span>
        </div>
        <p>Wave.</p>
        <p>Nod.</p>
        <p>Turn.</p>
        <a href="#models">EXPLORE ROBO PLUS ↗</a>
      </div>
    </section>
  );
}
