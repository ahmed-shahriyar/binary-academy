
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  ssc_roll TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous visitors) can submit a lead
CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No public read access (PII protection). Admins access via backend dashboard.
CREATE POLICY "No public read access to leads"
  ON public.leads FOR SELECT
  USING (false);
