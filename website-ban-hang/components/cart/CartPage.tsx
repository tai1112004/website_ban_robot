"use client";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Modal } from "../ui/Modal";
import CartItemList from "./CartItemList";
import { useLanguage } from "@/context/LanguageContext";
export default function CartPage() {
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
    <div className="cart-page">
      <a href="#cart-main" className="skip-link">
        {t("Skip to cart")} </a>
      <Navbar homeHref="/" sectionPrefix="/" menu={menu} setMenu={setMenu} />
      <main id="cart-main" className="cart-main" inert={menu}>
        <nav className="cart-breadcrumb" aria-label={t("Breadcrumb")}>
          <a href="/">{t("HOME")}</a>
          <span>/</span>
          <span aria-current="page">{t("CART")}</span>
        </nav>
        <header className="cart-heading">
          <h1>{t("YOUR CART.")}</h1>
          <p>{t("Your Robo is almost ready to meet you.")}</p>
        </header>
        <CartItemList />
      </main>
      <div inert={menu}>
        <Footer
          info={setInfo}
          homeHref="/"
          overviewHref="/"
          sectionPrefix="/"
        />
      </div>
      {info && (
        <Modal title={t(info)} onClose={() => setInfo(null)}>
          <p className="info-copy">
            {t("Robo is currently in development. Pricing, release details and official support information will be announced later. This cart stores product selections in your browser only and does not place an order or collect payment.")} </p>
        </Modal>
      )}
    </div>
  );
}
