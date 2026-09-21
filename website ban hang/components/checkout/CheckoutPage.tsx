"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Truck, Wallet } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useCart } from "@/context/CartContext";
import {
  createDemoOrder,
  initialCheckout,
  saveCheckoutOrder,
  validateCheckout,
} from "@/lib/orders";
import type { CheckoutErrors, CheckoutFormData } from "@/types/order";
import CheckoutFields from "./CheckoutFields";
import CheckoutSummary from "./CheckoutSummary";

function CheckoutContent() {
  const { t, localeTag } = useLanguage();
  const { items, ready, clearCart, getSubtotal } = useCart();
  const router = useRouter();
  const [data, setData] = useState<CheckoutFormData>(initialCheckout);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [confirmed, setConfirmed] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");
  const busy = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const latestItems = useRef(items);
  latestItems.current = items;
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const change = (key: keyof CheckoutFormData, value: string) => {
    setData((previous) => ({ ...previous, [key]: value }));
    if (attempted) setErrors((previous) => ({ ...previous, [key]: undefined }));
  };
  if (!ready)
    return (
      <p className="checkout-loading" role="status">
        {t("Loading your cart…")} </p>
    );
  if (!items.length && !submitting)
    return (
      <section className="checkout-empty">
        <h2>{t("NOTHING TO CHECK OUT.")}</h2>
        <p>{t("Your cart is currently empty.")}</p>
        <div className="button-row">
          <Button href="/#models">{t("DISCOVER ROBO")}</Button>
          <Button href="/cart" secondary>
            {t("GO TO CART")} </Button>
        </div>
      </section>
    );
  return (
    <div className="checkout-layout">
      <form
        ref={form}
        className="checkout-form"
        noValidate
        aria-busy={submitting}
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy.current) return;
          setAttempted(true);
          const next = validateCheckout(data, confirmed);
          setErrors(next);
          setFailure("");
          if (Object.keys(next).length) {
            const key = Object.keys(next)[0];
            form.current
              ?.querySelector<HTMLElement>(`#checkout-${key}`)
              ?.focus();
            return;
          }
          if (!latestItems.current.length) return;
          busy.current = true;
          setSubmitting(true);
          await new Promise((resolve) => setTimeout(resolve, 250));
          if (!mounted.current) return;
          try {
            if (!latestItems.current.length)
              throw new Error("Cart became empty");
            const order = createDemoOrder(data, latestItems.current);
            saveCheckoutOrder(order);
            clearCart();
            router.push("/order-success");
          } catch {
            setFailure(
              "Something went wrong. Your cart has not been changed. Please allow browser storage and try again.",
            );
            setSubmitting(false);
            busy.current = false;
          }
        }}
      >
        <p className="checkout-demo-note">
          {t("FRONTEND DEMO — No real payment or order will be sent. Submitting saves your contact and address details only in this browser. Use sample information when trying it out.")} </p>
        <fieldset className="checkout-form-body" disabled={submitting}>
          <CheckoutFields
            section="contact"
            data={data}
            errors={errors}
            onChange={change}
            onBlur={(key) => {
              if (attempted)
                setErrors((previous) => ({
                  ...previous,
                  [key]: validateCheckout(data, confirmed)[key],
                }));
            }}
          />
          <CheckoutFields
            section="shipping"
            data={data}
            errors={errors}
            onChange={change}
            onBlur={(key) => {
              if (attempted)
                setErrors((previous) => ({
                  ...previous,
                  [key]: validateCheckout(data, confirmed)[key],
                }));
            }}
          />
          <fieldset className="checkout-section">
            <legend>
              <span>03</span>{t("DELIVERY METHOD")} </legend>
            <label className="checkout-option">
              <input
                type="radio"
                name="delivery"
                value="standard"
                defaultChecked
              />
              <Truck size={22} />
              <span>
                <strong>{t("STANDARD DELIVERY")}</strong>
                <small>
                  {t("Shipping cost will be confirmed when the product becomes available.")} </small>
                <em>{t("CALCULATED LATER")}</em>
              </span>
            </label>
          </fieldset>
          <fieldset className="checkout-section">
            <legend>
              <span>04</span>{t("PAYMENT METHOD")} </legend>
            <label className="checkout-option">
              <input type="radio" name="payment" value="demo" defaultChecked />
              <Wallet size={22} />
              <span>
                <strong>{t("DEMO CHECKOUT")}</strong>
                <small>
                  {t("No real payment will be processed. Payment details will be confirmed when Robo enters commercial release.")} </small>
              </span>
            </label>
          </fieldset>
          <section className="checkout-review" aria-labelledby="review-title">
            <h2 id="review-title">
              <span>05</span>{t("REVIEW YOUR ORDER")} </h2>
            <p>
              {t("Review your information and the selected products before continuing.")} </p>
            <label className="checkout-confirm">
              <input
                id="checkout-confirmed"
                type="checkbox"
                checked={confirmed}
                required
                aria-invalid={!!errors.confirmed}
                aria-describedby={
                  errors.confirmed ? "error-confirmed" : undefined
                }
                onChange={(event) => {
                  setConfirmed(event.target.checked);
                  setErrors((previous) => ({
                    ...previous,
                    confirmed: undefined,
                  }));
                }}
              />
              <span>{t("I confirm that the information above is correct.")}</span>
            </label>
            {errors.confirmed && (
              <p id="error-confirmed" className="checkout-field-error">
                {t(errors.confirmed)}
              </p>
            )}
            <button
              type="submit"
              className="button button-primary checkout-submit"
              disabled={submitting}
            >
              {t(submitting ? "PROCESSING..." : "PLACE ORDER")}
              {submitting ? (
                <span className="checkout-spinner" aria-hidden="true" />
              ) : (
                <ArrowUpRight size={18} />
              )}
            </button>
            <p className="checkout-payment-note">
              <Check size={14} />
              {t("No payment will be processed at this stage.")} </p>
          </section>
        </fieldset>
        {failure && (
          <p className="checkout-submit-error" role="alert">
            {t(failure)}
          </p>
        )}
        <a className="checkout-back" href="/cart">
          {t("← BACK TO CART")} </a>
      </form>
      <CheckoutSummary items={items} subtotal={getSubtotal()} />
    </div>
  );
}
export default function CheckoutPage() {
  const { t, localeTag } = useLanguage();
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
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
    <div className="checkout-page">
      <a href="#checkout-main" className="skip-link">
        {t("Skip to checkout")} </a>
      <Navbar homeHref="/" sectionPrefix="/" menu={menu} setMenu={setMenu} />
      <main id="checkout-main" className="checkout-main" inert={menu}>
        <nav className="checkout-breadcrumb" aria-label={t("Breadcrumb")}>
          <a href="/">{t("HOME")}</a>
          <span>/</span>
          <a href="/cart">{t("CART")}</a>
          <span>/</span>
          <span aria-current="page">{t("CHECKOUT")}</span>
        </nav>
        <header className="checkout-heading">
          <div>
            <h1>{t("CHECKOUT.")}</h1>
            <p>{t("Almost there. Your Robo is waiting.")}</p>
          </div>
          <ol className="checkout-progress" aria-label={t("Checkout progress")}>
            <li>
              <a href="/cart">{t("CART")}</a>
            </li>
            <li aria-current="step">{t("INFORMATION")}</li>
            <li>{t("REVIEW")}</li>
            <li>{t("DONE")}</li>
          </ol>
        </header>
        <CheckoutContent />
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
            {t("This is a frontend demonstration. Checkout saves your demo order, including contact and shipping details, in this browser only. No information is sent to a seller and no payment is collected. Final product, support and privacy details will be announced before release.")} </p>
        </Modal>
      )}
    </div>
  );
}
