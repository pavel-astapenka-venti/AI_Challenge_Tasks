
-- RSVP status enum
CREATE TYPE public.rsvp_status AS ENUM ('confirmed', 'waitlist', 'cancelled');

CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status public.rsvp_status NOT NULL DEFAULT 'confirmed',
  ticket_code TEXT NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id),
  UNIQUE (ticket_code)
);

CREATE INDEX idx_rsvps_event_status ON public.rsvps(event_id, status);
CREATE INDEX idx_rsvps_user ON public.rsvps(user_id);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Users can see their own RSVPs
CREATE POLICY "Users view own rsvps" ON public.rsvps
  FOR SELECT USING (auth.uid() = user_id);

-- Hosts can see RSVPs for their events
CREATE POLICY "Hosts view event rsvps" ON public.rsvps
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.events e
    JOIN public.host_profiles hp ON hp.id = e.host_id
    WHERE e.id = rsvps.event_id AND hp.user_id = auth.uid()
  ));

-- Users update their own RSVPs (for cancel)
CREATE POLICY "Users update own rsvps" ON public.rsvps
  FOR UPDATE USING (auth.uid() = user_id);

-- Atomic RSVP creation enforcing capacity, with waitlist fallback
CREATE OR REPLACE FUNCTION public.create_rsvp(_event_id UUID)
RETURNS public.rsvps
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _event public.events%ROWTYPE;
  _confirmed_count INT;
  _new_status public.rsvp_status;
  _existing public.rsvps%ROWTYPE;
  _result public.rsvps%ROWTYPE;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT * INTO _event FROM public.events WHERE id = _event_id AND status = 'published';
  IF NOT FOUND THEN RAISE EXCEPTION 'Event not available'; END IF;

  -- Lock confirmed rows for this event to prevent capacity races
  PERFORM 1 FROM public.rsvps WHERE event_id = _event_id AND status = 'confirmed' FOR UPDATE;

  SELECT * INTO _existing FROM public.rsvps WHERE event_id = _event_id AND user_id = _uid;

  IF FOUND AND _existing.status <> 'cancelled' THEN
    RETURN _existing;
  END IF;

  SELECT count(*) INTO _confirmed_count FROM public.rsvps
    WHERE event_id = _event_id AND status = 'confirmed';

  IF _event.capacity IS NULL OR _confirmed_count < _event.capacity THEN
    _new_status := 'confirmed';
  ELSE
    _new_status := 'waitlist';
  END IF;

  IF FOUND THEN
    UPDATE public.rsvps SET status = _new_status, updated_at = now()
      WHERE id = _existing.id RETURNING * INTO _result;
  ELSE
    INSERT INTO public.rsvps (event_id, user_id, status)
      VALUES (_event_id, _uid, _new_status) RETURNING * INTO _result;
  END IF;

  RETURN _result;
END;
$$;

-- Cancel: also promote first waitlister to confirmed
CREATE OR REPLACE FUNCTION public.cancel_rsvp(_event_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
      UPDATE public.rsvps SET status = 'confirmed', updated_at = now() WHERE id = _promote;
    END IF;
  END IF;
END;
$$;

CREATE TRIGGER rsvps_set_updated BEFORE UPDATE ON public.rsvps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
