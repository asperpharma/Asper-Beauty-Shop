-- Digital Tray: regimen steps + get_products_by_concern (one per step) + get_tray_by_concern (JSON with nulls)
-- Step 1 = Cleanser, Step 2 = Treatment (active), Step 3 = Moisturizer/SPF (protection)

-- 1. Add regimen_step to products (nullable)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS regimen_step TEXT;

COMMENT ON COLUMN public.products.regimen_step IS 'Routine slot: step_1_cleanser, step_2_treatment, step_3_moisturizer. Null = not assigned to a tray slot.';

-- 2. Index for tray queries
CREATE INDEX IF NOT EXISTS idx_products_regimen_step
  ON public.products (regimen_step)
  WHERE regimen_step IS NOT NULL AND is_active = true;

-- 3. Backfill seed products with regimen_step (one product per logical match)
UPDATE public.products SET regimen_step = 'step_2_treatment'
WHERE id = (
  SELECT id FROM public.products
  WHERE (tags @> ARRAY['Concern_Hydration'] OR skin_concerns && ARRAY['hydration'])
    AND (title ILIKE '%Serum%' OR title ILIKE '%89%' OR title ILIKE '%Hyaluron%')
    AND regimen_step IS NULL
  LIMIT 1
);

UPDATE public.products SET regimen_step = 'step_3_moisturizer'
WHERE id = (
  SELECT id FROM public.products
  WHERE (tags @> ARRAY['Concern_Hydration'] OR tags @> ARRAY['Concern_Sensitivity'])
    AND (title ILIKE '%Fluide%' OR title ILIKE '%Moistur%' OR title ILIKE '%Sensitive%')
    AND regimen_step IS NULL
  LIMIT 1
);

UPDATE public.products SET regimen_step = 'step_2_treatment'
WHERE id = (
  SELECT id FROM public.products
  WHERE tags @> ARRAY['Concern_Acne']
    AND (title ILIKE '%Effaclar%' OR title ILIKE '%Duo%')
    AND regimen_step IS NULL
  LIMIT 1
);

UPDATE public.products SET regimen_step = 'step_2_treatment'
WHERE id = (
  SELECT id FROM public.products
  WHERE tags @> ARRAY['Concern_Acne'] AND title ILIKE '%Normaderm%' AND regimen_step IS NULL
  LIMIT 1
);

UPDATE public.products SET regimen_step = 'step_2_treatment'
WHERE id = (
  SELECT id FROM public.products
  WHERE (tags @> ARRAY['Concern_AntiAging'] OR tags @> ARRAY['Concern_Pigmentation'])
    AND title ILIKE '%LiftActiv%' AND regimen_step IS NULL
  LIMIT 1
);

-- 4. get_products_by_concern(concern) — one product per step (only steps that have a product)
CREATE OR REPLACE FUNCTION public.get_products_by_concern(p_concern TEXT)
RETURNS TABLE (
  regimen_step TEXT,
  product_id UUID,
  title TEXT,
  price NUMERIC,
  description TEXT,
  category TEXT,
  subcategory TEXT,
  brand TEXT,
  image_url TEXT,
  skin_concerns TEXT[],
  tags TEXT[],
  is_on_sale BOOLEAN,
  discount_percent NUMERIC,
  volume_ml TEXT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT
    p.regimen_step,
    p.id AS product_id,
    p.title,
    p.price,
    p.description,
    p.category,
    p.subcategory,
    p.brand,
    p.image_url,
    p.skin_concerns,
    p.tags,
    COALESCE(p.is_on_sale, false),
    p.discount_percent,
    p.volume_ml
  FROM (
    SELECT DISTINCT ON (p.regimen_step) p.*
    FROM public.products p
    WHERE p.is_active = true
      AND p.regimen_step IS NOT NULL
      AND (p.tags @> ARRAY[NULLIF(TRIM(p_concern), '')] OR p_concern IS NULL OR NULLIF(TRIM(p_concern), '') = ANY(COALESCE(p.tags, ARRAY[]::TEXT[])))
    ORDER BY p.regimen_step, p.id
  ) p
  ORDER BY p.regimen_step;
$$;

COMMENT ON FUNCTION public.get_products_by_concern(TEXT) IS 'Digital Tray: one product per regimen step for the given concern (tag e.g. Concern_Hydration).';

-- 5. get_tray_by_concern(concern) — single JSON with step_1, step_2, step_3; null for missing steps
CREATE OR REPLACE FUNCTION public.get_tray_by_concern(p_concern TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
DECLARE
  step_keys TEXT[] := ARRAY['step_1_cleanser', 'step_2_treatment', 'step_3_moisturizer'];
  tray JSONB := '{}';
  r RECORD;
  prod JSONB;
BEGIN
  FOR r IN
    SELECT
      sub.regimen_step,
      jsonb_build_object(
        'id', sub.id,
        'title', sub.title,
        'price', sub.price,
        'description', sub.description,
        'category', sub.category,
        'subcategory', sub.subcategory,
        'brand', sub.brand,
        'image_url', sub.image_url,
        'skin_concerns', sub.skin_concerns,
        'tags', sub.tags,
        'is_on_sale', COALESCE(sub.is_on_sale, false),
        'discount_percent', sub.discount_percent,
        'volume_ml', sub.volume_ml,
        'regimen_step', sub.regimen_step
      ) AS product
    FROM (
      SELECT DISTINCT ON (p.regimen_step) p.*
      FROM public.products p
      WHERE p.is_active = true
        AND p.regimen_step IS NOT NULL
        AND (p.tags @> ARRAY[NULLIF(TRIM(p_concern), '')] OR p_concern IS NULL OR NULLIF(TRIM(p_concern), '') = ANY(COALESCE(p.tags, ARRAY[]::TEXT[])))
      ORDER BY p.regimen_step, p.id
    ) sub
    ORDER BY sub.regimen_step
  LOOP
    tray := tray || jsonb_build_object(r.regimen_step, r.product);
  END LOOP;

  -- Ensure all three steps exist; null for missing
  tray := jsonb_build_object(
    'step_1_cleanser', tray->'step_1_cleanser',
    'step_2_treatment', tray->'step_2_treatment',
    'step_3_moisturizer', tray->'step_3_moisturizer',
    'concern', NULLIF(TRIM(p_concern), '')
  );
  RETURN tray;
END;
$$;

COMMENT ON FUNCTION public.get_tray_by_concern(TEXT) IS 'Digital Tray: JSON with step_1_cleanser, step_2_treatment, step_3_moisturizer (null = Consult Pharmacist).';
