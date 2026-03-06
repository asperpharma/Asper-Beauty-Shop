import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import type { TrayProduct } from "@/lib/regimenToTrayProducts";

interface RegimenState {
  regimen?: TrayProduct[];
}

export function RegimenPage() {
  const { state } = useLocation() as { state?: RegimenState };
  const nav = useNavigate();
  const regimen = state?.regimen ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-2xl mx-auto py-16 px-4 flex-1">
        <h1 className="text-3xl font-heading text-maroon mb-4 text-center">
          Your Digital Tray
        </h1>
        {regimen.length === 0 ? (
          <div className="text-dark-charcoal text-center font-body">
            No products selected.{" "}
            <button
              type="button"
              onClick={() => nav("/analyze")}
              className="text-maroon hover:underline"
            >
              Start your analysis
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {regimen.map((product) => (
              <div
                className="flex items-center bg-white p-4 rounded-sm shadow-tray border border-shiny-gold/20"
                key={product.handle}
              >
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.title}
                  className="w-20 h-20 rounded-sm me-4 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-heading text-maroon truncate">
                    {product.title}
                  </div>
                  <div className="text-dark-charcoal font-body text-sm truncate">
                    {product.brand}
                  </div>
                </div>
                <div className="font-body text-maroon ms-4 shrink-0">
                  {product.price > 0 ? `${product.price.toFixed(2)} JOD` : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <button
            type="button"
            className="bg-maroon text-white py-3 px-8 rounded-sm font-body uppercase tracking-widest shadow hover:bg-maroon/90 transition-opacity"
            onClick={() => nav("/checkout")}
          >
            Checkout
          </button>
          <button
            type="button"
            className="block mt-4 text-dark-charcoal font-body text-sm hover:text-maroon"
            onClick={() => nav("/cart")}
          >
            View Cart
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
