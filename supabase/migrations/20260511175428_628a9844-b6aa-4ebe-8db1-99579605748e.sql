
-- Private secrets table (RLS-locked, only service role can read)
CREATE TABLE IF NOT EXISTS public.app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.app_secrets ENABLE ROW LEVEL SECURITY;

-- Generate and store a random shared secret for the notify webhook
INSERT INTO public.app_secrets (key, value)
VALUES ('telegram_notify_secret', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (key) DO NOTHING;

-- Enable HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function: POSTs new record to the notify webhook
CREATE OR REPLACE FUNCTION public.notify_new_record()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_secret text;
  v_url text := 'https://project--dd0d435f-01c8-478f-8118-7fc277583f68.lovable.app/api/public/notify-telegram';
BEGIN
  SELECT value INTO v_secret FROM public.app_secrets WHERE key = 'telegram_notify_secret' LIMIT 1;

  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Notify-Secret', v_secret
    ),
    body := jsonb_build_object(
      'type', TG_TABLE_NAME,
      'record', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_enrollment ON public.enrollments;
CREATE TRIGGER trg_notify_enrollment
  AFTER INSERT ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_record();

DROP TRIGGER IF EXISTS trg_notify_gift_claim ON public.gift_claims;
CREATE TRIGGER trg_notify_gift_claim
  AFTER INSERT ON public.gift_claims
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_record();
