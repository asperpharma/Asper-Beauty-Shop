// Asper Beauty Shop: get-products-by-concern
// Returns regimen products for a given skin concern. Powers the "See My Regimen" collection page.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const FLOWS: Record<
  string,
  {
    message: string;
    routine: { step: string; product_handle: string; why: string }[];
  }
> = {
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
};

const CONCERN_TAG_MAP: Record<string, string> = {
  Concern_Acne: "Acne & Blemishes",
  Concern_AntiAging: "Anti-Aging & Wrinkles",
  Concern_Hydration: "Dryness & Hydration",
  Concern_Dryness: "Dryness & Hydration",
  Concern_Sensitivity: "Sensitivity & Redness",
};

const SLUG_MAP: Record<string, string> = {
  "acne-blemishes": "Acne & Blemishes",
  "anti-aging-wrinkles": "Anti-Aging & Wrinkles",
  "dryness-hydration": "Dryness & Hydration",
  "sensitivity-redness": "Sensitivity & Redness",
};

function resolveConcern(input: string): string | null {
  const t = input?.trim();
  if (!t) return null;
  if (FLOWS[t]) return t;
  if (CONCERN_TAG_MAP[t]) return CONCERN_TAG_MAP[t];
  const slug = t.toLowerCase().replace(/\s+/g, "-");
  return SLUG_MAP[slug] ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Use GET ?concern=... or POST { concern }" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      },
    );
  }

  let concern: string | undefined;

  if (req.method === "GET") {
    const url = new URL(req.url);
    concern = url.searchParams.get("concern") ?? undefined;
  } else {
    try {
      const body = await req.json();
      concern = body?.concern ?? body?.skin_concern ?? body?.concern_tag;
    } catch {
      concern = undefined;
    }
  }

  const skinConcern = concern ? resolveConcern(concern) : null;
  if (!skinConcern) {
    return new Response(
      JSON.stringify({
        error:
          "Invalid concern. Use skin_concern, concern_tag, or slug (e.g. acne-blemishes).",
        valid: [
          "Acne & Blemishes",
          "Anti-Aging & Wrinkles",
          "Dryness & Hydration",
          "Sensitivity & Redness",
        ],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  const flow = FLOWS[skinConcern];
  const result = {
    skin_concern: skinConcern,
    message: flow.message,
    products: flow.routine,
  };

  return new Response(
    JSON.stringify(result),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    },
  );
});
