import { Button } from "../ui/Button";
import { formatCartPrice } from "@/lib/cart";
export default function CartSummary({
  count,
  subtotal,
  currency,
}: {
  count: number;
  subtotal: number | null;
  currency: string;
}) {
  return (
    <aside className="cart-summary" aria-labelledby="summary-title">
      <h2 id="summary-title">ORDER SUMMARY</h2>
      <dl>
        <div>
          <dt>Items</dt>
          <dd>
            {count} {count === 1 ? "item" : "items"}
          </dd>
        </div>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatCartPrice(subtotal, currency)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>Calculated later</dd>
        </div>
        <div className="cart-total">
          <dt>Total</dt>
          <dd>
            {subtotal === null
              ? "TO BE ANNOUNCED"
              : formatCartPrice(subtotal, currency)}
          </dd>
        </div>
      </dl>
      <Button href="/checkout">PROCEED TO CHECKOUT</Button>
      <p className="cart-checkout-note">
        Continue to demo checkout. No real payment will be processed.
        {subtotal !== null && (
          <>
            <br />
            Displayed total excludes shipping.
          </>
        )}
      </p>
    </aside>
  );
}
