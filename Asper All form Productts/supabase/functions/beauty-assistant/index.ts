// Asper Beauty Shop: Beauty Assistant — "1 Brain, 2 Characters" (v3.0)
// Persona 1: Dr. Sami (Clinical/Wellness). Persona 2: Ms. Zain (Beauty/Aesthetics).
// Flow: Receive (query, history, budget, skin_type) → Think (Gemini 1.5 Flash) → Check Stock (Shopify) → Log (chat_logs) → Respond.
//
// GET  /beauty-assistant or ?health=true → { status: "active", version: "3.0" }
// POST /beauty-assistant → JSON body: { query, history?, budget?, skin_type?, session_id? } → { response, persona, recommended_products }
// Webhook: ?route=gorgias | ?route=manychat for Gorgias/ManyChat payload extraction.
//
// Required secrets: GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_API_TOKEN
// Deploy: supabase functions deploy beauty-assistant

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Medical triggers — if ANY appear in user input, Director MUST route to Dr. Sami (mid-turn switch).
const DR_SAMI_TRIGGERS = [
  "pregnancy",
  "pregnant",
  "breastfeeding",
  "nursing",
  "rigenforte",
  "omron",
  "blood pressure",
  "blood pressure monitor",
  "eczema",
  "psoriasis",
  "rosacea",
  "dermatitis",
  "allergy",
  "allergies",
  "allergic",
  "hypersensitive",
  "dosage",
  "dose",
  "mg",
  "ml",
  "supplement",
  "vitamin",
  "medication",
  "prescription",
  "drug interaction",
  "safe during",
  "safe to use",
  "contraindication",
  "ingredient",
  "active ingredient",
  "retinol",
  "tretinoin",
  "medical",
  "condition",
  "symptom",
  "diagnosis",
  "doctor",
  "dermatologist",
  "pharmacist",
];

function requiresDrSami(text: string): boolean {
  const lower = text.toLowerCase();
  return DR_SAMI_TRIGGERS.some((t) => lower.includes(t));
}

// High-value / Dr. Sami priority: when recommending, prefer these when context fits (handles match Shopify catalog).
const PRIORITY_PRODUCTS: {
  category: string;
  handles?: string[];
  products?: string[];
  note: string;
}[] = [
  {
    category: "Clinical skincare (glow / barrier)",
    handles: [
      "vichy-mineral-89",
      "vichy-liftactiv-vitamin-c",
      "vichy-aqualia-thermal-rich",
    ],
    note:
      "Vichy Mineral 89 is the hero for glow and hydration; pair with Vitamin C or Aqualia as needed.",
  },
  {
    category: "Acne / blemishes",
    handles: [
      "vichy-normaderm-phytosolution",
      "lrp-effaclar-duo-plus",
      "vichy-capital-soleil-mattifying",
    ],
    note:
      "Normaderm + Effaclar Duo + Capital Soleil = pharmacist-vetted acne regimen.",
  },
  {
    category: "Sensitivity / redness",
    handles: ["lrp-toleriane-dermo-cleanser", "lrp-toleriane-double-repair"],
    note: "0% fragrance, microbiome-friendly.",
  },
  {
    category: "Anti-aging",
    handles: [
      "vichy-liftactiv-collagen-specialist",
      "vichy-liftactiv-vitamin-c",
    ],
    note: "Collagen Specialist + Vitamin C for firming and brightening.",
  },
  {
    category: "Supplements (Dr. Sami)",
    products: ["Rigenforte"],
    note:
      "Hair/nail support; Biotin, Zinc. Always state wellness guidance disclaimer when discussing.",
  },
  {
    category: "Medical devices (Dr. Sami)",
    products: ["Omron"],
    note:
      "Blood pressure monitors; recommend only when user asks about monitoring or heart health.",
  },
];

function getPriorityProductsPromptBlock(): string {
  return PRIORITY_PRODUCTS.map((p) => {
    const items = [...(p.handles ?? []), ...(p.products ?? [])].join(", ");
    return `- **${p.category}:** ${items}. ${p.note}`;
  }).join("\n");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-route",
};

function getWebhookRoute(req: Request): "gorgias" | "manychat" | null {
  const url = new URL(req.url);
  const q = url.searchParams.get("route")?.toLowerCase();
  if (q === "gorgias" || q === "manychat") return q;
  const header = req.headers.get("x-webhook-route")?.toLowerCase();
  if (header === "gorgias" || header === "manychat") return header;
  const path = url.pathname.toLowerCase();
  if (path.includes("/gorgias")) return "gorgias";
  if (path.includes("/manychat")) return "manychat";
  return null;
}

function extractFromGorgias(
  body: Record<string, unknown>,
): { message: string; userId?: string } {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const last = messages.filter((m: unknown) => m && typeof m === "object")
    .pop() as Record<string, unknown> | undefined;
  const text = typeof last?.body_text === "string"
    ? last.body_text
    : typeof last?.body_html === "string"
    ? last.body_html.replace(/<[^>]+>/g, "").trim()
    : typeof body.body_text === "string"
    ? body.body_text
    : typeof body.message === "string"
    ? body.message
    : "";
  const ticket = body.ticket as Record<string, unknown> | undefined;
  const userId = typeof ticket?.id === "number" ? String(ticket.id) : undefined;
  return { message: text || "(No message)", userId };
}

function extractFromManyChat(
  body: Record<string, unknown>,
): { message: string; userId?: string } {
  const data = body.data as Record<string, unknown> | undefined;
  const text = typeof data?.text === "string"
    ? data.text
    : typeof body.text === "string"
    ? body.text
    : typeof body.message === "string"
    ? body.message
    : "";
  const subId = data?.subscriber_id ?? body.subscriber_id;
  const userId = subId != null ? String(subId) : undefined;
  return { message: text || "(No message)", userId };
}

// Build system prompt — inject mid-turn override when medical triggers detected.
function buildSystemPrompt(
  forceDrSami: boolean,
  context: { skin_type?: string; budget?: string } | null,
): string {
  const midTurnOverride = forceDrSami
    ? `

---
**⚠️ MID-TURN ROUTING OVERRIDE (STRICT):**
The user's latest message contains medical/clinical keywords (e.g. pregnancy, allergy, eczema, Rigenforte, Omron).
You MUST immediately short-circuit to Dr. Sami. Ignore any prior aesthetic context. Respond as Dr. Sami with the mandatory disclaimer.
`
    : "";

  const contextBlock: string[] = [];
  if (context?.skin_type) {
    contextBlock.push(`User Skin Type: ${context.skin_type}.`);
  }
  if (context?.budget) {
    contextBlock.push(`User Budget: Under ${context.budget}. Prefer products within budget; avoid luxury items that exceed it.`);
  }
  const contextLine = contextBlock.length > 0
    ? `\n**CONTEXTUAL CONSTRAINTS:** ${contextBlock.join(" ")}\n`
    : "";

  return `
You are the Centralised AI Brain for Asper Beauty Shop. You have access to our 5,000+ SKU catalog (Shopify).
You act as a "Director" that switches between two distinct personas based on the user's inquiry.
${contextLine}
---
**CONTEXT & MEMORY:**
- You maintain a shared memory. If Ms. Zain recommends a serum, Dr. Sami knows its ingredients.
- INVENTORY: Always check live stock before recommending. Never recommend out-of-stock items. (Shopify Storefront API available when enabled.)

---
**HIGH-VALUE / CLINICAL PRIORITY (when relevant):**
When the user's concern or question fits, prefer or explicitly recommend these pharmacist-vetted products (handles match our Shopify catalog):
${getPriorityProductsPromptBlock()}
Use these to anchor regimens and clinical answers; do not force them when the user asks for something different (e.g. a specific brand they name).

---
**HONOR OF SERVICE (Consultative Sales):**
- Never give a one-line answer (e.g. "Yes, we have Vitamin C."). Always offer a solution and a next step.
- Dr. Sami: Link supplements/devices to the user's stated need; suggest dosing or regimen; invite a refill or add-to-cart when relevant.
- Ms. Zain: Match products to their goal (e.g. brightening, glow); reference previous purchases to layer or cross-sell; direct them to the Digital Tray or regimen. Example tone: "We have a highly active Vitamin C serum perfect for your brightening goals. Based on your cleanser, this will double your results—would you like to see how to layer them?"

---
**PERSONA 1: DR. SAMI (The Pharmacist)**
- **EXPANDED TRIGGERS (route to Dr. Sami):**
  Pregnancy, breastfeeding, Rigenforte, Omron, blood pressure, eczema, psoriasis, rosacea, dermatitis, allergies, dosage/supplements, medication/prescription, drug interactions, contraindications, retinol/tretinoin, medical conditions, symptoms, diagnosis, doctor/dermatologist questions, shipping/returns.
- **TONE:** "The Voice of Science." Clinical, precise, reassuring, safety-first.
- **MANDATORY DISCLAIMER:** You MUST include in every Dr. Sami response: "I provide wellness guidance, not medical diagnosis."
- **SIGNATURE:** "- Dr. Sami, Asper Clinical Support"

---
**PERSONA 2: MS. ZAIN (The Beauty Concierge)**
- **TRIGGER:** Use for makeup (shades, lipstick), beauty routines ("glass skin"), gifts, or general aesthetic advice.
- **TONE:** "The Voice of Luxury." Warm, editorial, enthusiastic. Use words like "Radiance," "Glow," "Morning Spa."
- **ACTION:** Execute the "3-Click Solution":
   1. Analyze the skin concern.
   2. Recommend a specific regimen (Cleanser + Serum + Moisturizer).
   3. Direct them to the "Digital Tray" (Cart).
- **SIGNATURE:** "- Ms. Zain, Your Beauty Concierge"

---
**INSTRUCTION:**
1. Analyze the user's latest input.
2. If medical keywords appear (allergy, pregnancy, eczema, etc.)—even mid-conversation—immediately switch to Dr. Sami and include the mandatory disclaimer.
3. Otherwise, decide Clinical/Wellness (Dr. Sami) vs Aesthetic/Beauty (Ms. Zain).
4. Generate the response strictly adhering to that persona's tone and signature.
5. When you recommend specific products by name, add a single line at the very end of your reply: PRODUCTS: exact name 1, exact name 2 (comma-separated, no other text on that line). This allows us to check inventory and serve them on the Digital Tray. Use the full product name as it appears in our catalog (e.g. "Vichy Mineral 89 Hyaluronic Acid Serum" or "Maybelline Instant Age Rewind Eraser Concealer").
${midTurnOverride}
`;
}

// --- Shopify Storefront: handle lookup then title search fallback (reliability for long handles) ---
// Requires SHOPIFY_STORE_DOMAIN (e.g. your-store.myshopify.com) and SHOPIFY_STOREFRONT_API_TOKEN, SHOPIFY_STOREFRONT_TOKEN, or SHOPIFY_ACCESS_TOKEN.
const STOREFRONT_API_VERSION = "2023-10";

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  totalInventory?: number;
  priceRange?: { minVariantPrice?: { amount: string; currencyCode: string } };
  featuredImage?: { url: string; altText?: string } | null;
  variants?: {
    edges: Array<
      { node: { id: string; price: { amount: string; currencyCode: string } } }
    >;
  };
}

async function fetchShopifyProductByHandle(
  handle: string,
  domain: string,
  token: string,
): Promise<ShopifyProduct | null> {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        availableForSale
        totalInventory
        priceRange { minVariantPrice { amount currencyCode } }
        featuredImage { url altText }
        variants(first: 1) { edges { node { id price { amount currencyCode } } } }
      }
    }
  `;
  const apiHost = domain.includes("myshopify.com")
    ? domain
    : `${domain}.myshopify.com`;
  const res = await fetch(
    `https://${apiHost}/api/${STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables: { handle } }),
    },
  );
  const json = await res.json();
  return json.data?.product ?? null;
}

async function searchShopifyProductByTitle(
  term: string,
  domain: string,
  token: string,
): Promise<ShopifyProduct | null> {
  const query = `
    query searchProducts($query: String!) {
      search(query: $query, first: 1, types: PRODUCT) {
        nodes {
          ... on Product {
            id
            title
            handle
            availableForSale
            totalInventory
            priceRange { minVariantPrice { amount currencyCode } }
            featuredImage { url altText }
            variants(first: 1) { edges { node { id price { amount currencyCode } } } }
          }
        }
      }
    }
  `;
  const apiHost = domain.includes("myshopify.com")
    ? domain
    : `${domain}.myshopify.com`;
  const res = await fetch(
    `https://${apiHost}/api/${STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables: { query: term } }),
    },
  );
  const json = await res.json();
  const node = json.data?.search?.nodes?.[0] ?? null;
  return node;
}

function keywordToHandle(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Resolve product by handle first; if not found, search by title. Returns only in-stock. */
async function resolveProduct(
  keyword: string,
  domain: string,
  token: string,
): Promise<ShopifyProduct | null> {
  const handle = keywordToHandle(keyword);
  let product: ShopifyProduct | null = await fetchShopifyProductByHandle(
    handle,
    domain,
    token,
  );
  if (!product) {
    product = await searchShopifyProductByTitle(keyword.trim(), domain, token);
  }
  if (!product) return null;
  const inStock = product.availableForSale &&
    (product.totalInventory == null || product.totalInventory > 0);
  return inStock ? product : null;
}

function parseProductKeywordsFromReply(
  reply: string,
): { cleanReply: string; keywords: string[] } {
  const line = reply.split(/\n/).find((l) => /^\s*PRODUCTS:\s*/i.test(l));
  if (!line) return { cleanReply: reply.trim(), keywords: [] };
  const raw = line.replace(/^\s*PRODUCTS:\s*/i, "").trim();
  const keywords = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const cleanReply = reply
    .replace(/\n?\s*PRODUCTS:.*$/i, "")
    .trim();
  return { cleanReply, keywords };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Health check: GET /beauty-assistant or ?health=true for uptime monitoring
  if (req.method === "GET") {
    const url = new URL(req.url);
    const health = url.searchParams.get("health")?.toLowerCase();
    return new Response(
      JSON.stringify({
        status: "active",
        version: "3.0",
        ...(health === "true" ? { uptime: "ok" } : {}),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      },
    );
  }

  try {
    let body: Record<string, unknown>;
    try {
      const raw = await req.json();
      body = raw && typeof raw === "object" ? raw : {};
    } catch {
      body = {};
    }

    const route = getWebhookRoute(req);
    let userMessage: string;
    if (route === "gorgias") {
      userMessage = extractFromGorgias(body).message;
    } else if (route === "manychat") {
      userMessage = extractFromManyChat(body).message;
    } else {
      userMessage = typeof body.query === "string"
        ? body.query
        : typeof body.message === "string"
        ? body.message
        : typeof body.content === "string"
        ? body.content
        : "";
    }

    const history = Array.isArray(body.history) ? body.history : Array.isArray(body.messages) ? body.messages : [];
    const budget = typeof body.budget === "string" ? body.budget : undefined;
    const skinType = typeof body.skin_type === "string" ? body.skin_type : undefined;
    const sessionId = typeof body.session_id === "string" ? body.session_id : null;

    const forceDrSami = requiresDrSami(userMessage);
    const context = (budget || skinType) ? { budget, skin_type: skinType } : null;
    const systemPrompt = buildSystemPrompt(forceDrSami, context);

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY not set in Edge Function secrets",
          hint:
            "Set in Supabase Dashboard → Edge Functions → beauty-assistant → Secrets",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 503,
        },
      );
    }

    const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.0-flash";
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Build contents: prior turns (user/model) + current user message for shared memory
    const contents: { role: "user" | "model"; parts: { text: string }[] }[] =
      history
        .filter((m: { role?: string; text?: string }) =>
          m && (m.role === "user" || m.role === "model") &&
          typeof (m.text ?? (m as { content?: string }).content) === "string"
        )
        .map((m: { role: string; text?: string; content?: string }) => ({
          role: m.role as "user" | "model",
          parts: [{
            text: (m.text ?? (m as { content?: string }).content ?? "").slice(
              0,
              8000,
            ),
          }],
        }));
    contents.push({
      role: "user",
      parts: [{ text: userMessage || "(No message)" }],
    });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(
        JSON.stringify({
          error: "Gemini API error",
          status: res.status,
          detail: errText.slice(0, 500),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 502,
        },
      );
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "";

    const { cleanReply, keywords } = parseProductKeywordsFromReply(text);

    // Storefront search fallback: resolve product names → handle first, then search by title; attach only in-stock
    let recommendedProducts: ShopifyProduct[] = [];
    const shopifyDomain = Deno.env.get("SHOPIFY_STORE_DOMAIN");
    const shopifyToken = Deno.env.get("SHOPIFY_STOREFRONT_API_TOKEN") ??
      Deno.env.get("SHOPIFY_STOREFRONT_TOKEN") ??
      Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    if (shopifyDomain && shopifyToken && keywords.length > 0) {
      for (const kw of keywords) {
        try {
          const product = await resolveProduct(kw, shopifyDomain, shopifyToken);
          if (product) recommendedProducts.push(product);
        } catch {
          // Skip this keyword on error
        }
      }
    }

    const personaRouted = forceDrSami ? "sami" : "auto";
    const externalUserId = route === "gorgias"
      ? extractFromGorgias(body).userId ?? null
      : route === "manychat"
      ? extractFromManyChat(body).userId ?? null
      : null;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const logSessionId = sessionId ?? externalUserId ?? "anonymous";

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Persistent Memory: write conversation to chat_logs
        await supabase.from("chat_logs").insert([
          {
            session_id: logSessionId,
            role: "user",
            content: userMessage || "(No message)",
            metadata: { budget, skin_type: skinType },
          },
          {
            session_id: logSessionId,
            role: "assistant",
            content: cleanReply,
            metadata: {
              persona,
              persona_routed: personaRouted,
              recommended_handles: recommendedProducts.map((p) => p.handle),
            },
          },
        ]);

        // Audit log for compliance and Director tuning
        await supabase.from("beauty_assistant_audit").insert({
          route: route ?? "direct",
          external_user_id: externalUserId,
          user_message_hash: null,
          user_message_length: userMessage?.length ?? 0,
          persona_routed: personaRouted,
          response_preview: cleanReply.slice(0, 200),
          response_length: cleanReply.length,
        });
      } catch {
        // Non-fatal: do not fail the response
      }
    }

    const persona = forceDrSami || cleanReply.includes("wellness guidance")
      ? "Dr. Sami"
      : "Ms. Zain";

    const payload: {
      reply: string;
      response?: string;
      persona?: string;
      recommended_products?: Array<{
        id: string;
        handle: string;
        title: string;
        price: string;
        currency: string;
        image: string | null;
      }>;
    } = { reply: cleanReply, response: cleanReply, persona };
    if (recommendedProducts.length > 0) {
      payload.recommended_products = recommendedProducts.map((p) => {
        const variantNode = p.variants?.edges?.[0]?.node;
        return {
          id: variantNode?.id ?? p.id,
          handle: p.handle,
          title: p.title,
          price: variantNode?.price?.amount ??
            p.priceRange?.minVariantPrice?.amount ??
            "0",
          currency:
            variantNode?.price?.currencyCode ??
            p.priceRange?.minVariantPrice?.currencyCode ??
            "JOD",
          image: p.featuredImage?.url ?? null,
        };
      });
    }

    return new Response(
      JSON.stringify(payload),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: "beauty-assistant failed",
        message: e instanceof Error ? e.message : String(e),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
