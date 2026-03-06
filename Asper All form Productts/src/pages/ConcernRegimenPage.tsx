import { Link, useParams } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { getProductsByConcern } from "@/lib/getProductsByConcern";
import { regimenToTrayProductsFromStatic } from "@/lib/regimenToTrayProducts";
import { DigitalTray } from "@/components/tray/DigitalTray";
import { useDigitalTray } from "@/hooks/useDigitalTray";
import { useCartStore } from "@/store/cartStore";

/**
 * Collection page for a specific skin concern.
 * Uses useDigitalTray (API) with static fallback. Renders Digital Tray; null slots show "Consult Pharmacist".
 */
export function ConcernRegimenPage() {
  const { concernSlug } = useParams<{ concernSlug: string }>();
  const { slots, isLoading, error, refetch } = useDigitalTray(concernSlug);
  const staticResult = concernSlug ? getProductsByConcern(concernSlug) : null;
  const addItem = useCartStore((s) => s.addItem);

  // Fallback to static regimen when API unavailable or returns empty
  const displaySlots = slots.length > 0
    ? slots
    : staticResult
    ? regimenToTrayProductsFromStatic(staticResult.products)
    : [];

  const skin_concern = staticResult?.skin_concern ?? concernSlug ?? "";
  const message = staticResult?.message ?? "Your pharmacist-selected regimen.";

  if (!concernSlug || (!staticResult && !isLoading && error)) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container py-12">
          <h1 className="font-heading text-2xl font-bold text-maroon">
            Concern Not Found
          </h1>
          <Link to="/concerns" className="mt-4 text-maroon hover:underline">
            ← Back to Shop by Concern
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-12">
        <Link
          to="/concerns"
          className="text-sm text-dark-charcoal hover:text-maroon mb-4 inline-block"
        >
          ← Shop by Concern
        </Link>
        <h1 className="font-heading text-3xl font-bold text-maroon">
          {skin_concern}
        </h1>
        <p className="mt-2 font-body text-dark-charcoal">{message}</p>
        <p className="mt-1 text-sm text-gray-600">
          Your pharmacist-selected regimen
        </p>

        {isLoading && displaySlots.length === 0
          ? (
            <div className="mt-8 text-dark-charcoal animate-pulse">
              Loading regimen…
            </div>
          )
          : (
            <DigitalTray
              slots={displaySlots}
              className="mt-8"
              onAddToCart={(p) =>
                addItem({
                  id: p.handle,
                  handle: p.handle,
                  title: p.title,
                  brand: p.brand,
                  price: p.price,
                  image: p.image_url ?? "",
                })}
            />
          )}
        {error && displaySlots.length > 0 && (
          <p className="mt-4 text-sm text-gray-500">
            Showing curated regimen.{" "}
            <button
              type="button"
              onClick={refetch}
              className="text-maroon hover:underline"
            >
              Retry live data
            </button>
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
