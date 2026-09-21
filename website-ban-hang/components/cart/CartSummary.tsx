"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "../ui/Button";
import { formatCartPrice } from "@/lib/cart";
export default function CartSummary({
  count,
  subtotal,
  currency,
}: {
  count: number;
  subtotal: number | null;
  currency: string;
}) {
  const { t, localeTag } = useLanguage();
  return (
    <aside className="cart-summary" aria-labelledby="summary-title">
      <h2 id="summary-title">{t("ORDER SUMMARY")}</h2>
      <dl>
        <div>
          <dt>{t("Items")}</dt>
          <dd>
            {count} {t(count === 1 ? "item" : "items")}
          </dd>
        </div>
        <div>
          <dt>{t("Subtotal")}</dt>
          <dd>{t(formatCartPrice(subtotal, currency, localeTag))}</dd>
        </div>
        <div>
          <dt>{t("Shipping")}</dt>
          <dd>{t("Calculated later")}</dd>
        </div>
        <div className="cart-total">
          <dt>{t("Total")}</dt>
          <dd>
            {t(subtotal === null
              ? "TO BE ANNOUNCED"
              : formatCartPrice(subtotal, currency, localeTag))}
          </dd>
        </div>
      </dl>
      <Button href="/checkout">{t("PROCEED TO CHECKOUT")}</Button>
      <p className="cart-checkout-note">
        {t("Continue to demo checkout. No real payment will be processed.")} {subtotal !== null && (
          <>
            <br />
            {t("Displayed total excludes shipping.")} </>
        )}
      </p>
    </aside>
  );
}
