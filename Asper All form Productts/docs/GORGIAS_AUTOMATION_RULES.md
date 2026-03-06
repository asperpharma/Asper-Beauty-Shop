# Gorgias Comment-to-Sale Automation Rules

**Purpose:** Link Instagram comments to the correct "Pharmacist Prescription"
via tags and macros.

---

## 1. The Comment-to-Sale Workflow

**Logic:** User comments keyword → Gorgias tags ticket → Auto-reply publicly →
Agent sends DM prescription.

### Rule A: The Acne Listener (For Post #2)

- **Trigger:** Message type is **Instagram Comment** AND Message body contains
  **Acne** OR **Pimple**
- **Action 1:** Add tag: `Lead - Acne`
- **Action 2:** Public Reply: "I have prepared your medical regimen. Please
  check your DMs for the full prescription!"
- **Next Step:** Agent sends **Routine - Acne & Oil Control** Macro via DM

### Rule B: The Anti-Aging Listener (For Post #6)

- **Trigger:** Message type is **Instagram Comment** AND Message body contains
  **Anti Aging** OR **Wrinkles**
- **Action 1:** Add tag: `Lead - Anti-Aging`
- **Action 2:** Public Reply: "Retinol requires a specific protocol. I have sent
  the safe starter kit details to your inbox."
- **Next Step:** Agent sends **Routine - Anti-Aging** Macro via DM

### Rule C: The Trust Listener (For Post #7)

- **Trigger:** Message type is **Instagram Comment** AND Message body contains
  **Fake** OR **Original** OR **Real**
- **Action 1:** Add tag: `Urgent - Trust`
- **Action 2:** Public Reply: "Hi there. We guarantee 100% Authentic Quality
  sourced directly from authorized distributors. I have DM'd you our safety
  guarantee."
- **Next Step:** Agent sends **Trust - Authenticity Guarantee** Macro via DM

---

## 2. DM Prescription Scripts

### Acne Prescription

Hello! As requested, here is the pharmacist-recommended regimen for Acne & Oil
Control:

1. **Cleanse:** Vichy Normaderm Phytosolution (Salicylic Acid)
2. **Treat:** La Roche-Posay Effaclar Duo+
3. **Protect:** Vichy Capital Soleil Mattifying

Shop the full kit here: [Link to Collection] Free Shipping on orders over 50
JOD.

### Anti-Aging Prescription

Hello! Here is the safe protocol for Anti-Aging & Retinol:

1. **Fortify:** Vichy Minéral 89
2. **Correct:** Vichy LiftActiv Retinol (Start 2x/week)
3. **Protect:** SPF 50+ (Mandatory)

Shop the protocol here: [Link to Collection] Payment via Cash on Delivery is
available.

---

## 3. Implementation Checklist

- [ ] Create Rules in Gorgias: Settings > Automations > Rules
- [ ] Replace [Link to Collection] with actual Shopify collection URLs
- [ ] Test each trigger with a sample comment
- [ ] Train agents to use tagged tickets and send the correct Macro via DM
