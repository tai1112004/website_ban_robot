"use client";
import { Plus } from "lucide-react";
import { productFAQ } from "@/data/products";
import Heading from "./ProductSectionHeading";
export default function ProductFAQ() {
  return (
    <section className="pdp-section pdp-faq">
      <Heading index="10" label="A FEW THINGS TO KNOW">
        GOOD QUESTIONS.
        <br />
        <span className="accent">HONEST ANSWERS.</span>
      </Heading>
      <div>
        {productFAQ.map((item) => (
          <details key={item.question}>
            <summary>
              {item.question}
              <Plus size={18} />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
