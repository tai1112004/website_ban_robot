import type { Order } from "@/types/order";
import { statusLabel } from "./OrderStatus";
import { Button } from "../ui/Button";
import OrderImage from "./OrderImage";
export function orderDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
export function orderTotal(order: Order) {
  if (order.total === null) return "TO BE ANNOUNCED";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: order.items[0].currency,
    }).format(order.total);
  } catch {
    return "CURRENCY UNAVAILABLE";
  }
}
export default function OrderCard({ order }: { order: Order }) {
  return (
    <article className="history-card" aria-label={`Order ${order.id}`}>
      <header>
        <div>
          <span>ORDER</span>
          <h2>{order.id}</h2>
          <time dateTime={order.createdAt}>{orderDate(order.createdAt)}</time>
        </div>
        <span className={`history-status status-${order.status.toLowerCase()}`}>
          {statusLabel(order.status).toUpperCase()}
        </span>
      </header>
      <div className="history-card-body">
        <div className="history-products">
          {order.items.map((item, index) => (
            <div className="history-product" key={`${item.id}-${index}`}>
              <OrderImage src={item.image} name={item.name} />
              <div>
                <h3>{item.name.toUpperCase()}</h3>
                <p>Model: {item.model}</p>
                <p>Qty {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="history-card-action">
          <span>TOTAL</span>
          <p>{orderTotal(order)}</p>
          <Button href={`/orders/${encodeURIComponent(order.id)}`}>
            VIEW ORDER
          </Button>
        </div>
      </div>
    </article>
  );
}
