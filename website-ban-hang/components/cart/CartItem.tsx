"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import type { CartItem as Item } from "@/types/cart";
import { formatCartPrice } from "@/lib/cart";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import QuantitySelector from "./QuantitySelector";
export default function CartItem({
  item,
  onRemove,
  onQuantity,
}: {
  item: Item;
  onRemove: (id: string) => void;
  onQuantity: (id: string, quantity: number) => void;
}) {
  const { t, localeTag } = useLanguage();
  const [failed, setFailed] = useState(false);
  const [removing, setRemoving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <article
      className={`cart-item ${removing ? "is-removing" : ""}`}
      aria-label={item.name}
    >
      <a
        href={`/products/${item.slug}`}
        className="cart-image"
        aria-label={t("View {value0}", { value0: item.name })}
      >
        {failed ? (
          <span>{t("Product preview unavailable")}</span>
        ) : (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width:767px) 90vw, 300px"
            onError={() => setFailed(true)}
          />
        )}
      </a>
      <div className="cart-item-info">
        <h2>
          <a href={`/products/${item.slug}`}>{item.name.toUpperCase()}</a>
        </h2>
        <p>{t(item.tagline)}</p>
        <dl className="cart-item-meta">
          <div>
            <dt>{t("Model")}</dt>
            <dd>{item.model}</dd>
          </div>
          <div>
            <dt>{t("Availability")}</dt>
            <dd>{t(item.availability)}</dd>
          </div>
        </dl>
        <p className="cart-item-price">
          {t(item.price === null
            ? "PRICE TO BE ANNOUNCED"
            : formatCartPrice(item.price, item.currency, localeTag))}
        </p>
        <span className="cart-quantity-label">{t("Quantity")}</span>
        <QuantitySelector
          name={item.name}
          quantity={item.quantity}
          disabled={removing}
          onChange={(quantity) => onQuantity(item.id, quantity)}
        />
        <button
          className="cart-remove"
          disabled={removing}
          aria-label={t("Remove {value0} from cart", { value0: item.name })}
          onClick={() => {
            setRemoving(true);
            if (reduced) onRemove(item.id);
            else timer.current = setTimeout(() => onRemove(item.id), 180);
          }}
        >
          <Trash2 size={13} />
          {t("REMOVE")} </button>
      </div>
    </article>
  );
}
