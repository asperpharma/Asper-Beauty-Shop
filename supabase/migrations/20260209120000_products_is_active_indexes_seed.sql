-- Products: is_active, indexes for filtering/speed, baseline RLS (public read active only), seed SKUs
-- Aligns with "flexibility and scale" and Digital Tray / bot recommendations.

-- 1. Add is_active (default true so existing rows stay visible)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.products.is_active IS 'When false, product is hidden from storefront and search (soft delete).';

-- 2. Indexes for high-performance filtering
CREATE INDEX IF NOT EXISTS idx_products_is_active
  ON public.products (is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_products_category
  ON public.products (category);

CREATE INDEX IF NOT EXISTS idx_products_brand
  ON public.products (brand) WHERE brand IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_skin_concerns
  ON public.products USING GIN (skin_concerns) WHERE skin_concerns IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_updated_at
  ON public.products (updated_at DESC);

-- 3. Baseline RLS: public read-only for active products only
DROP POLICY IF EXISTS "Products are publicly viewable" ON public.products;

CREATE POLICY "Products are publicly viewable"
  ON public.products FOR SELECT
  USING (is_active = true);

-- 4. Seed 3–5 sample SKUs (real brands) for filtering and Digital Tray demo
INSERT INTO public.products (
  title,
  price,
  description,
  category,
  subcategory,
  brand,
  image_url,
  skin_concerns,
  tags,
  volume_ml,
  is_active
) VALUES
  (
    'Minéral 89 Hyaluronic Acid Face Serum',
    24.99,
    'Lightweight serum with 89% Vichy Volcanic Water and hyaluronic acid. Strengthens skin barrier, hydrates for 48h.',
    'Skincare',
    'Face',
    'Vichy',
    NULL,
    ARRAY['hydration', 'anti-aging', 'sensitivity'],
    ARRAY['bestseller', 'Concern_Hydration'],
    '50 ml',
    true
  ),
  (
    'Normaderm Phytosolution Daily Care',
    18.50,
    'Purifying gel cream for oily, blemish-prone skin. Salicylic acid and niacinamide. Non-comedogenic.',
    'Skincare',
    'Face',
    'Vichy',
    NULL,
    ARRAY['acne', 'oily-skin'],
    ARRAY['Concern_Acne'],
    '50 ml',
    true
  ),
  (
    'Effaclar Duo (+) Anti-Blemish Cream',
    22.00,
    'Dual action: niacinamide + salicylic acid. Reduces blemishes and marks, prevents new ones.',
    'Skincare',
    'Face',
    'La Roche-Posay',
    NULL,
    ARRAY['acne', 'oily-skin'],
    ARRAY['Concern_Acne', 'pharmacist-verified'],
    '40 ml',
    true
  ),
  (
    'LiftActiv Vitamin C Serum',
    32.00,
    '15% vitamin C, peptides, and niacinamide. Brightens, evens tone, reduces dark spots.',
    'Skincare',
    'Face',
    'Vichy',
    NULL,
    ARRAY['anti-aging', 'pigmentation', 'brightening'],
    ARRAY['Concern_AntiAging', 'Concern_Pigmentation'],
    '30 ml',
    true
  ),
  (
    'Toleriane Sensitive Fluide',
    19.00,
    'Minimalist moisturizer for sensitive skin. Paraben-free, fragrance-free. Soothing niacinamide.',
    'Skincare',
    'Face',
    'La Roche-Posay',
    NULL,
    ARRAY['sensitivity', 'redness'],
    ARRAY['Concern_Sensitivity'],
    '    40 ml',
    true
  );
