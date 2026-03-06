import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function Header() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-50 bg-soft-ivory/95 backdrop-blur border-b border-gray-200">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-heading text-xl font-bold text-maroon"
        >
          Asper Beauty Shop
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/concerns"
            className="text-sm font-body text-dark-charcoal hover:text-maroon transition"
          >
            Shop by Concern
          </Link>
          <Link
            to="/cart"
            className="relative p-2 text-dark-charcoal hover:text-maroon transition"
            aria-label={`Cart: ${totalItems} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-maroon text-[10px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
