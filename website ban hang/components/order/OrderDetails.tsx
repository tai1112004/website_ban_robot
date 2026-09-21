"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { Order } from "@/types/order";
import { statusLabel } from "./OrderStatus";
export default function OrderDetails({ order }: { order: Order }) {
  const { t, localeTag } = useLanguage();
  const address = order.shippingAddress;
  return (
    <section className="order-details" aria-labelledby="order-details-title">
      <div className="order-section-heading">
        <h2 id="order-details-title">{t("ORDER DETAILS")}</h2>
      </div>
      <dl className="order-meta">
        <div>
          <dt>{t("Created")}</dt>
          <dd>
            {t(new Intl.DateTimeFormat(localeTag, {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(order.createdAt)))}
          </dd>
        </div>
        <div>
          <dt>{t("Status")}</dt>
          <dd>
            <span className="order-status-badge">
              {t(statusLabel(order.status))}
            </span>
          </dd>
        </div>
      </dl>
      <section className="order-contact">
        <h3>{t("CONTACT INFORMATION")}</h3>
        <dl>
          <div>
            <dt>{t("Name")}</dt>
            <dd>
              {[order.customer.firstName, order.customer.lastName]
                .filter(Boolean)
                .join(" ") || t("Not provided")}
            </dd>
          </div>
          <div>
            <dt>{t("Email")}</dt>
            <dd>{order.customer.email || t("Not provided")}</dd>
          </div>
          <div>
            <dt>{t("Phone")}</dt>
            <dd>{order.customer.phone || t("Not provided")}</dd>
          </div>
        </dl>
      </section>
      <section className="order-delivery">
        <h3>{t("DELIVERY INFORMATION")}</h3>
        <address>
          <strong>
            {address.firstName} {address.lastName}
          </strong>
          <span>{address.address}</span>
          {address.apartment?.trim() && <span>{address.apartment}</span>}
          <span>
            {[address.city, address.province, address.postalCode]
              .filter((value) => value?.trim())
              .join(", ")}
          </span>
          <span>{address.country}</span>
        </address>
      </section>
    </section>
  );
}
