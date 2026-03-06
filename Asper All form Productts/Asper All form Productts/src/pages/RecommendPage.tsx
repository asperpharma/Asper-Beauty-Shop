import { useNavigate, useLocation } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { useDigitalTray } from "@/hooks/useDigitalTray";
import { getProductsByConcern } from "@/lib/getProductsByConcern";
import { regimenToTrayProductsFromStatic } from "@/lib/regimenToTrayProducts";
import { useCartStore } from "@/store/cartStore";
import type { TrayProduct } from "@/lib/regimenToTrayProducts";

export function RecommendPage() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: { concernSlug?: string } };
  const concernSlug = state?.concernSlug ?? "";
  const { slots, isLoading, error } = useDigitalTray(concernSlug);
  const staticResult = concernSlug ? getProductsByConcern(concernSlug) : null;
  const addItem = useCartStore((s) => s.addItem);

  const displaySlots =
    slots.length > 0
      ? slots
      : staticResult
        ? regimenToTrayProductsFromStatic(staticResult.products)
        : [];
  const products = displaySlots.filter(
    (s): s is TrayProduct => s !== null,
  ) as TrayProduct[];

  function goToRegimen() {
    products.forEach((p) =>
      addItem({
        id: p.handle,
        handle: p.handle,
        title: p.title,
        brand: p.brand,
        price: p.price,
        image: p.image_url ?? "",
      }),
    );
    nav("/regimen", { state: { regimen: products } });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-3xl mx-auto py-16 px-4 flex-1">
        <h1 className="text-3xl font-heading text-maroon text-center mb-6">
          Your Personalized Regimen
        </h1>

        {isLoading && products.length === 0 ? (
          <div className="text-dark-charcoal text-center animate-pulse">
            Loading regimen…
          </div>
        ) : products.length === 0 ? (
          <div className="text-dark-charcoal text-center">
            No regimen found.{" "}
            <button
              type="button"
              onClick={() => nav("/analyze")}
              className="text-maroon hover:underline"
            >
              Start over
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 md:flex-row md:gap-10 items-stretch justify-center flex-wrap">
              {products.map((product) => (
                <div
                  key={product.handle}
                  className="group relative bg-white p-5 rounded-sm shadow-tray border border-transparent transition-all duration-400 ease-in-out hover:border-shiny-gold hover:shadow-midas-glow w-full max-w-xs mx-auto"
                >
                  <div className="aspect-square overflow-hidden bg-soft-ivory relative mb-3 rounded-sm">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1 text-center">
                    <h3 className="font-heading text-lg text-maroon line-clamp-1">
                      {product.title}
                    </h3>
                    <div className="font-body text-sm text-dark-charcoal">
                      {product.price > 0 ? `${product.price.toFixed(2)} JOD` : "—"}
                    </div>
                    <button
                      type="button"
                      className="w-full bg-maroon text-white py-2 font-body text-xs uppercase tracking-widest hover:bg-maroon/90 transition-opacity rounded-sm mt-2"
                      onClick={() => {
                        addItem({
                          id: product.handle,
                          handle: product.handle,
                          title: product.title,
                          brand: product.brand,
                          price: product.price,
                          image: product.image_url ?? "",
                        });
                      }}
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                type="button"
                className="bg-shiny-gold text-white font-body py-2 px-6 text-sm rounded-sm shadow uppercase tracking-widest hover:bg-maroon transition-all"
                onClick={goToRegimen}
              >
                Proceed to Regimen →
              </button>
            </div>
          </>
        )}

        {error && products.length > 0 && (
          <p className="mt-4 text-sm text-dark-charcoal/70 text-center">
            Showing curated regimen. Live data unavailable.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
