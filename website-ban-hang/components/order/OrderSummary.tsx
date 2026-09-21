"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useState } from "react";
import type { Order } from "@/types/order";
import type { CartItem } from "@/types/cart";
function money(value: number | null, currency: string, locale = "en-US") {
  if (value === null) return "TO BE ANNOUNCED";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} (currency unavailable)`;
  }
}
function Item({ item }: { item: CartItem }) {
  const { t, localeTag } = useLanguage();
  const [failed, setFailed] = useState(false);
  const src = /^\/images\/[\w-]+\.(png|jpe?g|webp)$/i.test(item.image)
    ? item.image
    : "/images/product_render_chinh_dien.png?v=20260921-1635";
  return (
    <article className="order-product">
      <div className="order-product-image">
        {failed ? (
          <span>{t("Product preview unavailable")}</span>
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
        <p>{t(item.tagline)}</p>
        <dl>
          <div>
            <dt>{t("Model")}</dt>
            <dd>{item.model}</dd>
          </div>
          <div>
            <dt>{t("Quantity")}</dt>
            <dd>{item.quantity}</dd>
          </div>
          <div>
            <dt>{t("Availability")}</dt>
            <dd>{t(item.availability)}</dd>
          </div>
        </dl>
        <p className="order-product-price">
          {t(item.price === null
            ? "PRICE TO BE ANNOUNCED"
            : money(item.price, item.currency, localeTag))}
        </p>
      </div>
    </article>
  );
}
export default function OrderSummary({ order }: { order: Order }) {
  const { t, localeTag } = useLanguage();
  const currency = order.items[0].currency;
  return (
    <aside className="order-summary" aria-labelledby="order-summary-title">
      <div className="order-section-heading">
        <h2 id="order-summary-title">{t("ORDER SUMMARY")}</h2>
        <span>
          {order.items.reduce((sum, item) => sum + item.quantity, 0)}  {t("ITEMS")} </span>
      </div>
      {order.items.map((item, index) => (
        <Item key={`${item.id}-${index}`} item={item} />
      ))}
      <dl className="order-totals">
        <div>
          <dt>{t("Subtotal")}</dt>
          <dd>{t(money(order.subtotal, currency, localeTag))}</dd>
        </div>
        <div>
          <dt>{t("Shipping")}</dt>
          <dd>
            {t(order.shipping === null
              ? "CALCULATED LATER"
              : money(order.shipping, currency, localeTag))}
          </dd>
        </div>
        <div>
          <dt>{t("Total")}</dt>
          <dd>{t(money(order.total, currency, localeTag))}</dd>
        </div>
      </dl>
      <p className="order-summary-note">
        {t("Saved demo order. No payment has been processed.")} </p>
    </aside>
  );
}
