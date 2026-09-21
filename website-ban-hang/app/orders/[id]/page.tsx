import type { Metadata } from "next";
import OrderDetail from "@/components/order/OrderDetail";
import "../../account/account.css";
import "../../order-success/order-success.css";
export const metadata: Metadata = {
  title: "Order Details | Robo AI",
  robots: { index: false, follow: true },
};
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
