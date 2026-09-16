import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../account/account.css";
import "./robots.css";
export const metadata: Metadata = {
  title: "My Robots | Robo AI",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
