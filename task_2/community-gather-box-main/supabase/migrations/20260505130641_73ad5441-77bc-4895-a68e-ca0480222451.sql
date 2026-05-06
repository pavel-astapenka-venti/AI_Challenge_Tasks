
-- Hidden flags
ALTER TABLE public.events ADD COLUMN hidden_at TIMESTAMPTZ;

-- Feedback
CREATE TABLE public.event_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

CREATE OR REPLACE FUNCTION public.validate_event_feedback()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE _ev public.events%ROWTYPE;
BEGIN
  SELECT * INTO _ev FROM public.events WHERE id = NEW.event_id;
  IF _ev.end_at > now() THEN RAISE EXCEPTION 'Event has not ended yet'; END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_feedback
  BEFORE INSERT OR UPDATE ON public.event_feedback
  FOR EACH ROW EXECUTE FUNCTION public.validate_event_feedback();

ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Confirmed attendees can submit feedback"
  ON public.event_feedback FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.rsvps r
      WHERE r.event_id = event_feedback.event_id AND r.user_id = auth.uid() AND r.status = 'confirmed'
    )
  );

CREATE POLICY "Users update own feedback"
  ON public.event_feedback FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own feedback"
  ON public.event_feedback FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Feedback visible to hosts and self"
  ON public.event_feedback FOR SELECT
  USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_feedback.event_id AND public.is_host_member(auth.uid(), e.host_id)
    )
  );

-- Photos
CREATE TYPE public.photo_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.event_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT,
  status public.photo_status NOT NULL DEFAULT 'pending',
  hidden_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID
);

ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved photos viewable by everyone"
  ON public.event_photos FOR SELECT
  USING (status = 'approved' AND hidden_at IS NULL);

CREATE POLICY "Users view own photos"
  ON public.event_photos FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Hosts view all photos for their events"
  ON public.event_photos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_photos.event_id AND public.is_host_member(auth.uid(), e.host_id)
  ));

CREATE POLICY "Confirmed attendees upload photos"
  ON public.event_photos FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.rsvps r
      WHERE r.event_id = event_photos.event_id AND r.user_id = auth.uid() AND r.status = 'confirmed'
    )
  );

CREATE POLICY "Users delete own photos"
  ON public.event_photos FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Hosts moderate photos"
  ON public.event_photos FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_photos.event_id AND public.has_host_role(auth.uid(), e.host_id, 'host')
  ));

CREATE POLICY "Hosts delete photos"
  ON public.event_photos FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_photos.event_id AND public.has_host_role(auth.uid(), e.host_id, 'host')
  ));

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('event-photos', 'event-photos', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Event photos publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-photos');

CREATE POLICY "Authenticated users upload event photos to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own event photo files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Reports
CREATE TYPE public.report_target AS ENUM ('event', 'photo');
CREATE TYPE public.report_status AS ENUM ('open', 'actioned', 'dismissed');

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type public.report_target NOT NULL,
  target_id UUID NOT NULL,
  reporter_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status public.report_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can report"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Helper: does the current user moderate this report's target?
CREATE OR REPLACE FUNCTION public.can_moderate_report(_target_type public.report_target, _target_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _host UUID;
BEGIN
  IF _target_type = 'event' THEN
    SELECT host_id INTO _host FROM public.events WHERE id = _target_id;
  ELSIF _target_type = 'photo' THEN
    SELECT e.host_id INTO _host FROM public.event_photos p JOIN public.events e ON e.id = p.event_id WHERE p.id = _target_id;
  END IF;
  RETURN _host IS NOT NULL AND public.has_host_role(auth.uid(), _host, 'host');
END;
$$;

CREATE POLICY "Reporters and host moderators view reports"
  ON public.reports FOR SELECT
  USING (
    auth.uid() = reporter_id
    OR public.can_moderate_report(target_type, target_id)
  );

CREATE POLICY "Host moderators update reports"
  ON public.reports FOR UPDATE
  USING (public.can_moderate_report(target_type, target_id));
