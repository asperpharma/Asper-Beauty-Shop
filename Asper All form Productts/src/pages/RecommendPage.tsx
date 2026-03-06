import { useNavigate, useLocation } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { getProductsByConcern } from "@/lib/getProductsByConcern";
import { regimenToTrayProductsFromStatic } from "@/lib/regimenToTrayProducts";
import type { TrayProduct } from "@/lib/regimenToTrayProducts";
import { useDigitalTray } from "@/hooks/useDigitalTray";
import { DigitalTray } from "@/components/tray/DigitalTray";
import { useCartStore } from "@/store/cartStore";

interface AnalyzeState {
  skinType?: string;
  concern?: string;
  concernSlug?: string;
  routineLevel?: string;
}

/**
 * Step 2 of the 3-Click Solution: Recommend.
 * Receives analysis state from AnalyzePage, fetches pharmacist-vetted regimen, offers Add to Digital Tray.
 */
export function RecommendPage() {
  const { state } = useLocation() as { state?: AnalyzeState };
  const navigate = useNavigate();
  const concernSlug = state?.concernSlug ?? "";
  const { slots, isLoading, error, refetch } = useDigitalTray(concernSlug);
  const staticResult = concernSlug ? getProductsByConcern(concernSlug) : null;
  const addItem = useCartStore((s) => s.addItem);

  const displaySlots =
    slots.length > 0
      ? slots
      : staticResult
        ? regimenToTrayProductsFromStatic(staticResult.products)
        : [];

  const regimenProducts: TrayProduct[] = displaySlots.filter(
    (s): s is TrayProduct => s !== null
  );

  const skinConcern =
    staticResult?.skin_concern ?? concernSlug?.replace(/-/g, " ") ?? "Your concern";
  const message =
    staticResult?.message ?? "Pharmacist-vetted regimen for your profile.";

  // No concern from analyze flow: send back to analyze
  if (!state?.concernSlug && !concernSlug) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="max-w-lg mx-auto py-16 px-4 flex-1">
          <h1 className="text-3xl font-heading text-maroon mb-4 text-center">
            Recommend
          </h1>
          <p className="font-body text-dark-charcoal text-center mb-6">
            Start with a quick analysis to get your personalized regimen.
          </p>
          <button
            type="button"
            onClick={() => navigate("/analyze")}
            className="w-full bg-maroon text-white py-3 font-body tracking-widest uppercase rounded-sm shadow hover:bg-maroon/90"
          >
            Go to Analysis
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-2xl mx-auto py-16 px-4 flex-1">
        <button
          type="button"
          onClick={() => navigate("/analyze")}
          className="text-sm text-dark-charcoal hover:text-maroon mb-4"
        >
          ← Back to Analysis
        </button>
        <h1 className="text-3xl font-heading text-maroon mb-2 text-center">
          Your Recommended Regimen
        </h1>
        <p className="font-body text-dark-charcoal text-center mb-2">
          {message}
        </p>
        <p className="text-sm text-gray-600 text-center mb-8">
          {skinConcern} · Step 2 of 3-Click Solution
        </p>

        {isLoading && displaySlots.length === 0 ? (
          <div className="text-dark-charcoal animate-pulse text-center py-12">
            Loading regimen…
          </div>
        ) : (
          <>
            <DigitalTray
              slots={displaySlots}
              className="mb-8"
              onAddToCart={(p) =>
                addItem({
                  id: p.handle,
                  handle: p.handle,
                  title: p.title,
                  brand: p.brand,
                  price: p.price,
                  image: p.image_url ?? "",
                })
              }
            />
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="w-full bg-maroon text-white py-3 font-body tracking-widest uppercase rounded-sm shadow hover:bg-maroon/90 transition-opacity"
                onClick={() =>
                  navigate("/regimen", { state: { regimen: regimenProducts } })
                }
                disabled={regimenProducts.length === 0}
              >
                Add to Digital Tray
              </button>
              <button
                type="button"
                className="w-full text-dark-charcoal font-body text-sm hover:text-maroon"
                onClick={() => navigate("/concerns")}
              >
                Shop by Concern instead
              </button>
            </div>
          </>
        )}
        {error && displaySlots.length > 0 && (
          <p className="mt-4 text-sm text-gray-500 text-center">
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
