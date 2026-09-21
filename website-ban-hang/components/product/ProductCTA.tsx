"use client";
import { useLanguage } from "@/context/LanguageContext";
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
  const { t, localeTag } = useLanguage();
  return (
    <section className="pdp-section pdp-split pdp-buy">
      <div className="pdp-cutout">
        <Image
          src={product.media.cutout}
          alt={t("{value0} companion", { value0: product.name })}
          fill
          sizes="(max-width:767px) 90vw, 45vw"
        />
      </div>
      <div>
        <Heading index="09" label={t("YOUR NEXT COMPANION")}>
          {t("MEET YOUR")} <br />
          <span className="accent">{t(product.name.toUpperCase())}.</span>
        </Heading>
        <p className="pdp-price">{t(productPrice(product, localeTag))}</p>
        <ul>
          {product.includes.map((item) => (
            <li key={item}>
              <Check size={15} />
              {t(item)}
            </li>
          ))}
        </ul>
        <button className="button button-primary" onClick={onInterest}>
          {t("JOIN PRE-ORDER LIST")} <ArrowUpRight size={17} />
        </button>
        <button className="pdp-text-button" onClick={onContact}>
          {t("CONTACT US")} <ArrowUpRight size={16} />
        </button>
      </div>
    </section>
  );
}
