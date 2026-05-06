CREATE OR REPLACE FUNCTION public.create_rsvp(_event_id uuid)
 RETURNS rsvps
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _uid UUID := auth.uid();
  _event public.events%ROWTYPE;
  _confirmed_count INT;
  _new_status public.rsvp_status;
  _existing public.rsvps%ROWTYPE;
  _has_existing BOOLEAN;
  _result public.rsvps%ROWTYPE;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT * INTO _event FROM public.events WHERE id = _event_id AND status = 'published';
  IF NOT FOUND THEN RAISE EXCEPTION 'Event not available'; END IF;

  PERFORM 1 FROM public.rsvps WHERE event_id = _event_id AND status = 'confirmed' FOR UPDATE;

  SELECT * INTO _existing FROM public.rsvps WHERE event_id = _event_id AND user_id = _uid;
  _has_existing := FOUND;

  IF _has_existing AND _existing.status <> 'cancelled' THEN
    RETURN _existing;
  END IF;

  SELECT count(*) INTO _confirmed_count FROM public.rsvps
    WHERE event_id = _event_id AND status = 'confirmed';

  IF _event.capacity IS NULL OR _confirmed_count < _event.capacity THEN
    _new_status := 'confirmed';
  ELSE
    _new_status := 'waitlist';
  END IF;

  IF _has_existing THEN
    UPDATE public.rsvps SET status = _new_status, updated_at = now()
      WHERE id = _existing.id RETURNING * INTO _result;
  ELSE
    INSERT INTO public.rsvps (event_id, user_id, status)
      VALUES (_event_id, _uid, _new_status) RETURNING * INTO _result;
  END IF;

  RETURN _result;
END;
$function$;