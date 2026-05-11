
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ssc_roll TEXT NOT NULL,
  school TEXT NOT NULL,
  mobile TEXT NOT NULL,
  batch TEXT,
  tier TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_enrollment()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status NOT IN ('New','In Touch','Confirmed','Paid') THEN
    RAISE EXCEPTION 'Invalid status %', NEW.status;
  END IF;
  IF length(trim(NEW.name)) < 1 OR length(NEW.name) > 150 THEN
    RAISE EXCEPTION 'Invalid name length';
  END IF;
  IF length(trim(NEW.mobile)) < 7 OR length(NEW.mobile) > 25 THEN
    RAISE EXCEPTION 'Invalid mobile length';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS validate_enrollment_trg ON public.enrollments;
CREATE TRIGGER validate_enrollment_trg BEFORE INSERT OR UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.validate_enrollment();

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert enrollments" ON public.enrollments;
CREATE POLICY "Anyone can insert enrollments" ON public.enrollments
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read enrollments" ON public.enrollments;
CREATE POLICY "Anyone can read enrollments" ON public.enrollments
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can update enrollments" ON public.enrollments;
CREATE POLICY "Anyone can update enrollments" ON public.enrollments
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS enrollments_created_at_idx ON public.enrollments (created_at DESC);
CREATE INDEX IF NOT EXISTS enrollments_status_idx ON public.enrollments (status);
