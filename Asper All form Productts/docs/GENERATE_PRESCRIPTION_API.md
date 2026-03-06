# Generate Prescription — Edge Function API

**Route:** `POST /functions/v1/generate-prescription`

Processes the 3-Click logic and optionally persists the prescription to
`concierge_profiles`.

---

## Payload

### Format A (direct skin concern)

```json
{
  "skin_concern": "Acne & Blemishes",
  "skin_type": "Oily",
  "user_id": "optional-uuid-if-authenticated"
}
```

### Format B (Gorgias/ManyChat — concern_tag)

```json
{
  "concern_tag": "Concern_Acne",
  "skin_type": "Oily",
  "prescription_logic": {
    "cleanser": "Vichy Normaderm Phytosolution",
    "treatment": "La Roche-Posay Effaclar Duo+",
    "sunscreen": "Anthelios Oil Control"
  },
  "user_id": "optional-uuid-if-authenticated"
}
```

### Valid `skin_concern` values (Format A)

- `Acne & Blemishes`
- `Anti-Aging & Wrinkles`
- `Dryness & Hydration`
- `Sensitivity & Redness`

### Valid `concern_tag` values (Format B)

- `Concern_Acne` → Acne & Blemishes
- `Concern_AntiAging` → Anti-Aging & Wrinkles
- `Concern_Hydration` or `Concern_Dryness` → Dryness & Hydration (both
  supported; Shopify uses `Concern_Dryness`)
- `Concern_Sensitivity` → Sensitivity & Redness

### Valid `skin_type` values (optional)

- `Dry`, `Oily`, `Combination`, `Sensitive`, `Normal` (case-insensitive input;
  stored as Title Case)

---

## Response (200)

First reply is explicitly **Analyze → single recommendation**.

```json
{
  "prescription": {
    "phase": "recommendation",
    "type": "single_recommendation",
    "skin_concern": "Acne & Blemishes",
    "message": "For acne-prone skin, we must unclog pores without destroying your moisture barrier...",
    "recommended_routine": [
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
}
```

---

## Behavior

- **Without `user_id`:** Returns the prescription only (no persistence).
- **With `user_id`:** Upserts into `concierge_profiles` and returns the
  prescription. The chatbot can "remember" the customer's skin concern for
  future sessions.

---

## Deploy

```bash
supabase functions deploy generate-prescription
```

---

## Example (curl)

```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/generate-prescription" \
  -H "Authorization: Bearer YOUR_ANON_OR_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"skin_concern": "Dryness & Hydration", "user_id": "user-uuid-here"}'
```
