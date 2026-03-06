/**
 * regimenToTrayProducts — Connects tray/regimen data to the Digital Tray UI.
 * Converts API tray (step_1, step_2, step_3) or static regimen to slots for rendering.
 */

export interface TrayProduct {
  handle: string;
  title: string;
  brand: string;
  price: number;
  image_url: string | null;
  inventory_total: number;
  step_tag?: string;
}

export type TraySlot = TrayProduct | null;

/** Tray from get_tray_by_concern / get-digital-tray API */
export interface ApiTray {
  concern_tag: string;
  step_1: TrayProduct | null;
  step_2: TrayProduct | null;
  step_3: TrayProduct | null;
}

/** Static regimen product (from getProductsByConcern lib) */
export interface StaticRegimenProduct {
  step: string;
  product_handle: string;
  why: string;
}

/**
 * Convert API tray to 3 slots. Null steps become null slots for "Consult Pharmacist".
 */
export function regimenToTrayProductsFromApi(tray: ApiTray): TraySlot[] {
  return [tray.step_1, tray.step_2, tray.step_3];
}

/**
 * Convert static regimen (from getProductsByConcern) to 3 slots.
 * Products map to slots by position: [0]->slot1, [1]->slot2, [2]->slot3.
 * Missing positions become null.
 */
export function regimenToTrayProductsFromStatic(
  products: StaticRegimenProduct[],
): TraySlot[] {
  const STEP_TAGS = [
    "Step_1_Cleanser",
    "Step_2_Treatment",
    "Step_3_Protection",
  ];
  const slots: TraySlot[] = [null, null, null];
  products.slice(0, 3).forEach((p, i) => {
    if (i < 3) {
      const title = p.product_handle
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      const brand = p.product_handle.startsWith("vichy")
        ? "Vichy"
        : p.product_handle.startsWith("lrp")
        ? "La Roche-Posay"
        : "Asper";
      slots[i] = {
        handle: p.product_handle,
        title,
        brand,
        price: 0,
        image_url: null,
        inventory_total: 1,
        step_tag: STEP_TAGS[i],
      };
    }
  });
  return slots;
}
