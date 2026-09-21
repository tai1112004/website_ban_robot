import type { Metadata } from "next";
import AccountOverview from "@/components/account/AccountOverview";
import "./account.css";
export const metadata: Metadata = {
  title: "My Account | Robo AI",
  robots: { index: false, follow: true },
};
export default function Page() {
  return <AccountOverview />;
}
