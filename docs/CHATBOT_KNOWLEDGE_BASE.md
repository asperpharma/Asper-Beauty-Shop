# Chatbot Knowledge Base — Products & Database

The **Asper Digital Pharmacist** (Beauty Assistant) learns from your database and product catalog. It does **not** use generic training — it fetches live product data for every conversation.

---

## Knowledge sources

| Table | Purpose |
|-------|---------|
| **`products`** | Main catalog — title, brand, price, category, skin_concerns, description. Queried by concern (e.g. acne, hydration) or keyword search. |
| **`documents`** | Richer content for AI — built from products. Used when product search returns no matches. Improves keyword and semantic matching. |

---

## How the chatbot uses it

1. **User message** → e.g. "I have dry skin, what do you recommend?"
2. **Detect concern** → `hydration` (from keyword mapping)
3. **Query products** → `skin_concerns` contains `hydration` → up to 12 products
4. **Fallback:** If no concern match → keyword search on title, brand, category, description
5. **Fallback:** If still empty → search `documents` by keyword
6. **Inject into prompt** → "**Relevant Products:** [list]. Recommend ONLY from these."
7. **AI response** → Uses only your products in recommendations

---

## Populating the knowledge base

### 1. Products table

- **Bulk upload:** Use the `bulk-product-upload` Edge Function to sync from Shopify.
- **Manual:** Insert/update rows in `products` via Supabase Dashboard or API.
- **Required columns:** `title`, `price`, `category`, `skin_concerns` (array), `brand`, `description`.

### 2. Documents table (optional but recommended)

The `documents` table holds richer content for AI. Populate it from products:

```powershell
# Requires admin JWT - call from your app or use Supabase Dashboard
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/generate-embeddings" `
  -H "Authorization: Bearer YOUR_ADMIN_JWT" `
  -H "Content-Type: application/json"
```

**When to run:** After adding or updating many products. Rebuilds all documents from current products.

---

## Skin concerns (concern slugs)

Used for product matching. Align with your `skin_concerns` column:

- `acne`, `anti-aging`, `hydration`, `sensitivity`, `dark-spots`
- `sun-protection`, `redness`, `cleansing`, `wrinkles`, `oily-skin`, `dry-skin`

---

## Website vs social webhooks

| Channel | Product fetch |
|---------|---------------|
| **Website chat** | ✅ Same logic — products + documents |
| **Gorgias webhook** | ✅ Same logic — products + documents |
| **ManyChat webhook** | ✅ Same logic — products + documents |

All channels use the same database and product knowledge.

---

*Last updated: Feb 2025*
