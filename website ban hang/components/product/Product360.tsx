"use client";
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
  return (
    <section className="pdp-section pdp-turntable">
      <Heading index="01" label="EVERY ANGLE. ONE COMPANION.">
        GET TO KNOW
        <br />
        <span className="accent">ROBO.</span>
      </Heading>
      <ViewportVideo
        src={product.media.turntable}
        poster={product.media.gallery[1].src}
        label="360 degree product video"
        suspended={suspended}
      />
      <div className="pdp-media-foot">
        <span>A CLOSER LOOK AT {product.name.toUpperCase()}</span>
        <span>360° PRODUCT VIEW</span>
      </div>
    </section>
  );
}
