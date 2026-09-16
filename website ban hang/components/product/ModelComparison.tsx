"use client";
import { Check, Minus } from "lucide-react";
import { comparison, modelLinks, type ProductModel } from "@/data/products";
import Heading from "./ProductSectionHeading";
export default function ModelComparison({
  product,
}: {
  product: ProductModel;
}) {
  const cell = (value: boolean | string) =>
    typeof value === "string" ? (
      value
    ) : value ? (
      <>
        <Check size={17} aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    ) : (
      <>
        <Minus size={16} aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    );
  return (
    <section id="models" className="pdp-section pdp-comparison">
      <Heading index="08" label="FIND YOUR COMPANION">
        YOUR WORLD.
        <br />
        <span className="accent">YOUR ROBO.</span>
      </Heading>
      <div className="pdp-basic-features">
        <h3>{product.name.toUpperCase()}, AT A GLANCE.</h3>
        <div>
          {product.features.map((feature) => (
            <span key={feature}>
              <Check size={15} />
              {feature}
            </span>
          ))}
        </div>
        <p className="pdp-fine">
          Prototype preview. Features and specifications may evolve.
        </p>
      </div>
      <p className="pdp-table-hint">SWIPE TO COMPARE MODELS →</p>
      <div
        className="pdp-table-scroll"
        role="region"
        aria-label="Compare Robo models"
        tabIndex={0}
      >
        <table>
          <caption className="sr-only">Planned features by Robo model</caption>
          <thead>
            <tr>
              <th scope="col">FIND YOUR FIT</th>
              {modelLinks.map((model) => (
                <th
                  key={model.id}
                  scope="col"
                  className={model.id === product.id ? "is-current" : ""}
                >
                  ROBO {model.name.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.feature}>
                <th scope="row">{row.feature}</th>
                {modelLinks.map((model) => (
                  <td
                    key={model.id}
                    className={model.id === product.id ? "is-current" : ""}
                  >
                    {cell(row[model.id])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              {modelLinks.map((model) => (
                <td
                  key={model.id}
                  className={model.id === product.id ? "is-current" : ""}
                >
                  {model.id === product.id ? (
                    "YOU'RE VIEWING THIS"
                  ) : (
                    <a href={model.href}>
                      EXPLORE {model.name.toUpperCase()} ↗
                    </a>
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
