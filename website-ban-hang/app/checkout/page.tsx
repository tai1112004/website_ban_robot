import type { Metadata } from "next";
import CheckoutPage from "@/components/checkout/CheckoutPage";
import "./checkout.css";
export const metadata: Metadata = {
  title: "Checkout | Robo AI",
  robots: { index: false, follow: true },
};
export default function Page() {
  return <CheckoutPage />;
}
