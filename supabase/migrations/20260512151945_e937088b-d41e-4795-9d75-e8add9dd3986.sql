CREATE POLICY "Admins can delete enrollments" ON public.enrollments FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gift_claims" ON public.gift_claims FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));