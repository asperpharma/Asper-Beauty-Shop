# Connect to Shopify

Set these in Lovable or .env:

- VITE_SHOPIFY_STORE_DOMAIN = your-store.myshopify.com
- VITE_SHOPIFY_STOREFRONT_TOKEN = Storefront API token from Shopify Admin

Get the token: Shopify Admin → Settings → Apps → Develop apps → your app → API credentials → Storefront API access token.

Cart and Pay with Card (Shopify) use this. SITE_URL in Supabase create-cod-order secrets = your live site URL for COD emails.
