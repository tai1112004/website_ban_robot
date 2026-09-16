import { Check } from "lucide-react";
import type { OrderStatus as Status } from "@/types/order";
export const orderStages: { key: Status; label: string }[] = [
  { key: "ORDER_RECEIVED", label: "Order received" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];
export function statusLabel(status: Status) {
  return (
    orderStages.find((stage) => stage.key === status)?.label ?? "Order received"
  );
}
export default function OrderStatus({ status }: { status: Status }) {
  const active = orderStages.findIndex((stage) => stage.key === status);
  return (
    <section
      className="order-progress-section"
      aria-labelledby="order-progress-title"
    >
      <div className="order-section-heading">
        <h2 id="order-progress-title">ORDER PROGRESS</h2>
        <span>DEMO STATUS</span>
      </div>
      <ol className="order-progress">
        {orderStages.map((stage, index) => (
          <li
            key={stage.key}
            className={index <= active ? "is-reached" : ""}
            aria-current={index === active ? "step" : undefined}
          >
            <span className="order-progress-dot" aria-hidden="true">
              {index < active ? (
                <Check size={12} />
              ) : (
                String(index + 1).padStart(2, "0")
              )}
            </span>
            <span>{stage.label}</span>
            <small>
              {index === active
                ? "CURRENT STATUS"
                : index < active
                  ? "COMPLETED"
                  : "UPCOMING"}
            </small>
          </li>
        ))}
      </ol>
    </section>
  );
}
