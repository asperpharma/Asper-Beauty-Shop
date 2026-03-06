// Asper Beauty Shop: Generate Prescription
// Processes 3-Click logic and persists to concierge_profiles

import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// 3-Click logic (from concierge_logic.json)
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

const VALID_CONCERNS = Object.keys(FLOWS);

// Gorgias/ManyChat / Shopify format: concern_tag → skin_concern
const CONCERN_TAG_MAP: Record<string, string> = {
  Concern_Acne: "Acne & Blemishes",
  Concern_AntiAging: "Anti-Aging & Wrinkles",
  Concern_Hydration: "Dryness & Hydration",
  Concern_Dryness: "Dryness & Hydration", // Shopify tag (concierge_logic.json)
  Concern_Sensitivity: "Sensitivity & Redness",
};

function normalizeSkinType(input: string | undefined): string | null {
  if (!input?.trim()) return null;
  const lower = input.trim().toLowerCase();
  const map: Record<string, string> = {
    dry: "Dry",
    oily: "Oily",
    combination: "Combination",
    sensitive: "Sensitive",
    normal: "Normal",
  };
  return map[lower] ?? null;
}

interface Payload {
  user_id?: string;
  skin_concern?: string;
  concern_tag?: string;
  skin_type?: string;
  prescription_logic?: Record<string, string>;
}

function parsePayload(body: Payload): {
  skinConcern: string;
  skinType: string | null;
  routine: {
    step: string;
    product_handle?: string;
    product?: string;
    why?: string;
  }[];
  message: string;
} | null {
  // Format A: { skin_concern, user_id? }
  if (
    body?.skin_concern?.trim() &&
    VALID_CONCERNS.includes(body.skin_concern.trim())
  ) {
    const flow = FLOWS[body.skin_concern.trim()];
    return {
      skinConcern: body.skin_concern.trim(),
      skinType: normalizeSkinType(body.skin_type),
      routine: flow.routine,
      message: flow.message,
    };
  }

  // Format B: { concern_tag, skin_type?, prescription_logic?, user_id? }
  if (body?.concern_tag?.trim() && CONCERN_TAG_MAP[body.concern_tag.trim()]) {
    const skinConcern = CONCERN_TAG_MAP[body.concern_tag.trim()];
    const flow = FLOWS[skinConcern];
    const skinType = normalizeSkinType(body.skin_type);

    if (
      body.prescription_logic && typeof body.prescription_logic === "object"
    ) {
      const routine = Object.entries(body.prescription_logic).map((
        [step, product],
      ) => ({
        step: step.charAt(0).toUpperCase() + step.slice(1),
        product,
      }));
      return {
        skinConcern,
        skinType,
        routine,
        message: flow.message,
      };
    }

    return {
      skinConcern,
      skinType,
      routine: flow.routine,
      message: flow.message,
    };
  }

  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      },
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase env vars" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let body: Payload;
    try {
      const raw = await req.json();
      body = raw && typeof raw === "object" ? raw : {};
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const parsed = parsePayload(body);
    if (!parsed) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid payload. Use skin_concern (e.g. 'Acne & Blemishes') or concern_tag (e.g. 'Concern_Acne'). Valid skin_concerns: " +
            VALID_CONCERNS.join(", ") +
            ". Valid concern_tags: " +
            Object.keys(CONCERN_TAG_MAP).join(", "),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const { skinConcern, skinType, routine, message } = parsed;
    const userId = body?.user_id ?? null;

    // Explicit "Analyze → single recommendation" — first reply schema
    const prescription = {
      phase: "recommendation" as const,
      type: "single_recommendation" as const,
      skin_concern: skinConcern,
      skin_type: skinType ?? undefined,
      message,
      recommended_routine: routine,
    };

    if (userId) {
      const row: Record<string, unknown> = {
        user_id: userId,
        skin_concern: skinConcern,
        recommended_routine: routine,
        updated_at: new Date().toISOString(),
      };
      if (skinType) row.skin_type = skinType;

      const { error } = await supabase.from("concierge_profiles").upsert(row, {
        onConflict: "user_id",
      });
      if (error) throw error;
    }

    return new Response(
      JSON.stringify({ prescription }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
