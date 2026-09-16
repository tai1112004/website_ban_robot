"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/Button";
import { roboBasic } from "@/data/products";
export default function EmptyCart() {
  const [failed, setFailed] = useState(false);
  return (
    <section className="cart-empty">
      <div className="cart-empty-image">
        {!failed && (
          <Image
            src={roboBasic.media.cutout}
            alt="Robo waiting to meet you"
            fill
            sizes="(max-width:767px) 85vw, 40vw"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div>
        <h2>
          YOUR CART IS
          <br />
          <span>FEELING A LITTLE EMPTY.</span>
        </h2>
        <p>Your future AI companion is waiting.</p>
        <div className="cart-empty-actions">
          <Button href="/#models">DISCOVER ROBO</Button>
          <Button href="/products/basic" secondary>
            EXPLORE BASIC
          </Button>
        </div>
      </div>
    </section>
  );
}
