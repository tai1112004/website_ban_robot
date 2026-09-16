"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { gsap } from "@/lib/gsap";

export default function IntroTrailer({ onClose }: { onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  function finish() {
    if (closing.current) return;
    closing.current = true;
    video.current?.pause();
    timeline.current = gsap
      .timeline({ onComplete: onClose })
      .to(".intro-content", { opacity: 0, duration: 0.45 })
      .to(root.current, { opacity: 0, duration: 0.45 }, "+=.35");
  }
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    root.current?.querySelector<HTMLButtonElement>(".skip-intro")?.focus();
    video.current?.play().catch(() => setBlocked(true));
    return () => {
      timeline.current?.kill();
      before?.focus();
    };
  }, []);
  return (
    <div
      ref={root}
      className="intro"
      role="dialog"
      aria-modal="true"
      aria-label="Meet Robo film"
      onKeyDown={(e) => {
        if (e.key === "Escape") finish();
        if (e.key === "Tab") {
          const buttons = Array.from(
            root.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
          );
          if (
            buttons.length &&
            ((!e.shiftKey && document.activeElement === buttons.at(-1)) ||
              (e.shiftKey && document.activeElement === buttons[0]))
          ) {
            e.preventDefault();
            (e.shiftKey ? buttons.at(-1) : buttons[0])?.focus();
          }
        }
      }}
    >
      <div className="intro-content">
        <video
          ref={video}
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster="/images/hinh2.png"
          onCanPlay={() => setReady(true)}
          onEnded={finish}
          onError={() => setFailed(true)}
          src="/videos/video_trailler.mp4"
        />
        <div className="intro-shade" />
        <span className="intro-brand">
          ROBO AI <span>A LITTLE MORE HUMAN.</span>
        </span>
        {!ready && !failed && !blocked && (
          <p className="intro-status" role="status">
            Loading the film…
          </p>
        )}
        {failed && (
          <p className="intro-status">
            The film couldn’t load. Continue to meet Robo.
          </p>
        )}
        {blocked && !failed && (
          <button
            className="film-play"
            onClick={() => {
              video.current
                ?.play()
                .then(() => setBlocked(false))
                .catch(() => setFailed(true));
            }}
          >
            <Play /> Play film
          </button>
        )}
        <button className="skip-intro" onClick={finish}>
          SKIP INTRO <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
