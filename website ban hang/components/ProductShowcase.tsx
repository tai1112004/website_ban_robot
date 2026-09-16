import Image from "next/image";
import { Cpu, AudioLines, Smile, ScanEye } from "lucide-react";
import { Button } from "./ui/Button";
import { SectionTitle } from "./ui/SectionTitle";
export default function ProductShowcase({ buy }: { buy: () => void }) {
  return (
    <section id="shop" className="showcase section-space">
      <SectionTitle index="05" label="MAKE ROOM FOR SOMETHING EXTRAORDINARY">
        MEET YOUR
        <br />
        NEW COMPANION.
      </SectionTitle>
      <div className="showcase-layout">
        <div className="showcase-image" data-cursor="VIEW">
          <div className="product-glow" />
          <Image
            src="/images/robot_phongtrang.png"
            alt="Robo AI One in its signature orange and white finish"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
          />
          <span className="finish-label">
            <span /> SIGNATURE ORANGE / CLOUD WHITE
          </span>
        </div>
        <div className="product-info" data-reveal>
          <p className="eyebrow">
            <span className="status-dot" /> YOUR EVERYDAY COMPANION
          </p>
          <h3>
            Robo AI One<span>01</span>
          </h3>
          <p className="product-tagline">
            Small robot.
            <br />
            Big possibilities.
          </p>
          <div className="price">
            $499 <span>USD · Demo price</span>
          </div>
          <div className="button-row">
            <Button onClick={buy}>BUY NOW</Button>
            <Button secondary href="#design">
              VIEW DETAILS
            </Button>
          </div>
          <p className="product-note">
            One little companion. A whole new connection.
          </p>
          <div className="product-badges">
            {[
              { Icon: Cpu, text: "AI POWERED" },
              { Icon: AudioLines, text: "VOICE INTERACTION" },
              { Icon: Smile, text: "EXPRESSIVE EMOTIONS" },
              { Icon: ScanEye, text: "SMART VISION" },
            ].map(({ Icon, text }) => (
              <span key={text}>
                <Icon size={17} strokeWidth={1.4} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
