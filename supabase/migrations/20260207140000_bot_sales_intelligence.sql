-- Sales Intelligence: cross-sell rules and bot lead capture.
-- See docs/BOT_SALES_INTELLIGENCE_EXECUTION.md and docs/SALES_INTELLIGENCE_AND_PHARMACIST_PLAYBOOKS.md.

-- Cross-sell / up-sell: after recommending a concern or product, suggest add-ons.
CREATE TABLE IF NOT EXISTS public.cross_sell_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_concern text NOT NULL,
  add_on_product_ids uuid[] NOT NULL DEFAULT '{}',
  label_en text NOT NULL DEFAULT 'Complete your routine',
  label_ar text NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cross_sell_rules_concern ON public.cross_sell_rules (trigger_concern);
COMMENT ON TABLE public.cross_sell_rules IS 'Bot cross-sell: which product IDs to suggest after a concern. Used by get-products-by-concern or beauty-assistant.';

-- Bot leads: capture email/WhatsApp when user says "save my routine" or similar.
CREATE TABLE IF NOT EXISTS public.bot_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_email text NULL,
  contact_whatsapp text NULL,
  concern text NULL,
  skin_type text NULL,
  recommended_product_ids uuid[] NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'chatbot',
  converted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT at_least_one_contact CHECK (contact_email IS NOT NULL OR contact_whatsapp IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_bot_leads_created ON public.bot_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_leads_converted ON public.bot_leads (converted) WHERE converted = true;
COMMENT ON TABLE public.bot_leads IS 'Leads captured by bot (Save My Routine / follow-up). Track conversion later.';

ALTER TABLE public.cross_sell_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_leads ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.cross_sell_rules FROM anon;
GRANT SELECT ON public.cross_sell_rules TO anon, authenticated;
GRANT ALL ON public.cross_sell_rules TO service_role;

-- Only Edge Function (service_role) inserts bot_leads; admins read
REVOKE ALL ON public.bot_leads FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bot_leads TO service_role;

CREATE POLICY "Anyone can read cross_sell_rules"
ON public.cross_sell_rules FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Service role manages cross_sell_rules"
ON public.cross_sell_rules FOR ALL TO service_role;

CREATE POLICY "Admins can read bot_leads"
ON public.bot_leads FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role full access bot_leads"
ON public.bot_leads FOR ALL TO service_role;
