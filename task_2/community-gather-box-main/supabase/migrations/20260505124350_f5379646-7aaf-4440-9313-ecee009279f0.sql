
ALTER TABLE public.rsvps
  ADD COLUMN IF NOT EXISTS promoted_at timestamptz,
  ADD COLUMN IF NOT EXISTS acknowledged_promotion_at timestamptz;

-- Update cancel_rsvp to stamp promoted_at
CREATE OR REPLACE FUNCTION public.cancel_rsvp(_event_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _uid UUID := auth.uid();
  _was_confirmed BOOLEAN;
  _promote UUID;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  UPDATE public.rsvps SET status = 'cancelled', updated_at = now()
    WHERE event_id = _event_id AND user_id = _uid AND status <> 'cancelled'
    RETURNING (status = 'confirmed') INTO _was_confirmed;

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

-- Acknowledge promotion notice
CREATE OR REPLACE FUNCTION public.acknowledge_promotion(_rsvp_id uuid)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  UPDATE public.rsvps
    SET acknowledged_promotion_at = now()
    WHERE id = _rsvp_id AND user_id = auth.uid();
$$;

-- Trigger: when capacity increases (or becomes null), auto-promote FIFO
CREATE OR REPLACE FUNCTION public.promote_waitlist_on_capacity_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  _confirmed_count INT;
  _slots INT;
  _promote UUID;
BEGIN
  IF NEW.capacity IS NOT NULL AND OLD.capacity IS NOT NULL AND NEW.capacity <= OLD.capacity THEN
    RETURN NEW;
  END IF;

  LOOP
    SELECT count(*) INTO _confirmed_count FROM public.rsvps
      WHERE event_id = NEW.id AND status = 'confirmed';

    IF NEW.capacity IS NOT NULL AND _confirmed_count >= NEW.capacity THEN
      EXIT;
    END IF;

    SELECT id INTO _promote FROM public.rsvps
      WHERE event_id = NEW.id AND status = 'waitlist'
      ORDER BY created_at ASC LIMIT 1 FOR UPDATE;

    EXIT WHEN _promote IS NULL;

    UPDATE public.rsvps
      SET status = 'confirmed',
          promoted_at = now(),
          acknowledged_promotion_at = NULL,
          updated_at = now()
      WHERE id = _promote;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_events_capacity_promote ON public.events;
CREATE TRIGGER trg_events_capacity_promote
  AFTER UPDATE OF capacity ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.promote_waitlist_on_capacity_change();

-- Realtime
ALTER TABLE public.rsvps REPLICA IDENTITY FULL;
DO $$ BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'rsvps';
  IF NOT FOUND THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps';
  END IF;
END $$;
