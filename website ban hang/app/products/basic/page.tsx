import type { Metadata } from "next";
import ProductPage from "@/components/product/ProductPage";
import { roboBasic } from "@/data/products";
import "../product.css";

export const metadata: Metadata = {
  title: "Robo Basic — Your Personal AI Companion | Robo AI",
  description:
    "Meet Robo Basic: realtime voice, personality, personal memory and Knowledge Packs in a physical AI companion. Pricing to be announced.",
  openGraph: {
    title: "Robo Basic — Your Personal AI Companion",
    description: "A voice. A personality. A companion of your own.",
    images: ["/images/product_render_chinh_dien.png?v=20260921-1635"],
  },
};
export default function BasicPage() {
  return <ProductPage product={roboBasic} />;
}
