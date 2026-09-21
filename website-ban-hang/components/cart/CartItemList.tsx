"use client";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

// Only cart contents and the navbar badge subscribe to quantity changes.
export default function CartItemList() {
  const { t } = useLanguage();
  const {
    items,
    ready,
    storageUnavailable,
    removeItem,
    updateQuantity,
    getTotalItems,
    getSubtotal,
  } = useCart();
  const count = getTotalItems();
  return (
    <>
      {storageUnavailable && (
        <p className="cart-storage-note" role="status">
          {t("Browser storage is unavailable. Changes remain in this page, but may be lost when you leave or reload.")} </p>
      )}
      {!ready ? (
        <p className="cart-loading" role="status">
          {t("Loading your cart…")} </p>
      ) : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="cart-layout">
          <section aria-label={t("Cart items")}>
            <p className="cart-items-heading">
              {count} {t(count === 1 ? "ITEM" : "ITEMS")}
            </p>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onQuantity={updateQuantity}
              />
            ))}
            <p className="cart-limit">
              {t("Up to 5 of each model per cart in this preview. Adding an item does not reserve stock or place an order.")} </p>
            <a className="cart-continue" href="/#models">
              <ArrowLeft size={15} />
              {t("CONTINUE EXPLORING")} </a>
          </section>
          <CartSummary
            count={count}
            subtotal={getSubtotal()}
            currency={items[0].currency}
          />
        </div>
      )}
    </>
  );
}
