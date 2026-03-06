# Shop connection

Your Asper Beauty Shop app is connected to:

| What | Where | Used for |
|------|--------|----------|
| **Shopify** | `lovable-project-milns.myshopify.com` | Cart, checkout, Storefront API (create cart → redirect to Shopify checkout) |
| **Supabase** | `rgehleqcubtmcwyipyvi.supabase.co` | Products table, Auth, Edge Functions (beauty-assistant, bulk-product-upload, create-cod-order, etc.) |
| **Live site** | https://https-www-asperbeautyshop-com.lovable.app | Canonical URL; set in `VITE_SITE_URL` / `VITE_LOVABLE_URL` |

## Env vars (production)

In **Lovable** (or your host) set the same variables as in `.env` / `.env.production`:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
- `VITE_SITE_URL`, `VITE_LOVABLE_URL`
- `VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_TOKEN`, `VITE_SHOPIFY_API_VERSION`
- `VITE_HCAPTCHA_SITE_KEY` (if using auth forms)
- `VITE_GEMINI_API_KEY` (optional; Asper Intelligence page)

## Shopify

- **Admin:** https://admin.shopify.com/store/lovable-project-milns  
- **Storefront API token:** from Admin → Settings → Apps and sales channels → Develop apps → Create app → Configure Storefront API scopes → install app → get **Storefront access token**. Put it in `VITE_SHOPIFY_STOREFRONT_TOKEN`.
- Cart flow: Add to cart in app → Shopify Storefront API creates cart → Checkout opens Shopify-hosted checkout.

## Supabase

- **Dashboard:** https://rgehleqcubtmcwyipyvi.supabase.co  
- **Products:** Table `products` is the catalog (Shop page, collections). Sync or import from Shopify/CSV as needed.
- **Auth redirect URL:** Add `https://https-www-asperbeautyshop-com.lovable.app/**` (and custom domain if used) in Supabase → Authentication → URL Configuration.

## Chatbot — connect all channels

One backend (Beauty Assistant) powers the website widget and social/webhook channels. Response format: `{ "reply": "..." }`.

| Channel | URL or action |
|---------|----------------|
| **Website** | Chat is on every page (floating button, Header, Footer). Event: `open-beauty-assistant`. |
| **Deep links** | `https://https-www-asperbeautyshop-com.lovable.app/?intent=acne&source=ig` (use in bios/posts). |
| **Gorgias** | POST `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=gorgias` |
| **ManyChat** (IG, Messenger, WhatsApp) | POST `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=manychat` |

**Supabase:** Edge Function **beauty-assistant** → Secrets: set `GEMINI_API_KEY` or `LOVABLE_API_KEY` for webhook replies.

Full setup: [CHATBOT_SOCIAL_MEDIA_SETUP.md](CHATBOT_SOCIAL_MEDIA_SETUP.md).
