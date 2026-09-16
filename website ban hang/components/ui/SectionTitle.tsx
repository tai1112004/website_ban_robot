import type { ReactNode } from "react";
export function SectionTitle({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div data-reveal>
      <p className="eyebrow">
        <span>{index} /</span> {label}
      </p>
      <h2>{children}</h2>
    </div>
  );
}
