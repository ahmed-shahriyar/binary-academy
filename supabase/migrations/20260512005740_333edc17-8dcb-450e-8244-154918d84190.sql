CREATE OR REPLACE FUNCTION public.notify_new_record()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_secret text;
  v_url text := 'https://binaryacademy.lovable.app/api/public/notify-telegram';
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
$function$;

DROP TRIGGER IF EXISTS trg_notify_enrollments ON public.enrollments;
CREATE TRIGGER trg_notify_enrollments
AFTER INSERT ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.notify_new_record();

DROP TRIGGER IF EXISTS trg_notify_gift_claims ON public.gift_claims;
CREATE TRIGGER trg_notify_gift_claims
AFTER INSERT ON public.gift_claims
FOR EACH ROW EXECUTE FUNCTION public.notify_new_record();