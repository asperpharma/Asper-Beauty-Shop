-- Add confirmation_token column for order tracking (used by create-cod-order edge function)
-- Default value generated for new rows; existing rows get a unique token
ALTER TABLE public.cod_orders
ADD COLUMN IF NOT EXISTS confirmation_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex');

-- Backfill existing rows that may have NULL
UPDATE public.cod_orders
SET confirmation_token = encode(gen_random_bytes(32), 'hex')
WHERE confirmation_token IS NULL;
