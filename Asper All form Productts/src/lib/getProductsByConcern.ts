/**
 * get-products-by-concern — Returns products for a given skin concern.
 * Powers the "See My Regimen" collection page.
 * Maps skin_concern or concern_tag → curated regimen products (handles + metadata).
 */

export interface RegimenProduct {
  step: string;
  product_handle: string;
  why: string;
}

export interface ProductsByConcernResult {
  skin_concern: string;
  concern_tag: string;
  message: string;
  products: RegimenProduct[];
}

const CONCERN_TO_TAG: Record<string, string> = {
  "Acne & Blemishes": "Concern_Acne",
  "Anti-Aging & Wrinkles": "Concern_AntiAging",
  "Dryness & Hydration": "Concern_Dryness",
  "Sensitivity & Redness": "Concern_Sensitivity",
  "Hyperpigmentation & Dark Spots": "Concern_Hyperpigmentation",
};

const FLOWS: Record<string, { message: string; routine: RegimenProduct[] }> = {
  "Acne & Blemishes": {
    message:
      "For acne-prone skin, we must unclog pores without destroying your moisture barrier. I have selected this medical-grade regimen:",
    routine: [
      {
        step: "Cleanse",
        product_handle: "vichy-normaderm-phytosolution",
        why:
          "Contains Salicylic Acid to deeply purify pores while preserving skin pH.",
      },
      {
        step: "Treat",
        product_handle: "lrp-effaclar-duo-plus",
        why:
          "Targeted dual-action treatment to reduce blemishes and prevent recurrence.",
      },
      {
        step: "Protect",
        product_handle: "vichy-capital-soleil-mattifying",
        why:
          "Oil-control UV protection is non-negotiable to prevent dark spots.",
      },
    ],
  },
  "Anti-Aging & Wrinkles": {
    message:
      "To address signs of aging, we focus on fortification and collagen production. Here is your 'Morning Spa' lift:",
    routine: [
      {
        step: "Fortify",
        product_handle: "vichy-mineral-89",
        why:
          "The daily dose of strength. Plumps skin and strengthens the barrier.",
      },
      {
        step: "Correct",
        product_handle: "vichy-liftactiv-vitamin-c",
        why: "Pure 15% Vitamin C to brighten skin tone and reduce fine lines.",
      },
      {
        step: "Restore",
        product_handle: "vichy-liftactiv-collagen-specialist",
        why: "Boosts collagen production to firm sagging contours.",
      },
    ],
  },
  "Dryness & Hydration": {
    message:
      "Your skin is thirsty. We need to lock in moisture for 24 hours using volcanic water minerals.",
    routine: [
      {
        step: "Boost",
        product_handle: "vichy-mineral-89",
        why:
          "The essential first step. Hyaluronic Acid for immediate plumping.",
      },
      {
        step: "Hydrate",
        product_handle: "vichy-aqualia-thermal-rich",
        why:
          "Dynamic hydration that distributes water to facial zones that need it most.",
      },
    ],
  },
  "Sensitivity & Redness": {
    message:
      "For sensitive skin, 'Less is More'. We prioritize 0% fragrance and 0% alcohol formulas.",
    routine: [
      {
        step: "Cleanse",
        product_handle: "lrp-toleriane-dermo-cleanser",
        why: "Wipes away impurities without any rubbing or irritation.",
      },
      {
        step: "Soothe",
        product_handle: "lrp-toleriane-double-repair",
        why: "Restores the microbiome barrier instantly.",
      },
    ],
  },
  "Hyperpigmentation & Dark Spots": {
    message:
      "To address hyperpigmentation, we focus on brightening and even skin tone with Vitamin C and Niacinamide.",
    routine: [
      {
        step: "Cleanse",
        product_handle: "vichy-normaderm-phytosolution",
        why: "Gentle cleansing to prep skin for active ingredients.",
      },
      {
        step: "Correct",
        product_handle: "vichy-liftactiv-vitamin-c",
        why: "15% Pure Vitamin C to fade dark spots and brighten.",
      },
      {
        step: "Protect",
        product_handle: "vichy-capital-soleil-mattifying",
        why: "Daily SPF prevents new dark spots from forming.",
      },
    ],
  },
};

const CONCERN_TAG_MAP: Record<string, string> = {
  Concern_Acne: "Acne & Blemishes",
  Concern_AntiAging: "Anti-Aging & Wrinkles",
  Concern_Hydration: "Dryness & Hydration",
  Concern_Dryness: "Dryness & Hydration",
  Concern_Sensitivity: "Sensitivity & Redness",
  Concern_Hyperpigmentation: "Hyperpigmentation & Dark Spots",
};

const CONCERN_SLUG_MAP: Record<string, string> = {
  "acne-blemishes": "Acne & Blemishes",
  "anti-aging-wrinkles": "Anti-Aging & Wrinkles",
  "dryness-hydration": "Dryness & Hydration",
  "sensitivity-redness": "Sensitivity & Redness",
  "hyperpigmentation-dark-spots": "Hyperpigmentation & Dark Spots",
};

/** Resolve skin concern from slug, tag, or display name */
function resolveConcern(input: string): string | null {
  const trimmed = input?.trim();
  if (!trimmed) return null;

  // Direct match
  if (FLOWS[trimmed]) return trimmed;

  // Slug (e.g. acne-blemishes)
  const fromSlug = CONCERN_SLUG_MAP[trimmed.toLowerCase().replace(/\s+/g, "-")];
  if (fromSlug) return fromSlug;

  // concern_tag (e.g. Concern_Acne)
  const fromTag = CONCERN_TAG_MAP[trimmed];
  if (fromTag) return fromTag;

  return null;
}

/**
 * Get products for a given skin concern.
 * @param concern — skin_concern, concern_tag, or URL slug (e.g. "acne-blemishes")
 */
export function getProductsByConcern(
  concern: string,
): ProductsByConcernResult | null {
  const skinConcern = resolveConcern(concern);
  if (!skinConcern) return null;

  const flow = FLOWS[skinConcern];
  if (!flow) return null;

  const concern_tag = CONCERN_TO_TAG[skinConcern] ?? "";

  return {
    skin_concern: skinConcern,
    concern_tag,
    message: flow.message,
    products: flow.routine,
  };
}

/** All available concerns for the collection index page */
export const ALL_CONCERNS = [
  { slug: "acne-blemishes", label: "Acne & Blemishes", tag: "Concern_Acne" },
  {
    slug: "anti-aging-wrinkles",
    label: "Anti-Aging & Wrinkles",
    tag: "Concern_AntiAging",
  },
  {
    slug: "dryness-hydration",
    label: "Dryness & Hydration",
    tag: "Concern_Dryness",
  },
  {
    slug: "sensitivity-redness",
    label: "Sensitivity & Redness",
    tag: "Concern_Sensitivity",
  },
  {
    slug: "hyperpigmentation-dark-spots",
    label: "Hyperpigmentation & Dark Spots",
    tag: "Concern_Hyperpigmentation",
  },
];
