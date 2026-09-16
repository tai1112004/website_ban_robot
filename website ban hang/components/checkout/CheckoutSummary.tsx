"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatCartPrice } from "@/lib/cart";
import type { CartItem } from "@/types/cart";
function ProductItem({ item }: { item: CartItem }) {
  const [failed, setFailed] = useState(false);
  return (
    <article className="checkout-product">
      <div className="checkout-product-image">
        {failed ? (
          <span>ROBO</span>
        ) : (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="90px"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div>
        <h3>{item.name.toUpperCase()}</h3>
        <p>{item.tagline}</p>
        <p>
          Model: {item.model} <span> / Qty: {item.quantity}</span>
        </p>
        <p>{item.availability}</p>
        <p>
          {item.price === null
            ? "PRICE TO BE ANNOUNCED"
            : formatCartPrice(item.price, item.currency)}
        </p>
      </div>
    </article>
  );
}
export default function CheckoutSummary({
  items,
  subtotal,
}: {
  items: CartItem[];
  subtotal: number | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <aside
      className={`checkout-summary ${expanded ? "is-expanded" : ""}`}
      aria-label="Order summary"
    >
      <div className="checkout-summary-heading">
        <h2>ORDER SUMMARY</h2>
        <span>
          {count} {count === 1 ? "ITEM" : "ITEMS"}
        </span>
      </div>
      <button
        type="button"
        className="checkout-summary-toggle"
        aria-expanded={expanded}
        aria-controls="checkout-summary-details"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "HIDE DETAILS" : "SHOW DETAILS"}
        <ChevronDown size={16} />
      </button>
      <div id="checkout-summary-details" className="checkout-summary-details">
        {items.map((item) => (
          <ProductItem key={item.id} item={item} />
        ))}
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatCartPrice(subtotal, items[0]?.currency)}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>CALCULATED LATER</dd>
          </div>
          <div className="checkout-total">
            <dt>Total</dt>
            <dd>TO BE ANNOUNCED</dd>
          </div>
        </dl>
        <p className="checkout-summary-note">
          Final pricing and delivery costs will be confirmed when Robo becomes
          available.
        </p>
        <a href="/cart" className="checkout-edit">
          EDIT CART ↗
        </a>
      </div>
    </aside>
  );
}
