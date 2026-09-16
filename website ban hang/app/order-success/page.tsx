import type { Metadata } from "next";
import OrderSuccess from "@/components/order/OrderSuccess";
import "./order-success.css";
export const metadata: Metadata = {
  title: "Demo order | Robo AI",
  robots: { index: false, follow: true },
};
export default function Page() {
  return <OrderSuccess />;
}
