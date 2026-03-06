import { Eye, Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  handle: string;
  isAvailable?: boolean;
  onAddToCart?: (id: string) => void;
}

export const ProductCard = ({
  id,
  title,
  brand,
  price,
  image,
  handle,
  isAvailable = true,
  onAddToCart,
}: ProductCardProps) => {
  return (
    <div className="group relative flex flex-col h-full">
      {
        /* Authentic Quality / Midas Touch [Source 36, 103, 126, 216]:
         - Surface: Pure White #FFFFFF on Soft Ivory page
         - Resting: 1px transparent border (no layout shift on hover)
         - Hover: 1px Solid Gold #C5A028 + subtle gold glow = "Seal of Authenticity"
         - Transition: 400ms ease-in-out (deliberate, premium)
      */
      }
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-sm bg-white",
          "border border-transparent transition-all duration-400 ease-in-out",
          "group-hover:border-shiny-gold group-hover:shadow-midas-glow",
        )}
      >
        {/* Product Image: "Clean Science" Style */}
        <Link to={`/products/${handle}`} className="block h-full w-full">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Wishlist & Quick View Actions (Fade in on Hover) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          <button
            className="rounded-full bg-white/90 p-2 text-dark-charcoal hover:text-maroon hover:bg-white shadow-sm transition-colors"
            aria-label="Add to Wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            className="rounded-full bg-white/90 p-2 text-dark-charcoal hover:text-maroon hover:bg-white shadow-sm transition-colors"
            aria-label="Quick View"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Primary action: Maroon #800020 "Quick Add" — anchors the card [Source 36, 179] */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={() => onAddToCart?.(id)}
            disabled={!isAvailable}
            className={cn(
              "w-full py-3 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm",
              isAvailable
                ? "bg-maroon hover:bg-maroon/90"
                : "bg-gray-400 cursor-not-allowed",
            )}
          >
            {isAvailable
              ? (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag className="h-3 w-3" /> Quick Add
                </span>
              )
              : (
                "Out of Stock"
              )}
          </button>
        </div>
      </div>

      {/* Product Details: Playfair (luxury) + Montserrat (science), Dark Charcoal #333333 [Source 34, 57] */}
      <div className="mt-4 flex flex-1 flex-col text-center">
        {/* Brand: "The Anchor" — Maroon */}
        <span className="text-xs font-bold tracking-wider text-maroon uppercase font-body">
          {brand}
        </span>

        {/* Title: "The Voice of Luxury" — Playfair Display */}
        <Link
          to={`/products/${handle}`}
          className="mt-1 font-heading text-lg font-medium text-dark-charcoal hover:text-maroon transition-colors line-clamp-2"
        >
          {title}
        </Link>

        {/* Price / ingredients: "The Voice of Science" — Montserrat */}
        <div className="mt-auto pt-2 font-body font-medium text-dark-charcoal">
          {price.toFixed(2)} JOD
        </div>
      </div>
    </div>
  );
};
