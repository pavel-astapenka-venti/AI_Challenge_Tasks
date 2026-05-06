
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Host members view attendee profiles" ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.rsvps r JOIN public.events e ON e.id = r.event_id
    WHERE r.user_id = profiles.user_id AND public.is_host_member(auth.uid(), e.host_id)
  ));

CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'))
    ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.profiles (user_id, email, display_name)
  SELECT id, email, COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name')
  FROM auth.users
  ON CONFLICT (user_id) DO NOTHING;

ALTER TABLE public.rsvps ADD COLUMN checked_in_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.check_in_rsvp(_rsvp_id UUID, _undo BOOLEAN DEFAULT false)
RETURNS public.rsvps LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _r public.rsvps%ROWTYPE;
  _host UUID;
BEGIN
  SELECT r.* INTO _r FROM public.rsvps r WHERE r.id = _rsvp_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'RSVP not found'; END IF;
  SELECT e.host_id INTO _host FROM public.events e WHERE e.id = _r.event_id;
  IF NOT public.is_host_member(auth.uid(), _host) THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF _r.status <> 'confirmed' THEN RAISE EXCEPTION 'Only confirmed RSVPs can be checked in'; END IF;

  UPDATE public.rsvps
    SET checked_in_at = CASE WHEN _undo THEN NULL ELSE COALESCE(checked_in_at, now()) END,
        updated_at = now()
    WHERE id = _rsvp_id RETURNING * INTO _r;
  RETURN _r;
END;
$$;
