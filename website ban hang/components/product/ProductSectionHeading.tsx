import type { ReactNode } from "react";
export default function Heading({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="pdp-heading" data-pdp-reveal>
      <p className="eyebrow">
        {index} / {label}
      </p>
      <h2>{children}</h2>
    </div>
  );
}
