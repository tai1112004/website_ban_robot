import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  secondary?: boolean;
  className?: string;
};
export function Button({
  children,
  href,
  onClick,
  secondary,
  className = "",
}: Props) {
  const styles = `button ${secondary ? "button-secondary" : "button-primary"} ${className}`;
  return href ? (
    <a className={styles} href={href}>
      {children}
      <ArrowUpRight size={17} />
    </a>
  ) : (
    <button className={styles} onClick={onClick}>
      {children}
      <ArrowUpRight size={17} />
    </button>
  );
}
