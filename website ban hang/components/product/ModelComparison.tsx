"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Check, Minus } from "lucide-react";
import { comparison, modelLinks, type ProductModel } from "@/data/products";
import Heading from "./ProductSectionHeading";
export default function ModelComparison({
  product,
}: {
  product: ProductModel;
}) {
  const { t } = useLanguage();
  const cell = (value: boolean | string) =>
    typeof value === "string" ? (
      t(value)
    ) : value ? (
      <>
        <Check size={17} aria-hidden="true" />
        <span className="sr-only">{t("Included")}</span>
      </>
    ) : (
      <>
        <Minus size={16} aria-hidden="true" />
        <span className="sr-only">{t("Not included")}</span>
      </>
    );
  return (
    <section id="models" className="pdp-section pdp-comparison">
      <Heading index="08" label={t("FIND YOUR COMPANION")}>
        {t("YOUR WORLD.")} <br />
        <span className="accent">{t("YOUR ROBO.")}</span>
      </Heading>
      <div className="pdp-basic-features">
        <h3>{t(product.name.toUpperCase())}{t(", AT A GLANCE.")}</h3>
        <div>
          {product.features.map((feature) => (
            <span key={feature}>
              <Check size={15} />
              {t(feature)}
            </span>
          ))}
        </div>
        <p className="pdp-fine">
          {t("Prototype preview. Features and specifications may evolve.")} </p>
      </div>
      <p className="pdp-table-hint">{t("SWIPE TO COMPARE MODELS →")}</p>
      <div
        className="pdp-table-scroll"
        role="region"
        aria-label={t("Compare Robo models")}
        tabIndex={0}
      >
        <table>
          <caption className="sr-only">{t("Planned features by Robo model")}</caption>
          <thead>
            <tr>
              <th scope="col">{t("FIND YOUR FIT")}</th>
              {modelLinks.map((model) => (
                <th
                  key={model.id}
                  scope="col"
                  className={model.id === product.id ? "is-current" : ""}
                >
                  {t("ROBO")} {model.name.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.feature}>
                <th scope="row">{t(row.feature)}</th>
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
                    t("YOU'RE VIEWING THIS")
                  ) : (
                    <a href={model.href}>
                      {t("EXPLORE")} {model.name.toUpperCase()} ↗
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
