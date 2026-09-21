"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Minus, Plus } from "lucide-react";
import { MAX_QUANTITY } from "@/lib/cart";
export default function QuantitySelector({
  name,
  quantity,
  onChange,
  disabled,
}: {
  name: string;
  quantity: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div className="cart-quantity" role="group" aria-label={t("{value0} quantity", { value0: name })}>
      <button
        aria-label={t("Decrease {value0} quantity", { value0: name })}
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus size={14} />
      </button>
      <output aria-live="polite" aria-label={t("{value0} quantity", { value0: name })}>
        {quantity}
      </output>
      <button
        aria-label={t("Increase {value0} quantity", { value0: name })}
        disabled={disabled || quantity >= MAX_QUANTITY}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
