"use client";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
export default function CartLink() {
  const { getTotalItems } = useCart();
  const count = getTotalItems();
  return (
    <a
      href="/cart"
      className="icon-button nav-cart"
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
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
