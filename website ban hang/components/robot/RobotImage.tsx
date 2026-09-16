"use client";
import Image from "next/image";
import { useState } from "react";
export default function RobotImage({
  src,
  name = "Robo AI",
}: {
  src?: string;
  name?: string;
}) {
  const [failed, setFailed] = useState(false);
  const fallback = "/images/product_render_chinh_dien.png";
  const safe =
    src && /^\/images\/[\w-]+\.(png|jpg|jpeg|webp)$/.test(src) ? src : fallback;
  return (
    <div className="robot-image">
      <Image
        src={failed ? fallback : safe}
        alt={name}
        fill
        sizes="(max-width: 767px) 90vw, 40vw"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
