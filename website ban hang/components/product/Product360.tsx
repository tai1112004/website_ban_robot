"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { ProductModel } from "@/data/products";
import ViewportVideo from "./ViewportVideo";
import Heading from "./ProductSectionHeading";
export default function Product360({
  product,
  suspended,
}: {
  product: ProductModel;
  suspended: boolean;
}) {
  const { t } = useLanguage();
  return (
    <section className="pdp-section pdp-turntable">
      <Heading index="01" label={t("EVERY ANGLE. ONE COMPANION.")}>
        {t("GET TO KNOW")} <br />
        <span className="accent">{t("ROBO.")}</span>
      </Heading>
      <ViewportVideo
        src={product.media.turntable}
        poster={product.media.gallery[1].src}
        label={t("360 degree product video")}
        suspended={suspended}
      />
      <div className="pdp-media-foot">
        <span>{t("A CLOSER LOOK AT")} {t(product.name.toUpperCase())}</span>
        <span>{t("360° PRODUCT VIEW")}</span>
      </div>
    </section>
  );
}
