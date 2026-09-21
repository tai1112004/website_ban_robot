"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";
import { productPrice, type ProductModel } from "@/data/products";
export default function StickyPurchaseBar({
  product,
  onInterest,
  hidden,
}: {
  product: ProductModel;
  onInterest: () => void;
  hidden: boolean;
}) {
  const { t, localeTag } = useLanguage();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#product",
      start: "bottom top",
      endTrigger: "#final-cta",
      end: "top bottom",
      onToggle: (self) => setVisible(self.isActive),
    });
    return () => trigger.kill();
  }, []);
  if (!visible || hidden) return null;
  return (
    <aside className="pdp-purchase-bar" aria-label={t("Pre-order interest")}>
      <div>
        <strong>{t(product.name)}</strong>
        <span>{t(product.tagline)}</span>
      </div>
      <p>{t(productPrice(product, localeTag))}</p>
      <button className="button button-primary" onClick={onInterest}>
        {t("JOIN THE LIST")} <ArrowUpRight size={15} />
      </button>
    </aside>
  );
}
