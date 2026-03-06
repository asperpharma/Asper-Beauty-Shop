# get-products-by-concern — Edge Function API

**Route:** `GET /functions/v1/get-products-by-concern?concern=...` or
`POST /functions/v1/get-products-by-concern`

Returns regimen products for a given skin concern. Powers the **"See My
Regimen"** collection page.

---

## GET

```
GET /functions/v1/get-products-by-concern?concern=acne-blemishes
```

### Query param: `concern`

- `skin_concern`: e.g. `Acne & Blemishes`
- `concern_tag`: e.g. `Concern_Acne`
- `slug`: e.g. `acne-blemishes`

---

## POST

```json
{
  "concern": "acne-blemishes"
}
```

Alternative keys: `skin_concern`, `concern_tag`.

---

## Response (200)

```json
{
  "skin_concern": "Acne & Blemishes",
  "message": "For acne-prone skin, we must unclog pores without destroying your moisture barrier...",
  "products": [
    {
      "step": "Cleanse",
      "product_handle": "vichy-normaderm-phytosolution",
      "why": "..."
    },
    {
      "step": "Treat",
      "product_handle": "lrp-effaclar-duo-plus",
      "why": "..."
    },
    {
      "step": "Protect",
      "product_handle": "vichy-capital-soleil-mattifying",
      "why": "..."
    }
  ]
}
```

---

## Deploy

```bash
supabase functions deploy get-products-by-concern
```
