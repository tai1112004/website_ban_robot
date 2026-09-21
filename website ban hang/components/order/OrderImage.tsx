"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useState } from "react";
export default function OrderImage({
  src,
  name,
  cutout = false,
}: {
  src: string;
  name: string;
  cutout?: boolean;
}) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);
  const safe = /^\/images\/[\w-]+\.(png|jpe?g|webp)$/i.test(src)
    ? src
    : "/images/product_render_chinh_dien.png";
  return (
    <div className={`history-image ${cutout ? "history-cutout" : ""}`}>
      {failed ? (
        <span>{t("Preview unavailable")}</span>
      ) : (
        <Image
          src={safe}
          alt={name}
          fill
          sizes={
            cutout
              ? "(max-width:767px) 80vw, 350px"
              : "(max-width:767px) 110px, 130px"
          }
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
