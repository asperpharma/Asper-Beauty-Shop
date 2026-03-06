/**
 * The "Brain" of the 3-Click Solution
 * Maps intent keywords to specific Shopify Product Handles
 */

export interface Routine {
  concern: string;
  message: string;
  products: {
    step: string;
    handle: string; // Must match Shopify Handle exactly
    benefit: string;
  }[];
}

export const getRoutineByIntent = (input: string): Routine | null => {
  const normalizedInput = input.toLowerCase();

  // 1. Detect Intent (Acne & Oil Control)
  if (
    normalizedInput.includes("acne") ||
    normalizedInput.includes("pimple") ||
    normalizedInput.includes("oily") ||
    normalizedInput.includes("breakout")
  ) {
    return {
      concern: "Acne & Oil Control",
      message:
        "For acne-prone skin, we must unclog pores without stripping your moisture barrier.",
      products: [
        {
          step: "Cleanse",
          handle: "vichy-normaderm-phytosolution",
          benefit: "Deep cleans with Salicylic Acid",
        },
        {
          step: "Treat",
          handle: "lrp-effaclar-duo-plus",
          benefit: "Reduces blemishes and marks",
        },
        {
          step: "Protect",
          handle: "vichy-capital-soleil-mattifying",
          benefit: "Prevents dark spots",
        },
      ],
    };
  }

  // 2. Detect Intent (Anti-Aging)
  if (
    normalizedInput.includes("wrinkle") ||
    normalizedInput.includes("aging") ||
    normalizedInput.includes("lift") ||
    normalizedInput.includes("line")
  ) {
    return {
      concern: "Anti-Aging & Wrinkles",
      message:
        "To address aging, we focus on fortification and collagen production.",
      products: [
        {
          step: "Fortify",
          handle: "vichy-mineral-89",
          benefit: "Plumps and strengthens",
        },
        {
          step: "Correct",
          handle: "vichy-liftactiv-vitamin-c",
          benefit: "Brightens with 15% Pure Vit C",
        },
        {
          step: "Restore",
          handle: "vichy-liftactiv-collagen-specialist",
          benefit: "Boosts collagen",
        },
      ],
    };
  }

  // 3. Detect Intent (Hydration)
  if (
    normalizedInput.includes("dry") ||
    normalizedInput.includes("tight") ||
    normalizedInput.includes("dull") ||
    normalizedInput.includes("glow")
  ) {
    return {
      concern: "Hydration & Glow",
      message:
        "Your skin is thirsty. We need to lock in moisture for 24 hours.",
      products: [
        {
          step: "Boost",
          handle: "vichy-mineral-89",
          benefit: "Holds water with Hyaluronic Acid",
        },
        {
          step: "Hydrate",
          handle: "vichy-aqualia-thermal-rich",
          benefit: "Dynamic hydration for dry zones",
        },
      ],
    };
  }

  // 4. Detect Intent (Sensitivity)
  if (
    normalizedInput.includes("sensitive") ||
    normalizedInput.includes("red") ||
    normalizedInput.includes("itchy") ||
    normalizedInput.includes("rosacea")
  ) {
    return {
      concern: "Sensitivity & Redness",
      message:
        "For sensitive skin, 'Less is More'. We prioritize 0% fragrance and 0% alcohol formulas.",
      products: [
        {
          step: "Cleanse",
          handle: "lrp-toleriane-dermo-cleanser",
          benefit: "Gentle cleansing without irritation",
        },
        {
          step: "Soothe",
          handle: "lrp-toleriane-double-repair",
          benefit: "Restores the microbiome barrier",
        },
      ],
    };
  }

  return null; // No clinical match found
};
