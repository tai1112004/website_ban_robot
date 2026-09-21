"use client";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { modelLinks, productPrice, type ProductModel } from "@/data/products";
import ProductGallery from "./ProductGallery";
import AddToCart from "../cart/AddToCart";
export default function ProductHero({
  product,
  onInterest,
}: {
  product: ProductModel;
  onInterest: () => void;
}) {
  const { t, localeTag } = useLanguage();
  return (
    <section id="product" className="pdp-hero">
      <nav className="pdp-breadcrumb" aria-label={t("Breadcrumb")}>
        <a href="/">{t("Home")}</a>
        <span>/</span>
        <a href="/#models">{t("Models")}</a>
        <span>/</span>
        <span aria-current="page">{t(product.name)}</span>
      </nav>
      <div className="pdp-hero-layout">
        <ProductGallery images={product.media.gallery} />
        <div className="pdp-hero-copy" data-pdp-hero>
          <p className="eyebrow">
            <span className="status-dot" />  {t("ROBO AI")}{" "}
            <span className="pdp-coming">{t(product.availability)}</span>
          </p>
          <h1>{t(product.name.toUpperCase())}</h1>
          <p className="pdp-hero-tagline">{t(product.tagline)}</p>
          <p className="pdp-hero-description">
            {product.description.map((line) => (
              <span key={line}>{t(line)}</span>
            ))}
          </p>
          <span className="pdp-category">{t("AI COMPANION ROBOT")}</span>
          <div className="pdp-model-selector" aria-label={t("Select a model")}>
            {modelLinks.map((model) => (
              <a
                key={model.id}
                href={model.href}
                aria-current={product.id === model.id ? "page" : undefined}
              >
                {model.name.toUpperCase()}
              </a>
            ))}
          </div>
          <p className="pdp-price">{t(productPrice(product, localeTag))}</p>
          <AddToCart product={product} />
          <button
            className="button button-secondary pdp-interest-button"
            onClick={onInterest}
          >
            {t("PRE-ORDER INTEREST")} <ArrowUpRight size={18} />
          </button>
          <a className="pdp-secondary-link" href="#features">
            {t("EXPLORE FEATURES")} <ArrowDown size={15} />
          </a>
          <p className="pdp-development-note">
            {t("A first look at what’s next.")} <br />
            {t("Currently in development. No payment required.")} </p>
        </div>
      </div>
    </section>
  );
}
