
CREATE OR REPLACE FUNCTION public.validate_event_feedback()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE _ev public.events%ROWTYPE;
BEGIN
  SELECT * INTO _ev FROM public.events WHERE id = NEW.event_id;
  IF _ev.end_at > now() THEN RAISE EXCEPTION 'Event has not ended yet'; END IF;
  RETURN NEW;
END;
$$;
