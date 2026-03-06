import type { ReactNode } from "react";

/**
 * The "Digital Tray" — Wrapper with Gold Stitch (Seal of Authenticity).
 * Transparent border prevents layout shift; gold border appears on hover.
 * Use for custom product layouts or alternate card designs.
 */
export function ProductCardTray({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        group relative
        bg-white
        border border-transparent
        hover:border-shiny-gold
        transition-all duration-300 ease-out
        rounded-sm shadow-sm hover:shadow-md
        ${className}
      `}
    >
      {children}
    </div>
  );
}
