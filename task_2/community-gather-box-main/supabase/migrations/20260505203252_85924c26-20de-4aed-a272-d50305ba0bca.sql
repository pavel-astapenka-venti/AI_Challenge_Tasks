CREATE OR REPLACE FUNCTION public.cancel_rsvp(_event_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _uid UUID := auth.uid();
  _existing public.rsvps%ROWTYPE;
  _was_confirmed BOOLEAN;
  _promote UUID;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT * INTO _existing FROM public.rsvps
    WHERE event_id = _event_id AND user_id = _uid AND status <> 'cancelled'
    FOR UPDATE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF _existing.checked_in_at IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot cancel after check-in' USING ERRCODE = 'check_violation';
  END IF;

  UPDATE public.rsvps SET status = 'cancelled', updated_at = now()
    WHERE id = _existing.id;

  _was_confirmed := (_existing.status = 'confirmed');

  IF _was_confirmed THEN
    SELECT id INTO _promote FROM public.rsvps
      WHERE event_id = _event_id AND status = 'waitlist'
      ORDER BY created_at ASC LIMIT 1 FOR UPDATE;
    IF _promote IS NOT NULL THEN
      UPDATE public.rsvps
        SET status = 'confirmed',
            promoted_at = now(),
            acknowledged_promotion_at = NULL,
            updated_at = now()
        WHERE id = _promote;
    END IF;
  END IF;
END;
$function$;