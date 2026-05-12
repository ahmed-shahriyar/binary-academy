ALTER TABLE public.gift_claims NO FORCE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON TABLE public.gift_claims TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can insert gift_claims" ON public.gift_claims;
DROP POLICY IF EXISTS "Anyone can insert gift claims" ON public.gift_claims;

CREATE POLICY "Anyone can insert gift claims"
ON public.gift_claims
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
