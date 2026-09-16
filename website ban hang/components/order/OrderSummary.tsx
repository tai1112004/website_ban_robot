"use client";
import Image from "next/image";
import { useState } from "react";
import type { Order } from "@/types/order";
import type { CartItem } from "@/types/cart";
function money(value: number | null, currency: string) {
  if (value === null) return "TO BE ANNOUNCED";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} (currency unavailable)`;
  }
}
function Item({ item }: { item: CartItem }) {
  const [failed, setFailed] = useState(false);
  const src = /^\/images\/[\w-]+\.(png|jpe?g|webp)$/i.test(item.image)
    ? item.image
    : "/images/product_render_chinh_dien.png";
  return (
    <article className="order-product">
      <div className="order-product-image">
        {failed ? (
          <span>Product preview unavailable</span>
        ) : (
          <Image
            src={src}
            alt={item.name}
            fill
            sizes="(max-width:767px) 100px, 120px"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div>
        <h3>{item.name.toUpperCase()}</h3>
        <p>{item.tagline}</p>
        <dl>
          <div>
            <dt>Model</dt>
            <dd>{item.model}</dd>
          </div>
          <div>
            <dt>Quantity</dt>
            <dd>{item.quantity}</dd>
          </div>
          <div>
            <dt>Availability</dt>
            <dd>{item.availability}</dd>
          </div>
        </dl>
        <p className="order-product-price">
          {item.price === null
            ? "PRICE TO BE ANNOUNCED"
            : money(item.price, item.currency)}
        </p>
      </div>
    </article>
  );
}
export default function OrderSummary({ order }: { order: Order }) {
  const currency = order.items[0].currency;
  return (
    <aside className="order-summary" aria-labelledby="order-summary-title">
      <div className="order-section-heading">
        <h2 id="order-summary-title">ORDER SUMMARY</h2>
        <span>
          {order.items.reduce((sum, item) => sum + item.quantity, 0)} ITEMS
        </span>
      </div>
      {order.items.map((item, index) => (
        <Item key={`${item.id}-${index}`} item={item} />
      ))}
      <dl className="order-totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{money(order.subtotal, currency)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>
            {order.shipping === null
              ? "CALCULATED LATER"
              : money(order.shipping, currency)}
          </dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>{money(order.total, currency)}</dd>
        </div>
      </dl>
      <p className="order-summary-note">
        Saved demo order. No payment has been processed.
      </p>
    </aside>
  );
}
