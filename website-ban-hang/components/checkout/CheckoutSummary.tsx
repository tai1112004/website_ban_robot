"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatCartPrice } from "@/lib/cart";
import type { CartItem } from "@/types/cart";
function ProductItem({ item }: { item: CartItem }) {
  const { t, localeTag } = useLanguage();
  const [failed, setFailed] = useState(false);
  return (
    <article className="checkout-product">
      <div className="checkout-product-image">
        {failed ? (
          <span>{t("ROBO")}</span>
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
        <p>{t(item.tagline)}</p>
        <p>
          {t("Model:")} {item.model} <span>  {t("/ Qty:")} {item.quantity}</span>
        </p>
        <p>{t(item.availability)}</p>
        <p>
          {t(item.price === null
            ? "PRICE TO BE ANNOUNCED"
            : formatCartPrice(item.price, item.currency, localeTag))}
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
  const { t, localeTag } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <aside
      className={`checkout-summary ${expanded ? "is-expanded" : ""}`}
      aria-label={t("Order summary")}
    >
      <div className="checkout-summary-heading">
        <h2>{t("ORDER SUMMARY")}</h2>
        <span>
          {count} {t(count === 1 ? "ITEM" : "ITEMS")}
        </span>
      </div>
      <button
        type="button"
        className="checkout-summary-toggle"
        aria-expanded={expanded}
        aria-controls="checkout-summary-details"
        onClick={() => setExpanded(!expanded)}
      >
        {t(expanded ? "HIDE DETAILS" : "SHOW DETAILS")}
        <ChevronDown size={16} />
      </button>
      <div id="checkout-summary-details" className="checkout-summary-details">
        {items.map((item) => (
          <ProductItem key={item.id} item={item} />
        ))}
        <dl>
          <div>
            <dt>{t("Subtotal")}</dt>
            <dd>{t(formatCartPrice(subtotal, items[0]?.currency, localeTag))}</dd>
          </div>
          <div>
            <dt>{t("Shipping")}</dt>
            <dd>{t("CALCULATED LATER")}</dd>
          </div>
          <div className="checkout-total">
            <dt>{t("Total")}</dt>
            <dd>{t("TO BE ANNOUNCED")}</dd>
          </div>
        </dl>
        <p className="checkout-summary-note">
          {t("Final pricing and delivery costs will be confirmed when Robo becomes available.")} </p>
        <a href="/cart" className="checkout-edit">
          {t("EDIT CART ↗")} </a>
      </div>
    </aside>
  );
}
