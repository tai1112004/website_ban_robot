"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { Check, CircleHelp } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import {
  getRecentOrder,
  ORDERS_KEY,
  type RecentOrderResult,
} from "@/lib/orders";
import CopyOrderNumber from "./CopyOrderNumber";
import OrderDetails from "./OrderDetails";
import OrderSummary from "./OrderSummary";
import OrderStatus from "./OrderStatus";
import OrderTimeline from "./OrderTimeline";

export default function OrderSuccess() {
  const { t } = useLanguage();
  const [result, setResult] = useState<
    RecentOrderResult | { state: "loading" }
  >({ state: "loading" });
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  useEffect(() => {
    setResult(getRecentOrder());
    const sync = (event: StorageEvent) => {
      if (event.key === ORDERS_KEY || event.key === null)
        setResult(getRecentOrder());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (menu || info) document.body.style.overflow = "hidden";
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", escape);
    };
  }, [menu, info]);
  return (
    <div className="order-page">
      <a href="#order-main" className="skip-link">
        {t("Skip to order confirmation")} </a>
      <Navbar homeHref="/" sectionPrefix="/" menu={menu} setMenu={setMenu} />
      <main id="order-main" className="order-main" inert={menu}>
        {result.state === "loading" ? (
          <p className="order-loading" role="status">
            {t("Loading your order…")} </p>
        ) : result.state === "found" ? (
          <>
            <header className="order-hero">
              <div className="order-confirmation-icon">
                <Check size={31} strokeWidth={1.5} />
              </div>
              <p className="eyebrow">{t("YOUR ROBO JOURNEY STARTS HERE")}</p>
              <h1>{t("ORDER RECEIVED.")}</h1>
              <p className="order-hero-subtitle">
                {t("Thanks for your interest in Robo.")} </p>
              <p className="order-demo-note">
                {t("Your demo order request is saved in this browser.")} <br />
                {t("Nothing was sent to a seller. No payment has been processed.")} </p>
              <CopyOrderNumber id={result.order.id} />
            </header>
            <div className="order-layout">
              <OrderDetails order={result.order} />
              <OrderSummary order={result.order} />
            </div>
            <OrderStatus status={result.order.status} />
            <OrderTimeline />
            <section className="order-ownership">
              <div>
                <p className="eyebrow">{t("AFTER YOUR ROBO ARRIVES")}</p>
                <h2>
                  {t("YOUR ROBO.")} <br />
                  <span>{t("YOUR ACCOUNT.")}</span>
                </h2>
              </div>
              <div>
                <p>
                  {t("A preview of what comes next: connect your Robo to an account and personalize the experience when the device and account features become available.")} </p>
                <ul>
                  <li>{t("PERSONALITY")}</li>
                  <li>{t("MEMORY")}</li>
                  <li>{t("KNOWLEDGE PACK")}</li>
                  <li>{t("DISPLAY")}</li>
                </ul>
                <a href="/products/basic">{t("LEARN ABOUT ROBO ↗")}</a>
              </div>
            </section>
            <div className="order-actions">
              <div className="button-row">
                <Button href={`/orders/${encodeURIComponent(result.order.id)}`}>
                  {t("VIEW ORDER")} </Button>
                <Button href="/#models" secondary>
                  {t("CONTINUE EXPLORING")} </Button>
              </div>
              <p>
                <a href="/account">{t("GO TO MY ACCOUNT ↗")}</a>
              </p>
              <a href="/" className="order-home-link">
                {t("BACK TO HOME")} </a>
            </div>
          </>
        ) : (
          <section className="order-fallback">
            <CircleHelp size={42} strokeWidth={1} />
            <h1>
              {t(result.state === "no-recent"
                ? "NO RECENT ORDER FOUND."
                : result.state === "not-found"
                  ? "ORDER NOT FOUND."
                  : "ORDER STORAGE UNAVAILABLE.")}
            </h1>
            <p>
              {t(result.state === "no-recent"
                ? "We couldn't find a recent order in this browser."
                : result.state === "not-found"
                  ? "The order may have been removed from local browser storage."
                  : "This browser could not read your saved orders. Check storage permissions and try again.")}
            </p>
            <div className="button-row">
              <Button href="/orders">{t("VIEW ORDERS")}</Button>
              <Button href="/" secondary>
                {t("GO HOME")} </Button>
            </div>
            {result.state === "unavailable" && (
              <button
                className="order-retry"
                onClick={() => setResult(getRecentOrder())}
              >
                {t("TRY AGAIN")} </button>
            )}
            <p className="order-future-note">
              {t("Your demo order history is available in this browser.")} </p>
          </section>
        )}
      </main>
      <div inert={menu}>
        <Footer
          homeHref="/"
          overviewHref="/"
          sectionPrefix="/"
          info={setInfo}
        />
      </div>
      {info && (
        <Modal title={t(info)} onClose={() => setInfo(null)}>
          <p className="info-copy">
            {t("This is a local frontend demonstration. Order details are stored in this browser only; no order, email or payment is sent. Product availability, pricing, delivery and account features will be confirmed in a future release.")} </p>
        </Modal>
      )}
    </div>
  );
}
