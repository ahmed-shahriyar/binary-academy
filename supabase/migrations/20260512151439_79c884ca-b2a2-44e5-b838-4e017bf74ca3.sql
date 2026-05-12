ALTER TABLE public.leads REPLICA IDENTITY FULL;
ALTER TABLE public.gift_claims REPLICA IDENTITY FULL;
ALTER TABLE public.enrollments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gift_claims;
ALTER PUBLICATION supabase_realtime ADD TABLE public.enrollments;