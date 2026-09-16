"use client";
import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";
import { hardware, type ProductModel } from "@/data/products";
import Heading from "./ProductSectionHeading";
export default function InsideRobot({ product }: { product: ProductModel }) {
  const [active, setActive] = useState(0);
  return (
    <section id="technology" className="pdp-section pdp-inside">
      <Heading index="06" label="INSIDE ROBO">
        THOUGHTFULLY BUILT.
        <br />
        <span>FROM THE INSIDE.</span>
      </Heading>
      <div className="pdp-inside-layout">
        <div className="pdp-exploded">
          <Image
            src={product.media.exploded}
            alt="Exploded view of Robo's components"
            fill
            sizes="(max-width:767px) 90vw, 60vw"
          />
          {hardware.map((item, i) => (
            <button
              key={item.name}
              className={`pdp-hotspot pdp-hotspot-${i} ${active === i ? "is-active" : ""}`}
              aria-label={item.name}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div className="pdp-hardware-list">
          {hardware.map((item, i) => (
            <div key={item.name} className={active === i ? "is-active" : ""}>
              <button
                aria-expanded={active === i}
                aria-controls={`hardware-${i}`}
                onClick={() => setActive(i)}
              >
                <span>0{i + 1}</span>
                {item.name}
                <Plus size={16} />
              </button>
              <p id={`hardware-${i}`} hidden={active !== i}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
