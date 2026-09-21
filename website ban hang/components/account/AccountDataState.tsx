"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "../ui/Button";
export function LoadingOrders() {
  const { t, localeTag } = useLanguage();
  return (
    <p className="account-loading" role="status">
      {t("LOADING ORDERS...")} </p>
  );
}
export function OrdersError({ retry }: { retry: () => void }) {
  const { t, localeTag } = useLanguage();
  return (
    <section className="account-empty">
      <h2>{t("ORDERS UNAVAILABLE.")}</h2>
      <p>
        {t("Your browser could not read local order history. Check storage permissions and try again.")} </p>
      <Button onClick={retry}>{t("TRY AGAIN")}</Button>
    </section>
  );
}
