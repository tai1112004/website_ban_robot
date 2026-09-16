import Image from "next/image";
import { Button } from "./ui/Button";
export default function CTA() {
  return (
    <section className="cta" id="companion">
      <Image
        src="/images/CTA.png"
        alt="Robo ready to become your new companion"
        fill
        sizes="100vw"
      />
      <div className="cta-shade" />
      <div className="cta-copy" data-reveal>
        <p className="eyebrow">THE FUTURE FEELS PERSONAL.</p>
        <h2>
          READY TO MEET
          <br />
          YOUR{" "}
          <span className="accent">
            NEW
            <br />
            COMPANION?
          </span>
        </h2>
        <p>
          A smarter, more personal way
          <br className="desktop-break" /> to interact with AI.
        </p>
        <div className="button-row">
          <Button href="/products/basic">VIEW ROBO BASIC</Button>
          <Button href="#models" secondary>
            EXPLORE MODELS
          </Button>
        </div>
      </div>
      <span className="cta-caption micro">
        BUILT WITH INTELLIGENCE. DESIGNED FOR CONNECTION.
      </span>
    </section>
  );
}
