
CREATE OR REPLACE FUNCTION public.validate_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF length(trim(NEW.full_name)) < 1 OR length(NEW.full_name) > 100 THEN
    RAISE EXCEPTION 'Invalid full_name length';
  END IF;
  IF length(trim(NEW.ssc_roll)) < 1 OR length(NEW.ssc_roll) > 50 THEN
    RAISE EXCEPTION 'Invalid ssc_roll length';
  END IF;
  IF length(trim(NEW.mobile_number)) < 7 OR length(NEW.mobile_number) > 20 THEN
    RAISE EXCEPTION 'Invalid mobile_number length';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_lead_before_insert
  BEFORE INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.validate_lead();
