import type { Metadata } from "next";
import CartPage from "@/components/cart/CartPage";
export const metadata: Metadata = {
  title: "Your Cart | Robo AI",
  description: "Review your Robo companion selection.",
  robots: { index: false, follow: true },
};
export default function Page() {
  return <CartPage />;
}
