"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Plus } from "lucide-react";
import { productFAQ } from "@/data/products";
import Heading from "./ProductSectionHeading";
export default function ProductFAQ() {
  const { t } = useLanguage();
  return (
    <section className="pdp-section pdp-faq">
      <Heading index="10" label={t("A FEW THINGS TO KNOW")}>
        {t("GOOD QUESTIONS.")} <br />
        <span className="accent">{t("HONEST ANSWERS.")}</span>
      </Heading>
      <div>
        {productFAQ.map((item) => (
          <details key={item.question}>
            <summary>
              {t(item.question)}
              <Plus size={18} />
            </summary>
            <p>{t(item.answer)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
