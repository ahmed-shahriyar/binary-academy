
-- Relax validate_enrollment for partial gift-claim rows
CREATE OR REPLACE FUNCTION public.validate_enrollment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status NOT IN ('New','In Touch','Confirmed','Paid','Gift Claimed') THEN
    RAISE EXCEPTION 'Invalid status %', NEW.status;
  END IF;
  IF length(trim(NEW.name)) < 1 OR length(NEW.name) > 150 THEN
    RAISE EXCEPTION 'Invalid name length';
  END IF;
  IF length(trim(NEW.mobile)) < 7 OR length(NEW.mobile) > 25 THEN
    RAISE EXCEPTION 'Invalid mobile length';
  END IF;
  IF NEW.status <> 'Gift Claimed' THEN
    IF length(trim(coalesce(NEW.ssc_roll,''))) < 1 THEN
      RAISE EXCEPTION 'ssc_roll required';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_validate_enrollment ON public.enrollments;
CREATE TRIGGER trg_validate_enrollment
BEFORE INSERT OR UPDATE ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.validate_enrollment();

CREATE INDEX IF NOT EXISTS idx_enrollments_mobile ON public.enrollments(mobile);

-- Notify on completion (status transitions away from Gift Claimed)
CREATE OR REPLACE FUNCTION public.notify_enrollment_completed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_secret text;
  v_url text := 'https://binaryacademy.lovable.app/api/public/notify-telegram';
BEGIN
  IF OLD.status = 'Gift Claimed' AND NEW.status <> 'Gift Claimed' THEN
    SELECT value INTO v_secret FROM public.app_secrets WHERE key = 'telegram_notify_secret' LIMIT 1;
    PERFORM net.http_post(
      url := v_url,
      headers := jsonb_build_object(
        'Content-Type','application/json',
        'X-Notify-Secret', v_secret
      ),
      body := jsonb_build_object(
        'type','enrollment_completed',
        'record', to_jsonb(NEW)
      )
    );
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_notify_enrollment_completed ON public.enrollments;
CREATE TRIGGER trg_notify_enrollment_completed
AFTER UPDATE ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.notify_enrollment_completed();

-- Re-attach existing insert trigger (idempotent safety)
DROP TRIGGER IF EXISTS trg_notify_enrollments ON public.enrollments;
CREATE TRIGGER trg_notify_enrollments
AFTER INSERT ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.notify_new_record();

DROP TRIGGER IF EXISTS trg_notify_gift_claims ON public.gift_claims;
CREATE TRIGGER trg_notify_gift_claims
AFTER INSERT ON public.gift_claims
FOR EACH ROW EXECUTE FUNCTION public.notify_new_record();
