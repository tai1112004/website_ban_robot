"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "../ui/Button";
import OrderImage from "./OrderImage";
import { roboBasic } from "@/data/products";
export default function EmptyOrders() {
  const { t } = useLanguage();
  return (
    <section className="history-empty">
      <OrderImage
        src={roboBasic.media.cutout}
        name="Robo waiting to meet you"
        cutout
      />
      <div>
        <h2>{t("NO ORDERS YET.")}</h2>
        <p>{t("Your future AI companion is waiting.")}</p>
        <div className="button-row">
          <Button href="/#models">{t("DISCOVER ROBO")}</Button>
          <Button href="/account" secondary>
            {t("BACK TO ACCOUNT")} </Button>
        </div>
      </div>
    </section>
  );
}
