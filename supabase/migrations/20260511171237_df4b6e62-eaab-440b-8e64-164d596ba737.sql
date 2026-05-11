ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS course text;
UPDATE public.enrollments SET course = CASE
  WHEN tier ILIKE '%hybrid%' THEN 'Hybrid'
  WHEN tier ILIKE '%flex%' THEN 'Flex'
  WHEN tier ILIKE '%online%' OR tier ILIKE '%pro%' THEN 'Online Pro'
  ELSE course
END WHERE course IS NULL;