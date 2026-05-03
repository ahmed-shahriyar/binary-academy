CREATE TABLE public.gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert gifts"
ON public.gifts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "No public read access to gifts"
ON public.gifts
FOR SELECT
TO public
USING (false);

CREATE OR REPLACE FUNCTION public.validate_gift()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF length(trim(NEW.full_name)) < 2 OR length(NEW.full_name) > 100 THEN
    RAISE EXCEPTION 'Invalid full_name length';
  END IF;
  IF length(trim(NEW.phone_number)) < 7 OR length(NEW.phone_number) > 20 THEN
    RAISE EXCEPTION 'Invalid phone_number length';
  END IF;
  IF length(trim(NEW.whatsapp_number)) < 7 OR length(NEW.whatsapp_number) > 20 THEN
    RAISE EXCEPTION 'Invalid whatsapp_number length';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_gift_trigger
BEFORE INSERT OR UPDATE ON public.gifts
FOR EACH ROW EXECUTE FUNCTION public.validate_gift();