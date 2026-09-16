"use client";
import Image from "next/image";
import { Check, ArrowUpRight } from "lucide-react";
import { productPrice, type ProductModel } from "@/data/products";
import Heading from "./ProductSectionHeading";
export default function ProductCTA({
  product,
  onInterest,
  onContact,
}: {
  product: ProductModel;
  onInterest: () => void;
  onContact: () => void;
}) {
  return (
    <section className="pdp-section pdp-split pdp-buy">
      <div className="pdp-cutout">
        <Image
          src={product.media.cutout}
          alt={`${product.name} companion`}
          fill
          sizes="(max-width:767px) 90vw, 45vw"
        />
      </div>
      <div>
        <Heading index="09" label="YOUR NEXT COMPANION">
          MEET YOUR
          <br />
          <span className="accent">{product.name.toUpperCase()}.</span>
        </Heading>
        <p className="pdp-price">{productPrice(product)}</p>
        <ul>
          {product.includes.map((item) => (
            <li key={item}>
              <Check size={15} />
              {item}
            </li>
          ))}
        </ul>
        <button className="button button-primary" onClick={onInterest}>
          JOIN PRE-ORDER LIST <ArrowUpRight size={17} />
        </button>
        <button className="pdp-text-button" onClick={onContact}>
          CONTACT US <ArrowUpRight size={16} />
        </button>
      </div>
    </section>
  );
}
