"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { Order } from "@/types/order";
import { statusLabel } from "./OrderStatus";
import { Button } from "../ui/Button";
import OrderImage from "./OrderImage";
export function orderDate(date: string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
export function orderTotal(order: Order, locale = "en-US") {
  if (order.total === null) return "TO BE ANNOUNCED";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: order.items[0].currency,
    }).format(order.total);
  } catch {
    return "CURRENCY UNAVAILABLE";
  }
}
export default function OrderCard({ order }: { order: Order }) {
  const { t, localeTag } = useLanguage();
  return (
    <article className="history-card" aria-label={t("Order {value0}", { value0: order.id })}>
      <header>
        <div>
          <span>{t("ORDER")}</span>
          <h2>{order.id}</h2>
          <time dateTime={order.createdAt}>{t(orderDate(order.createdAt, localeTag))}</time>
        </div>
        <span className={`history-status status-${order.status.toLowerCase()}`}>
          {t(statusLabel(order.status).toUpperCase())}
        </span>
      </header>
      <div className="history-card-body">
        <div className="history-products">
          {order.items.map((item, index) => (
            <div className="history-product" key={`${item.id}-${index}`}>
              <OrderImage src={item.image} name={item.name} />
              <div>
                <h3>{item.name.toUpperCase()}</h3>
                <p>{t("Model:")} {item.model}</p>
                <p>{t("Qty")} {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="history-card-action">
          <span>{t("TOTAL")}</span>
          <p>{t(orderTotal(order, localeTag))}</p>
          <Button href={`/orders/${encodeURIComponent(order.id)}`}>
            {t("VIEW ORDER")} </Button>
        </div>
      </div>
    </article>
  );
}
