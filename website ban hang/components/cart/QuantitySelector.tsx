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
  return (
    <div className="cart-quantity" role="group" aria-label={`${name} quantity`}>
      <button
        aria-label={`Decrease ${name} quantity`}
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus size={14} />
      </button>
      <output aria-live="polite" aria-label={`${name} quantity`}>
        {quantity}
      </output>
      <button
        aria-label={`Increase ${name} quantity`}
        disabled={disabled || quantity >= MAX_QUANTITY}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
