import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./home.css";
import { CartProvider } from "@/context/CartContext";
import "./cart.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "Robo AI — Your Intelligent Companion",
  description:
    "Meet Robo AI, a smart companion designed to think, listen and interact with your world.",
  openGraph: {
    title: "Robo AI — Your Intelligent Companion",
    description: "A smarter companion for everyday life.",
    images: ["/images/hinh2.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
