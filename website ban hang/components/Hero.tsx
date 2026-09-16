import Image from "next/image";
import { ArrowDown, Play } from "lucide-react";
import { Button } from "./ui/Button";
export default function Hero({ watchFilm }: { watchFilm: () => void }) {
  return (
    <section id="home" className="hero">
      <Image
        className="hero-image"
        src="/images/hinh2.png"
        alt="Orange and white Robo waving hello on a desk at sunset"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="eyebrow" data-hero>
          <span className="status-dot" /> AI COMPANION ROBOT
        </p>
        <h1>
          <span data-hero>SMALL ROBOT.</span>
          <span data-hero className="accent">
            BIG
            <br className="desktop-break" /> PERSONALITY.
          </span>
        </h1>
        <p className="hero-description" data-hero>
          More than a robot.
          <br />
          An intelligent companion designed to listen,
          <br className="desktop-break" /> remember, respond and grow with you.
        </p>
        <div className="button-row" data-hero>
          <Button href="/products/basic">VIEW ROBO BASIC</Button>
          <button className="film-button" onClick={watchFilm}>
            <span>
              <Play size={14} fill="currentColor" />
            </span>{" "}
            WATCH FILM
          </button>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#features">
          SCROLL TO DISCOVER <ArrowDown size={16} />
        </a>
        <span>
          THOUGHTFULLY ENGINEERED. <i>PERSONALLY YOURS.</i>
        </span>
        <span className="edition">ROBO AI — 2026</span>
      </div>
    </section>
  );
}
