"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MAX_QUANTITY } from "@/lib/cart";
import type { ProductModel } from "@/data/products";
export default function AddToCart({ product }: { product: ProductModel }) {
  const { t } = useLanguage();
  const { addItem, items, ready, storageUnavailable } = useCart();
  const [show, setShow] = useState(false);
  const quantity = items.find((item) => item.id === product.id)?.quantity ?? 0;
  return (
    <>
      <button
        className="button button-primary cart-add-button"
        disabled={!ready || quantity >= MAX_QUANTITY}
        onClick={() => {
          addItem(product);
          setShow(true);
        }}
      >
        {" "}
        {t(quantity >= MAX_QUANTITY ? "MAXIMUM 5 PER CART" : "ADD TO CART")}{" "}
        <ShoppingBag size={17} />
      </button>
      {show &&
        createPortal(
          <aside
            className="cart-added"
            aria-label={t("Cart confirmation")}
            onKeyDown={(event) => {
              if (event.key === "Escape") setShow(false);
            }}
          >
            <button
              className="cart-added-close"
              aria-label={t("Dismiss cart confirmation")}
              onClick={() => setShow(false)}
            >
              <X size={18} />
            </button>
            <div role="status">
              <p className="eyebrow">{t("ADDED TO CART")}</p>
              <p>{t("{name} has been added to your cart.", { name: product.name })}</p>
              {storageUnavailable && (
                <p>
                  {t("Browser storage is unavailable. Your cart may not survive a reload.")} </p>
              )}
            </div>
            <div className="cart-added-actions">
              <a href="/cart" className="button button-primary">
                {t("VIEW CART")} <span aria-hidden="true">↗</span>
              </a>
              <button onClick={() => setShow(false)}>{t("CONTINUE SHOPPING")}</button>
            </div>
          </aside>,
          document.body,
        )}
    </>
  );
}
