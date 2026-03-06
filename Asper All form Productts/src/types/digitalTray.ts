/**
 * TypeScript types for Digital Tray API and UI.
 */

/** Valid concern tags from get-digital-tray API */
export type SkinConcern =
  | "Concern_Acne"
  | "Concern_AntiAging"
  | "Concern_Hydration"
  | "Concern_Dryness"
  | "Concern_Sensitivity";

/** Step labels for the 3-slot regimen */
export type RegimenStep =
  | "Step_1_Cleanser"
  | "Step_2_Treatment"
  | "Step_3_Protection";

/** Product slot — returned when a product is available for the step */
export interface DigitalTrayProductSlot {
  step_tag: RegimenStep;
  handle: string;
  title: string;
  brand: string;
  price: number;
  image_url: string | null;
  inventory_total: number;
}

/** Fallback slot — returned when no product; UI renders "Consult Pharmacist" */
export interface DigitalTrayFallbackSlot {
  step_tag: RegimenStep;
  fallback_action: "open_chat";
  label: { en: string; ar?: string };
}

export type DigitalTraySlot = DigitalTrayProductSlot | DigitalTrayFallbackSlot;

/** Full API response from get-digital-tray / tray */
export interface DigitalTrayResponse {
  concern_tag: SkinConcern;
  step_1: DigitalTrayProductSlot | null;
  step_2: DigitalTrayProductSlot | null;
  step_3: DigitalTrayProductSlot | null;
  /** Optional: step labels for display */
  step_labels?: { step_1: string; step_2: string; step_3: string };
}

/** Type guard: slot has a product (not fallback) */
export function isSlotAvailable(
  slot: DigitalTraySlot | null,
): slot is DigitalTrayProductSlot {
  return (
    slot !== null &&
    typeof slot === "object" &&
    "handle" in slot &&
    typeof (slot as DigitalTrayProductSlot).handle === "string"
  );
}

/** Step labels for display */
export const STEP_LABELS: Record<RegimenStep, string> = {
  Step_1_Cleanser: "Step 1 — Cleanse",
  Step_2_Treatment: "Step 2 — Treatment",
  Step_3_Protection: "Step 3 — Protection",
};
