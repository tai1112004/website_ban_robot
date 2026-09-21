"use client";
import { useLanguage } from "@/context/LanguageContext";
export function RobotLoading() {
  const { t, localeTag } = useLanguage();
  return (
    <div
      className="robot-grid"
      role="status"
      aria-label={t("Loading Robos")}
      aria-busy="true"
    >
      <div className="robot-skeleton" />
      <div className="robot-skeleton" />
      <span className="sr-only">{t("Loading your Robos...")}</span>
    </div>
  );
}
export function RobotError({ retry }: { retry: () => void }) {
  const { t, localeTag } = useLanguage();
  return (
    <section className="account-empty" role="alert">
      <h2>{t("WE COULDN'T LOAD YOUR ROBOS.")}</h2>
      <p>
        {t("Your device data could not be read. Try again when storage or the service is available.")} </p>
      <button className="button button-primary" onClick={retry}>
        {t("TRY AGAIN")} </button>
    </section>
  );
}
