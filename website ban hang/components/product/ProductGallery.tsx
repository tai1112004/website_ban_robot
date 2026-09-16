import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Scan } from "lucide-react";
import type { GalleryImage } from "@/data/products";

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const select = (index: number) =>
    setActive((index + images.length) % images.length);
  return (
    <div className="pdp-gallery" aria-label="Product gallery">
      <div
        className="pdp-gallery-stage"
        tabIndex={0}
        role="group"
        aria-label="Robot views. Use left and right arrow keys or swipe."
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            select(active + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse")
            start.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerCancel={() => {
          start.current = null;
        }}
        onPointerUp={(event) => {
          const initial = start.current;
          start.current = null;
          if (!initial) return;
          const dx = event.clientX - initial.x;
          const dy = event.clientY - initial.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
            select(active + (dx < 0 ? 1 : -1));
        }}
      >
        {images.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 767px) 100vw, 52vw"
            className={`pdp-gallery-image ${active === index ? "is-active" : ""}`}
            aria-hidden={active !== index}
          />
        ))}
        <div className="pdp-gallery-label">
          <span>ROBO / OBJECT STUDY</span>
          <Scan size={16} strokeWidth={1.3} />
        </div>
        <div className="pdp-gallery-counter">
          <span aria-live="polite">
            0{active + 1} / 0{images.length} — {images[active].label}
          </span>
          <div>
            <button
              aria-label="Previous product view"
              onClick={() => select(active - 1)}
            >
              <ArrowLeft size={17} />
            </button>
            <button
              aria-label="Next product view"
              onClick={() => select(active + 1)}
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
      <div
        className="pdp-thumbnails"
        role="group"
        aria-label="Choose a product view"
      >
        {images.map((image, index) => (
          <button
            key={image.label}
            aria-label={`View ${image.label.toLowerCase()}`}
            aria-pressed={active === index}
            onClick={() => select(index)}
          >
            <span className="pdp-thumbnail-image">
              <Image src={image.src} alt="" fill sizes="100px" />
            </span>
            <span>{image.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
