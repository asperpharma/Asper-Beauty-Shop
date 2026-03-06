# Deploy the Centralised Brain (beauty-assistant)

This process deploys the "Director" logic (Dr. Sami & Ms. Zain) to Supabase Edge. It is **separate** from your frontend (Vercel/Lovable) deployment and pushes the AI brain to the edge network.

---

## Immediate deployment command

From the **root of your project**:

```bash
npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
```

- **Project ref:** `rgehleqcubtmcwyipyvi` (from your Supabase API configuration).
- **Function:** `beauty-assistant` (builds from `supabase/functions/beauty-assistant`).

---

## Pre-deployment verification

Before running the command, ensure:

### 1. File existence

- Confirm **`supabase/functions/beauty-assistant/index.ts`** exists.
- It should contain the "Director" system prompt (dual persona: Dr. Sami & Ms. Zain) and the Gemini integration.

### 2. Secrets configuration

Set the function’s secrets in Supabase so it can call Gemini. Either in **Dashboard → Edge Functions → beauty-assistant → Secrets**, or via CLI:

```bash
npx supabase secrets set GEMINI_API_KEY=<your-gemini-api-key> --project-ref rgehleqcubtmcwyipyvi
```

Optional:

```bash
npx supabase secrets set GEMINI_MODEL=gemini-2.0-flash
```

- **Required:** `GEMINI_API_KEY` — the function returns 503 if this is missing.
- **Optional:** `GEMINI_MODEL` (default: `gemini-2.0-flash`; use e.g. `gemini-2.5-flash` when available).
- **Optional (Storefront search fallback):** `SHOPIFY_STORE_DOMAIN` (e.g. `your-store.myshopify.com`) and `SHOPIFY_STOREFRONT_API_TOKEN`, `SHOPIFY_STOREFRONT_TOKEN`, or `SHOPIFY_ACCESS_TOKEN`. When set, the Brain resolves product names from the reply: it tries **handle** lookup first, then **search by title**, so long handles (e.g. `maybelline-instant-age-rewind-eraser-dark-circles-treatment-concealer`) still match when the AI says "Maybelline Age Rewind Concealer." Only in-stock products are returned in `recommended_products`.

**Full secrets (Connect the Brain):**
```bash
npx supabase secrets set \
  GEMINI_API_KEY="[YOUR_GEMINI_KEY]" \
  SHOPIFY_STOREFRONT_API_TOKEN="[YOUR_STOREFRONT_TOKEN]" \
  SHOPIFY_STORE_DOMAIN="your-store.myshopify.com" \
  --project-ref <YOUR_PROJECT_REF>
```

The beauty-assistant does **not** read `GOOGLE_AI_KEY`. For channel-specific webhooks (Gorgias/ManyChat), configure those in the respective platforms to point at this function’s URL.

---

## How to verify success

After the terminal reports **Deployed Function beauty-assistant**:

1. **Dashboard:** Supabase Dashboard → **Edge Functions**. You should see **beauty-assistant** with a green **Healthy** status.
2. **Test with curl:** Call the brain with a message (use your project’s anon key for `ANON_KEY`):

   ```bash
   curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
     -H "Authorization: Bearer ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"message": "I have dry skin, what should I use?"}'
   ```

   **Expectation:** A JSON response with `reply` (and optionally `recommended_products` when Shopify secrets are set and the AI lists product names on a line starting with `PRODUCTS:`). The reply contains the recommendation and signature (e.g. `"- Ms. Zain, Your Beauty Concierge"`).

3. **Clinical test:** Send `{"message": "Is Rigenforte safe during pregnancy?"}` — you should get a reply as Dr. Sami with the safety disclaimer and signature `"- Dr. Sami, Asper Clinical Support"`.

4. **Search fallback test (fuzzy product name):** Send `{"query": "Does the Maybelline Age Rewind work for dark circles?"}` (or use `message` instead of `query`). Expect: `persona: "Ms. Zain"`, a helpful reply, and `recommended_products` containing the resolved product (handle like `maybelline-instant-age-rewind-eraser-...`, variant `id` for Quick Add, `title`, `price`, `image`). Requires `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_API_TOKEN` (or `SHOPIFY_STOREFRONT_TOKEN` / `SHOPIFY_ACCESS_TOKEN`) to be set.

   ```bash
   curl -i -X POST https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/beauty-assistant \
     -H "Authorization: Bearer [YOUR_ANON_KEY]" \
     -H "Content-Type: application/json" \
     -d '{"query":"Does the Maybelline Age Rewind work for dark circles?"}'
   ```

---

## References

- **Implementation:** `supabase/functions/beauty-assistant/index.ts`
- **Architecture:** `docs/ASPER_AI_PROTOCOL_ARCHITECTURE.md`
- **Secrets and Shopify:** `docs/SHOPIFY_EDGE_FUNCTIONS_SECRETS.md`
