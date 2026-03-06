# Bulk Upload Feature — Test Guide

End-to-end testing guide for the bulk product upload feature.

## Prerequisites

- Bulk upload Edge Function deployed
- Sample Excel file with required columns
- Shopify store configured for import

## Required Excel Columns

| Column      | Required | Description                |
| ----------- | -------- | -------------------------- |
| title       | Yes      | Product name               |
| productType | Yes      | Category (e.g. Foundation) |
| description | No       | Product description        |
| brand       | No       | Brand name                 |

## Testing Flow

1. **Prepare data** — Run `node scripts/create-sample-xlsx.mjs` to generate
   `products-data.xlsx`
2. **Upload** — Use the bulk upload UI or API to submit the file
3. **Verify** — Check AI categorization, image generation queue, and Shopify
   upload

## Success Indicators

- [ ] File uploads without error
- [ ] Products are categorized correctly
- [ ] Image generation queue processes items
- [ ] Shopify receives products (if configured)

## Troubleshooting

| Error       | Cause           | Fix                              |
| ----------- | --------------- | -------------------------------- |
| 429 / rate  | Rate limiting   | Wait and retry; check API limits |
| Invalid CSV | Column mismatch | Verify column names and format   |
| Auth error  | Missing keys    | Check Supabase env vars          |

## Quick Checklist

- [ ] Run `npm run dev` (or port 8080 if using alternate config)
- [ ] Generate sample data: `node scripts/create-sample-xlsx.mjs`
- [ ] Upload via bulk upload endpoint
- [ ] Confirm products appear in Shopify
