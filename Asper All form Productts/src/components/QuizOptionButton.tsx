import type { ReactNode } from "react";

/**
 * The "3-Click Solution" — Quiz option with Gold Stitch for selected state.
 * Gold border + ring indicates selection (like checking a medical form).
 */
export function QuizOptionButton({
  children,
  isSelected,
  onClick,
  className = "",
}: {
  children: ReactNode;
  isSelected: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full p-4 text-left bg-white
        border transition-all duration-200
        ${
        isSelected
          ? "border-shiny-gold ring-1 ring-shiny-gold bg-soft-ivory"
          : "border-gray-100 hover:border-shiny-gold/50"
      }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
