import { AudioLines, Fingerprint, Brain, BookOpen } from "lucide-react";
import { SectionTitle } from "./ui/SectionTitle";

const values = [
  {
    Icon: AudioLines,
    title: "VOICE AI",
    text: "Talk naturally in real time.",
    href: "#core-ai",
  },
  {
    Icon: Fingerprint,
    title: "PERSONALITY",
    text: "Choose how Robo speaks and behaves.",
    href: "#experience",
  },
  {
    Icon: Brain,
    title: "MEMORY",
    text: "Robo remembers the things you allow it to remember.",
    href: "#memory",
  },
  {
    Icon: BookOpen,
    title: "KNOWLEDGE",
    text: "Give Robo the knowledge that matters to you.",
    href: "#knowledge",
  },
];

export default function WhyRobo() {
  return (
    <section id="features" className="why-robo section-space">
      <div className="section-heading">
        <SectionTitle index="01" label="WHY ROBO AI?">
          INTELLIGENCE
          <br />
          THAT FEELS <span className="accent">PERSONAL.</span>
        </SectionTitle>
        <p data-reveal>
          AI is more meaningful when it feels like a connection. Meet a
          companion with a voice, a character and a place in your everyday life.
        </p>
      </div>
      <div className="value-columns">
        {values.map(({ Icon, title, text, href }, index) => (
          <a href={href} key={title} className="value-item" data-reveal>
            <div className="value-top">
              <Icon size={29} strokeWidth={1.3} />
              <span>0{index + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            <span className="value-link" aria-hidden="true">
              DISCOVER <span>↗</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
