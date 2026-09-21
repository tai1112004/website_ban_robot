"use client";
import { useLanguage } from "@/context/LanguageContext";
export default function OrderTimeline() {
  const { t } = useLanguage();
  return (
    <section className="order-next" aria-labelledby="order-next-title">
      <p className="eyebrow">{t("LOOKING AHEAD")}</p>
      <h2 id="order-next-title">{t("WHAT HAPPENS NEXT?")}</h2>
      <p className="order-next-note">
        {t("A preview of the future order journey. This demo does not trigger confirmation emails or delivery.")} </p>
      <ol>
        {[
          {
            title: "ORDER RECEIVED",
            text: "Your Robo order request has been saved in this browser for this demonstration.",
          },
          {
            title: "CONFIRMATION",
            text: "Product availability, pricing and delivery details will be confirmed when Robo enters the next commercial stage.",
          },
          {
            title: "ROBO DELIVERY",
            text: "When Robo becomes available, delivery and device setup information will be shared. No delivery date is confirmed yet.",
          },
        ].map((step, index) => (
          <li key={step.title}>
            <span>0{index + 1}</span>
            <h3>{t(step.title)}</h3>
            <p>{t(step.text)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
