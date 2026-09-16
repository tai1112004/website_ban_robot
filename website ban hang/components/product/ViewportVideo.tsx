"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function ViewportVideo({
  src,
  poster,
  label,
  suspended = false,
}: {
  src: string;
  poster: string;
  label: string;
  suspended?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          preload.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    const viewport = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    preload.observe(node);
    viewport.observe(node);
    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      preload.disconnect();
      viewport.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    let current = true;
    if (
      near &&
      visible &&
      !hidden &&
      !suspended &&
      !failed &&
      !paused &&
      (!reduced || manual)
    ) {
      node.play().catch((error) => {
        if (current && error.name !== "AbortError") setPaused(true);
      });
    } else node.pause();
    return () => {
      current = false;
      node.pause();
    };
  }, [near, visible, hidden, suspended, failed, paused, reduced, manual]);
  return (
    <div ref={root} className="pdp-video">
      <video
        ref={video}
        src={near ? src : undefined}
        poster={poster}
        muted
        playsInline
        loop
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        style={failed ? { visibility: "hidden" } : undefined}
      />
      {failed && (
        <div
          className="pdp-video-fallback"
          style={{ backgroundImage: `url(${poster})` }}
        >
          <span>Video unavailable. Product preview shown.</span>
        </div>
      )}
      {!failed && (
        <button
          className="pdp-video-control"
          aria-label={`${playing ? "Pause" : "Play"} ${label}`}
          onClick={() => {
            setNear(true);
            setManual(true);
            setPaused(playing);
          }}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
          <span>{playing ? "PAUSE" : "PLAY"} FILM</span>
        </button>
      )}
    </div>
  );
}
