import { ProductCard } from "@/components/product/ProductCard";
import type { TrayProduct, TraySlot } from "@/lib/regimenToTrayProducts";
import { isSlotAvailable } from "@/types/digitalTray";
import { openGorgiasChat } from "@/lib/openGorgiasChat";
import { STEP_LABELS } from "@/types/digitalTray";

const STEP_LABEL_KEYS = [
  "Step_1_Cleanser",
  "Step_2_Treatment",
  "Step_3_Protection",
] as const;

interface DigitalTrayProps {
  slots: TraySlot[];
  className?: string;
  onAddToCart?: (product: TrayProduct) => void;
}

/**
 * Digital Tray — Pure White Card, Deep Maroon Quick Add.
 * Renders 3 slots. Null = "Consult Pharmacist" with fallback_action: open_chat.
 */
export function DigitalTray(
  { slots, className = "", onAddToCart }: DigitalTrayProps,
) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 ${className}`}>
      {slots.map((slot, i) => (
        <div key={i} className="flex flex-col">
          <span className="text-xs font-bold text-maroon uppercase mb-2">
            {STEP_LABELS[STEP_LABEL_KEYS[i]] ?? `Step ${i + 1}`}
          </span>
          {isSlotAvailable(slot)
            ? (
              <div className="bg-white border border-gray-100 rounded-sm shadow-sm hover:shadow-md hover:border-shiny-gold transition-all duration-300">
                <ProductCard
                  id={slot.handle}
                  title={slot.title}
                  brand={slot.brand}
                  price={slot.price}
                  image={slot.image_url ||
                    `https://placehold.co/400x500/f5f0e6/6b2d3a?text=${
                      encodeURIComponent(
                        STEP_LABELS[STEP_LABEL_KEYS[i]] ?? "Step",
                      )
                    }`}
                  handle={slot.handle}
                  isAvailable={slot.inventory_total > 0}
                  onAddToCart={onAddToCart
                    ? () =>
                      onAddToCart({
                        handle: slot.handle,
                        title: slot.title,
                        brand: slot.brand,
                        price: slot.price,
                        image_url: slot.image_url,
                        inventory_total: slot.inventory_total,
                        step_tag: slot.step_tag,
                      })
                    : undefined}
                />
              </div>
            )
            : <ConsultPharmacistCard onConsult={() => openGorgiasChat()} />}
        </div>
      ))}
    </div>
  );
}

interface ConsultPharmacistCardProps {
  onConsult?: () => void;
}

function ConsultPharmacistCard({ onConsult }: ConsultPharmacistCardProps) {
  return (
    <button
      type="button"
      onClick={onConsult}
      className="w-full flex flex-col items-center justify-center min-h-[280px] bg-white border border-dashed border-gray-200 rounded-sm p-6 text-center hover:border-shiny-gold hover:bg-soft-ivory/30 transition-colors cursor-pointer"
      aria-label="Consult Pharmacist placeholder"
    >
      <p className="font-body text-dark-charcoal font-medium">
        Consult Pharmacist
      </p>
      <p className="mt-2 text-sm text-gray-500">
        No product available for this step.
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Chat with our Digital Concierge for a recommendation →
      </p>
    </button>
  );
}
