-- New table for gift claims (Name + WhatsApp only)
CREATE TABLE public.gift_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gift_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert gift claims"
ON public.gift_claims
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "No public read access to gift claims"
ON public.gift_claims
FOR SELECT
TO public
USING (false);

-- Validation trigger (length checks)
CREATE OR REPLACE FUNCTION public.validate_gift_claim()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF length(trim(NEW.full_name)) < 2 OR length(NEW.full_name) > 100 THEN
    RAISE EXCEPTION 'Invalid full_name length';
  END IF;
  IF length(trim(NEW.whatsapp_number)) < 7 OR length(NEW.whatsapp_number) > 20 THEN
    RAISE EXCEPTION 'Invalid whatsapp_number length';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_gift_claim_trigger
BEFORE INSERT OR UPDATE ON public.gift_claims
FOR EACH ROW
EXECUTE FUNCTION public.validate_gift_claim();

-- Add school_name to leads for the enrollment form
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS school_name TEXT;