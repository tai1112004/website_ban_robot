import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { SectionTitle } from "./ui/SectionTitle";
const models = [
  {
    name: "BASIC",
    number: "01",
    tagline: "For everyday AI companionship.",
    features: [
      "Voice AI",
      "Personality",
      "Memory",
      "Knowledge Packs",
      "Expressive Display",
    ],
    button: "EXPLORE BASIC",
    href: "/products/basic",
    note: "YOUR EVERYDAY COMPANION",
  },
  {
    name: "PLUS",
    number: "02",
    tagline: "More movement. More interaction.",
    features: [
      "Everything in Basic",
      "Physical Actions",
      "Servo Motion",
      "Sensors",
      "Enhanced Interaction",
    ],
    button: "EXPLORE PLUS",
    href: "/products/plus",
    note: "A LITTLE MORE EXPRESSION",
  },
  {
    name: "CUSTOM",
    number: "03",
    tagline: "Made for your idea.",
    features: [
      "Custom Shell",
      "Custom Personality",
      "Custom Knowledge",
      "Branding",
      "Integration Options",
    ],
    button: "TALK TO US",
    href: "/products/custom",
    note: "YOUR IDEA. YOUR ROBO.",
  },
];
export default function Models() {
  return (
    <section id="models" className="models section-space">
      <div className="section-heading">
        <SectionTitle index="09" label="THREE WAYS TO MAKE IT YOURS">
          CHOOSE
          <br />
          <span className="accent">YOUR ROBO.</span>
        </SectionTitle>
        <div className="models-heading-note">
          <p>
            Different possibilities.
            <br />
            The same personal connection.
          </p>
          <span>PRICING TO BE ANNOUNCED</span>
        </div>
      </div>
      <div className="models-introduction">
        <div className="models-portrait">
          <Image
            src="/images/robot_phongtrang.png"
            alt="The signature orange and white Robo design"
            fill
            sizes="(max-width: 767px) 80vw, 35vw"
          />
        </div>
        <p data-reveal>
          YOUR VOICE.
          <br />
          YOUR WORLD.
          <br />
          <span>YOUR COMPANION.</span>
        </p>
        <span className="micro">MEET THE ROBO FAMILY</span>
      </div>
      <div className="model-columns">
        {models.map((model) => (
          <article
            key={model.name}
            className={`model-preview model-${model.name.toLowerCase()}`}
            data-reveal
          >
            <div className="model-kicker">
              <span>{model.number} /</span>
              <span>COMING SOON</span>
            </div>
            <h3>ROBO {model.name}</h3>
            <p className="model-tagline">{model.tagline}</p>
            <ul>
              {model.features.map((feature) => (
                <li key={feature}>
                  <Check size={14} strokeWidth={1.5} />
                  {feature}
                </li>
              ))}
            </ul>
            <a className="model-cta" href={model.href}>
              {model.button}
              <ArrowUpRight size={18} />
            </a>
            <span className="model-note">{model.note}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
