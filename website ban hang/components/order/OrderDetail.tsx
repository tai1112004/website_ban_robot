"use client";
import { useLanguage } from "@/context/LanguageContext";
import useOrders from "@/hooks/useOrders";
import AccountShell from "../account/AccountShell";
import { LoadingOrders, OrdersError } from "../account/AccountDataState";
import { Button } from "../ui/Button";
import OrderDetails from "./OrderDetails";
import OrderSummary from "./OrderSummary";
import OrderStatus from "./OrderStatus";
import CopyOrderNumber from "./CopyOrderNumber";
import OrderImage from "./OrderImage";
import { statusLabel } from "./OrderStatus";
import { orderDate } from "./OrderCard";
export default function OrderDetail({ id }: { id: string }) {
  const { t, localeTag } = useLanguage();
  const { orders, loading, error, reload } = useOrders();
  const order = orders.find((item) => item.id === id);
  return (
    <AccountShell active="orders">
      {loading ? (
        <LoadingOrders />
      ) : error ? (
        <OrdersError retry={reload} />
      ) : !order ? (
        <section className="account-empty">
          <h1>{t("ORDER NOT FOUND.")}</h1>
          <p>{t("We couldn't find this order in your local order history.")}</p>
          <div className="button-row">
            <Button href="/orders">{t("VIEW ALL ORDERS")}</Button>
            <Button href="/" secondary>
              {t("GO HOME")} </Button>
          </div>
        </section>
      ) : (
        <>
          <nav className="account-breadcrumb" aria-label={t("Breadcrumb")}>
            <a href="/account">{t("ACCOUNT")}</a>
            <span>/</span>
            <a href="/orders">{t("ORDERS")}</a>
            <span>/</span>
            <span aria-current="page">{order.id}</span>
          </nav>
          <header className="account-heading detail-heading">
            <p className="eyebrow">{t("ORDER")}</p>
            <h1>{order.id}</h1>
            <div className="detail-meta">
              <time dateTime={order.createdAt}>
                {t(orderDate(order.createdAt, localeTag))}
              </time>
              <span
                className={`history-status status-${order.status.toLowerCase()}`}
              >
                {t(statusLabel(order.status).toUpperCase())}
              </span>
            </div>
            <CopyOrderNumber id={order.id} />
          </header>
          <OrderStatus status={order.status} />
          <div className="order-layout account-order-layout">
            <OrderDetails order={order} />
            <OrderSummary order={order} />
          </div>
          {order.status === "ORDER_RECEIVED" && (
            <section className="detail-next">
              <h2>{t("WHAT HAPPENS NEXT?")}</h2>
              <p>
                {t("Your demo order request is saved locally. Product availability, final pricing and delivery details will be confirmed as Robo moves toward commercial release.")} </p>
            </section>
          )}
          <section className="detail-products">
            <h2>{t("YOUR ROBO")}</h2>
            {order.items.map((item, index) => (
              <article key={`${item.id}-${index}`}>
                <OrderImage src={item.image} name={item.name} />
                <div>
                  <h3>{item.name.toUpperCase()}</h3>
                  <p>{t(item.tagline)}</p>
                  <Button href={`/products/${encodeURIComponent(item.slug)}`}>
                    {t("VIEW PRODUCT")} </Button>
                </div>
              </article>
            ))}
          </section>
          <a className="account-back" href="/orders">
            {t("← VIEW ALL ORDERS")} </a>
        </>
      )}
    </AccountShell>
  );
}
