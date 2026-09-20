"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Modal } from "./ui/Modal";
export default function Cart({
  count,
  setCount,
  onClose,
}: {
  count: number;
  setCount: (value: number) => void;
  onClose: () => void;
}) {
  const { t, localeTag } = useLanguage();
  return (
    <Modal title={t("Your bag")} onClose={onClose} drawer>
      {count === 0 ? (
        <div className="empty-cart">
          <ShoppingBag size={40} strokeWidth={1} />
          <h3>{t("A little room for Robo.")}</h3>
          <p>{t("Your bag is currently empty.")}</p>
          <a className="button button-primary" href="#shop" onClick={onClose}>
            {t("MEET ROBO ↗")} </a>
        </div>
      ) : (
        <>
          <div className="cart-product">
            <Image
              src="/images/robot_phongtrang.png"
              width={130}
              height={150}
              alt={t("Robo AI One")}
            />
            <div>
              <h3>{t("Robo AI One")}</h3>
              <p>{t("Orange / White")}</p>
              <strong>$499</strong>
              <div className="quantity">
                <button
                  aria-label={t("Decrease quantity")}
                  onClick={() => setCount(Math.max(0, count - 1))}
                >
                  <Minus size={14} />
                </button>
                <output aria-label={t("Quantity")}>{count}</output>
                <button
                  aria-label={t("Increase quantity")}
                  onClick={() => setCount(count + 1)}
                >
                  <Plus size={14} />
                </button>
                <button
                  aria-label={t("Remove Robo from cart")}
                  onClick={() => setCount(0)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="cart-total">
            <span>{t("Subtotal")}</span>
            <strong>${t((count * 499).toLocaleString(localeTag))}</strong>
          </div>
          <button className="button button-primary checkout" disabled>
            {t("CHECKOUT — COMING SOON")} </button>
          <p className="demo-note">
            {t("This is a demo store. No payment or order will be processed.")} </p>
        </>
      )}
    </Modal>
  );
}
