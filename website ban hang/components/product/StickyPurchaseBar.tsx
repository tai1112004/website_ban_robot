"use client";
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
    <aside className="pdp-purchase-bar" aria-label="Pre-order interest">
      <div>
        <strong>{product.name}</strong>
        <span>{product.tagline}</span>
      </div>
      <p>{productPrice(product)}</p>
      <button className="button button-primary" onClick={onInterest}>
        JOIN THE LIST <ArrowUpRight size={15} />
      </button>
    </aside>
  );
}
