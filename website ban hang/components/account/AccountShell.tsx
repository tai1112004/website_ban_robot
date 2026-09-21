"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState, type ReactNode } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Modal } from "../ui/Modal";
export default function AccountShell({
  children,
  active,
}: {
  children: ReactNode;
  active: "overview" | "orders" | "robots";
}) {
  const { t } = useLanguage();
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
    <div className="account-page">
      <a className="skip-link" href="#account-main">
        {t("Skip to account content")} </a>
      <Navbar homeHref="/" sectionPrefix="/" menu={menu} setMenu={setMenu} />
      <main id="account-main" className="account-main" inert={menu}>
        <nav className="account-navigation" aria-label={t("Account navigation")}>
          <a
            href="/account"
            aria-current={active === "overview" ? "page" : undefined}
          >
            {t("OVERVIEW")} </a>
          <a
            href="/orders"
            aria-current={active === "orders" ? "page" : undefined}
          >
            {t("ORDERS")} </a>
          <a
            href="/my-robots"
            aria-current={active === "robots" ? "page" : undefined}
          >
            {t("MY ROBOTS")} </a>
          <button disabled>
            {t("SETTINGS")} <small>{t("SOON")}</small>
          </button>
        </nav>
        <p className="account-demo">
          {t("LOCAL DEMO / Orders and Robos saved in this browser. No login or live tracking.")} </p>
        {children}
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
            {t("This customer area shows demo orders stored in this browser. It is not a signed-in account. No order, payment, email or device connection is sent to a service.")} </p>
        </Modal>
      )}
    </div>
  );
}
