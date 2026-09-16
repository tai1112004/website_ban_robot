"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { getLastOrder } from "@/lib/orders";
import { Button } from "../ui/Button";
export default function OrderSuccess() {
  const [id, setId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      setId(getLastOrder()?.id ?? null);
    } catch {
      setId(null);
    }
    setReady(true);
  }, []);
  return (
    <main className="checkout-success">
      <a className="checkout-success-brand" href="/">
        ROBO AI
      </a>
      <div className="checkout-success-mark">
        <Check size={32} />
      </div>
      <p className="eyebrow">FRONTEND DEMO</p>
      <h1>
        {!ready ? "LOADING..." : id ? "DEMO ORDER SAVED." : "NO RECENT ORDER."}
      </h1>
      {id && <p className="checkout-success-id">{id}</p>}
      <p>
        {id
          ? "Your demo order is saved in this browser. Nothing was sent to a seller and no payment was processed."
          : "Create a demo order from your cart to preview this confirmation."}
      </p>
      <div className="button-row">
        <Button href="/">BACK TO HOME</Button>
        <Button href="/cart" secondary>
          GO TO CART
        </Button>
      </div>
    </main>
  );
}
