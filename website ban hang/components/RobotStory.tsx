import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
const SCRUB_CATCH_UP_SECONDS = 0.3;
const stages = [
  ["MEET ROBO.", "A compact AI companion designed for everyday life."],
  [
    "BUILT TO THINK.",
    "Realtime intelligence designed to understand and respond.",
  ],
  ["BUILT TO LISTEN.", "Voice interaction designed to feel natural."],
  [
    "INTELLIGENCE AT ITS CORE.",
    "Voice, memory, personality and knowledge working together.",
  ],
  [
    "MADE TO BE WITH YOU.",
    "Technology becomes meaningful when it becomes personal.",
  ],
];
export default function RobotStory() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const media = video.current;
    if (!media || reduced || failed) return;
    let frame = 0;
    let desired = 0;
    let trigger: ScrollTrigger | undefined;
    let disposed = false;
    const seek = () => {
      frame = 0;
      if (!media.seeking && Math.abs(media.currentTime - desired) > 0.025)
        media.currentTime = desired;
    };
    const schedule = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(seek);
    };
    const ctx = gsap.context(() => {}, root);
    const setup = () => {
      if (!Number.isFinite(media.duration) || trigger || disposed) return;
      media.pause();
      ctx.add(() => {
        const panels = gsap.utils.toArray<HTMLElement>(
          ".story-panel",
          root.current,
        );
        const tl = gsap.timeline({ paused: true });
        panels.forEach((panel, i) => {
          if (i > 0)
            tl.fromTo(
              panel,
              { autoAlpha: 0, y: 25 },
              { autoAlpha: 1, y: 0, duration: 0.025 },
              i * 0.2,
            );
          if (i < 4)
            tl.to(
              panel,
              { autoAlpha: 0, y: -20, duration: 0.025 },
              (i + 1) * 0.2 - 0.025,
            );
        });
        tl.to({}, { duration: 0.175 }, 0.825);
        const playhead = { progress: 0 };
        // Use the tween's updates: numeric scrub keeps moving after scroll stops.
        // Video, copy and the progress bar all follow this same eased playhead.
        const renderProgress = () => {
          desired = Math.min(
            playhead.progress * media.duration,
            Math.max(0, media.duration - 0.001),
          );
          schedule();
          tl.progress(playhead.progress);
          root.current?.style.setProperty(
            "--story-progress",
            String(playhead.progress),
          );
        };
        const motion = gsap.to(playhead, {
          progress: 1,
          duration: 1,
          ease: "none",
          onUpdate: renderProgress,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: SCRUB_CATCH_UP_SECONDS,
          },
        });
        trigger = motion.scrollTrigger;
        // Restore the right frame when the page is opened partway down the story.
        motion.progress(trigger?.progress ?? 0);
        renderProgress();
      });
    };
    media.addEventListener("loadedmetadata", setup);
    media.addEventListener("seeked", schedule);
    if (media.readyState >= 1) setup();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      media.removeEventListener("loadedmetadata", setup);
      media.removeEventListener("seeked", schedule);
      ctx.revert();
    };
  }, [reduced, failed]);
  return (
    <section
      ref={root}
      id="robot"
      className={`robot-story ${reduced || failed ? "story-static" : ""}`}
      aria-label="Meet Robo: an interactive film"
    >
      <div className="story-sticky">
        <video
          ref={video}
          src={reduced ? undefined : "/videos/video_chay_o_home.mp4"}
          poster="/images/hinh2.png"
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setReady(true)}
          onError={() => setFailed(true)}
          aria-label="Robo transformation controlled by scrolling"
        />
        <div className="story-shade" />
        <div className="story-top">
          <span className="eyebrow">03 / MEET YOUR COMPANION</span>
          <span className="micro">A LITTLE ROBOT. A WORLD OF POSSIBILITY.</span>
        </div>
        <div className="story-panels">
          {stages.map(([title, copy], i) => (
            <div
              className="story-panel"
              key={title}
              style={{
                opacity: i === 0 ? 1 : 0,
                visibility: i === 0 ? "visible" : "hidden",
              }}
            >
              <span className="story-number">0{i + 1} — 05</span>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
          ))}
        </div>
        <div className="story-bottom">
          <span>
            {failed
              ? "EXPLORE THE TECHNOLOGY BELOW"
              : reduced
                ? "YOUR EVERYDAY COMPANION"
                : !ready
                  ? "LOADING EXPERIENCE…"
                  : "SCROLL TO BRING ROBO TO LIFE"}{" "}
            <ArrowDown size={15} />
          </span>
          <div className="story-track">
            <div />
          </div>
        </div>
      </div>
    </section>
  );
}
