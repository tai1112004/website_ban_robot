import type { Metadata } from "next";
import OrdersList from "@/components/order/OrdersList";
import "../account/account.css";
export const metadata: Metadata = {
  title: "Your Orders | Robo AI",
  robots: { index: false, follow: true },
};
export default function Page() {
  return <OrdersList />;
}
