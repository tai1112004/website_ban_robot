"use client";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
export default function CartLink() {
  const { t } = useLanguage();
  const { getTotalItems } = useCart();
  const count = getTotalItems();
  return (
    <a
      href="/cart"
      className="icon-button nav-cart"
      aria-label={t("Cart, {value0} {value1}", { value0: count, value1: t(count === 1 ? "item" : "items") })}
    >
      <ShoppingBag size={20} />
      {count > 0 && (
        <span className="nav-cart-badge" aria-hidden="true">
          {count}
        </span>
      )}
    </a>
  );
}
