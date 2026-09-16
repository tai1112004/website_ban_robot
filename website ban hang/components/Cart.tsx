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
  return (
    <Modal title="Your bag" onClose={onClose} drawer>
      {count === 0 ? (
        <div className="empty-cart">
          <ShoppingBag size={40} strokeWidth={1} />
          <h3>A little room for Robo.</h3>
          <p>Your bag is currently empty.</p>
          <a className="button button-primary" href="#shop" onClick={onClose}>
            MEET ROBO ↗
          </a>
        </div>
      ) : (
        <>
          <div className="cart-product">
            <Image
              src="/images/robot_phongtrang.png"
              width={130}
              height={150}
              alt="Robo AI One"
            />
            <div>
              <h3>Robo AI One</h3>
              <p>Orange / White</p>
              <strong>$499</strong>
              <div className="quantity">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setCount(Math.max(0, count - 1))}
                >
                  <Minus size={14} />
                </button>
                <output aria-label="Quantity">{count}</output>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setCount(count + 1)}
                >
                  <Plus size={14} />
                </button>
                <button
                  aria-label="Remove Robo from cart"
                  onClick={() => setCount(0)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="cart-total">
            <span>Subtotal</span>
            <strong>${(count * 499).toLocaleString("en-US")}</strong>
          </div>
          <button className="button button-primary checkout" disabled>
            CHECKOUT — COMING SOON
          </button>
          <p className="demo-note">
            This is a demo store. No payment or order will be processed.
          </p>
        </>
      )}
    </Modal>
  );
}
