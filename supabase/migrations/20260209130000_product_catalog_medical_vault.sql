-- ==========================================
-- 1. THE PRODUCT BRAIN (Structured Intelligence)
-- Syncs from Shopify/Matrixify; parsed columns for AI and 3-Click.
-- ==========================================
CREATE TABLE IF NOT EXISTS public.product_catalog (
    id TEXT PRIMARY KEY, -- Matches Shopify Product ID or Handle
    title TEXT NOT NULL,
    inventory_total INTEGER DEFAULT 0,
    -- Parsed columns for AI speed
    primary_concern TEXT,       -- Parsed from 'Concern_*' tag
    regimen_step TEXT,         -- Parsed from 'Step_*' tag (e.g. step_1_cleanser)
    medical_tags TEXT[] DEFAULT '{}', -- All tags for deep search
    -- Tie-breakers
    bestseller_rank INTEGER DEFAULT 999,
    -- Ghost data (future proofing)
    biomarker_target TEXT,
    contraindications TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.product_catalog IS 'Product Brain: synced from Shopify/Matrixify; parsed Concern_* and Step_* for 3-Click and Prescription Bridge.';

-- Index for the "3-Click Solution" query speed
CREATE INDEX IF NOT EXISTS idx_product_catalog_concern_step
ON public.product_catalog(primary_concern, regimen_step);

CREATE INDEX IF NOT EXISTS idx_product_catalog_medical_tags
ON public.product_catalog USING GIN(medical_tags);

-- ==========================================
-- 2. THE MEDICAL VAULT (Ghost Mode / Secure)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.medical_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Medical data (encrypted concepts in future)
    blood_type TEXT,
    deficiencies JSONB DEFAULT '{}', -- e.g. {"iron": "low", "vit_d": "deficient"}
    allergies TEXT[] DEFAULT '{}',

    -- Secure file reference (link to private storage bucket)
    report_storage_path TEXT
);

COMMENT ON TABLE public.medical_vault IS 'Ghost Mode: secure patient medical data; RLS ensures owner-only access.';

CREATE INDEX IF NOT EXISTS idx_medical_vault_user ON public.medical_vault(user_id);

-- ==========================================
-- 3. BIOMETRIC LOCK (Row Level Security)
-- ==========================================
ALTER TABLE public.medical_vault ENABLE ROW LEVEL SECURITY;

-- Policy: "Patient Confidentiality" — only the logged-in user sees their own data
DROP POLICY IF EXISTS "Patient Confidentiality: Owner Access Only" ON public.medical_vault;
CREATE POLICY "Patient Confidentiality: Owner Access Only"
ON public.medical_vault
FOR ALL
TO authenticated
USING ( user_id = auth.uid() )
WITH CHECK ( user_id = auth.uid() );

-- Product Brain: public read for app; service role / admin for write (sync)
ALTER TABLE public.product_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Product catalog is publicly readable" ON public.product_catalog;
CREATE POLICY "Product catalog is publicly readable"
ON public.product_catalog FOR SELECT TO anon, authenticated
USING ( true );

DROP POLICY IF EXISTS "Service role can manage product_catalog" ON public.product_catalog;
CREATE POLICY "Service role can manage product_catalog"
ON public.product_catalog FOR ALL TO service_role
USING ( true )
WITH CHECK ( true );

-- Admins can upsert product_catalog (for sync UI or scripts)
DROP POLICY IF EXISTS "Admins can manage product_catalog" ON public.product_catalog;
CREATE POLICY "Admins can manage product_catalog"
ON public.product_catalog FOR ALL TO authenticated
USING ( public.has_role(auth.uid(), 'admin') )
WITH CHECK ( public.has_role(auth.uid(), 'admin') );

-- Trigger: updated_at for product_catalog
CREATE OR REPLACE FUNCTION public.set_product_catalog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS product_catalog_updated_at ON public.product_catalog;
CREATE TRIGGER product_catalog_updated_at
BEFORE UPDATE ON public.product_catalog
FOR EACH ROW EXECUTE FUNCTION public.set_product_catalog_updated_at();
