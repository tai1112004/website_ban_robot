"use client";
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
          <h1>ORDER NOT FOUND.</h1>
          <p>We couldn&apos;t find this order in your local order history.</p>
          <div className="button-row">
            <Button href="/orders">VIEW ALL ORDERS</Button>
            <Button href="/" secondary>
              GO HOME
            </Button>
          </div>
        </section>
      ) : (
        <>
          <nav className="account-breadcrumb" aria-label="Breadcrumb">
            <a href="/account">ACCOUNT</a>
            <span>/</span>
            <a href="/orders">ORDERS</a>
            <span>/</span>
            <span aria-current="page">{order.id}</span>
          </nav>
          <header className="account-heading detail-heading">
            <p className="eyebrow">ORDER</p>
            <h1>{order.id}</h1>
            <div className="detail-meta">
              <time dateTime={order.createdAt}>
                {orderDate(order.createdAt)}
              </time>
              <span
                className={`history-status status-${order.status.toLowerCase()}`}
              >
                {statusLabel(order.status).toUpperCase()}
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
              <h2>WHAT HAPPENS NEXT?</h2>
              <p>
                Your demo order request is saved locally. Product availability,
                final pricing and delivery details will be confirmed as Robo
                moves toward commercial release.
              </p>
            </section>
          )}
          <section className="detail-products">
            <h2>YOUR ROBO</h2>
            {order.items.map((item, index) => (
              <article key={`${item.id}-${index}`}>
                <OrderImage src={item.image} name={item.name} />
                <div>
                  <h3>{item.name.toUpperCase()}</h3>
                  <p>{item.tagline}</p>
                  <Button href={`/products/${encodeURIComponent(item.slug)}`}>
                    VIEW PRODUCT
                  </Button>
                </div>
              </article>
            ))}
          </section>
          <a className="account-back" href="/orders">
            ← VIEW ALL ORDERS
          </a>
        </>
      )}
    </AccountShell>
  );
}
