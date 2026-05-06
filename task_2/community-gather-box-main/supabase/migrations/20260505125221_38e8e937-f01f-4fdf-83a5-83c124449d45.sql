
-- Enum for host member roles
CREATE TYPE public.host_member_role AS ENUM ('host', 'checker');

-- Members table
CREATE TABLE public.host_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES public.host_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role public.host_member_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (host_id, user_id, role)
);

ALTER TABLE public.host_members ENABLE ROW LEVEL SECURITY;

-- Security definer helper
CREATE OR REPLACE FUNCTION public.has_host_role(_user_id UUID, _host_id UUID, _role public.host_member_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.host_members
    WHERE user_id = _user_id AND host_id = _host_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_host_member(_user_id UUID, _host_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.host_members
    WHERE user_id = _user_id AND host_id = _host_id
  );
$$;

-- Backfill: owners become host members
INSERT INTO public.host_members (host_id, user_id, role)
  SELECT id, user_id, 'host'::public.host_member_role FROM public.host_profiles
  ON CONFLICT DO NOTHING;

-- RLS for host_members
CREATE POLICY "Members visible to host members"
  ON public.host_members FOR SELECT
  USING (public.is_host_member(auth.uid(), host_id));

CREATE POLICY "Hosts manage members - insert"
  ON public.host_members FOR INSERT
  WITH CHECK (public.has_host_role(auth.uid(), host_id, 'host'));

CREATE POLICY "Hosts manage members - delete"
  ON public.host_members FOR DELETE
  USING (public.has_host_role(auth.uid(), host_id, 'host'));

CREATE POLICY "Members can remove themselves"
  ON public.host_members FOR DELETE
  USING (auth.uid() = user_id);

-- Invites table
CREATE TABLE public.host_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES public.host_profiles(id) ON DELETE CASCADE,
  role public.host_member_role NOT NULL,
  token TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '14 days'),
  revoked_at TIMESTAMPTZ
);

ALTER TABLE public.host_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Invites visible to host members"
  ON public.host_invites FOR SELECT
  USING (public.is_host_member(auth.uid(), host_id));

CREATE POLICY "Hosts create invites"
  ON public.host_invites FOR INSERT
  WITH CHECK (public.has_host_role(auth.uid(), host_id, 'host') AND auth.uid() = created_by);

CREATE POLICY "Hosts revoke invites"
  ON public.host_invites FOR UPDATE
  USING (public.has_host_role(auth.uid(), host_id, 'host'));

CREATE POLICY "Hosts delete invites"
  ON public.host_invites FOR DELETE
  USING (public.has_host_role(auth.uid(), host_id, 'host'));

-- Accept invite RPC
CREATE OR REPLACE FUNCTION public.accept_host_invite(_token TEXT)
RETURNS public.host_members
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _invite public.host_invites%ROWTYPE;
  _member public.host_members%ROWTYPE;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT * INTO _invite FROM public.host_invites WHERE token = _token;
  IF NOT FOUND THEN RAISE EXCEPTION 'Invite not found'; END IF;
  IF _invite.revoked_at IS NOT NULL THEN RAISE EXCEPTION 'Invite revoked'; END IF;
  IF _invite.expires_at < now() THEN RAISE EXCEPTION 'Invite expired'; END IF;

  INSERT INTO public.host_members (host_id, user_id, role)
    VALUES (_invite.host_id, _uid, _invite.role)
    ON CONFLICT (host_id, user_id, role) DO NOTHING
    RETURNING * INTO _member;

  IF _member.id IS NULL THEN
    SELECT * INTO _member FROM public.host_members
      WHERE host_id = _invite.host_id AND user_id = _uid AND role = _invite.role;
  END IF;

  RETURN _member;
END;
$$;

-- Public preview of an invite (for the join page before accepting)
CREATE OR REPLACE FUNCTION public.preview_host_invite(_token TEXT)
RETURNS TABLE (host_id UUID, host_name TEXT, host_slug TEXT, role public.host_member_role, expires_at TIMESTAMPTZ, revoked BOOLEAN)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT hp.id, hp.name, hp.slug, hi.role, hi.expires_at, (hi.revoked_at IS NOT NULL)
    FROM public.host_invites hi
    JOIN public.host_profiles hp ON hp.id = hi.host_id
    WHERE hi.token = _token;
$$;

-- Update events RLS: allow any 'host' member to manage
DROP POLICY IF EXISTS "Hosts can insert own events" ON public.events;
DROP POLICY IF EXISTS "Hosts can update own events" ON public.events;
DROP POLICY IF EXISTS "Hosts can delete own events" ON public.events;
DROP POLICY IF EXISTS "Hosts can view own events" ON public.events;

CREATE POLICY "Host members view host events"
  ON public.events FOR SELECT
  USING (public.is_host_member(auth.uid(), host_id));

CREATE POLICY "Host role inserts events"
  ON public.events FOR INSERT
  WITH CHECK (public.has_host_role(auth.uid(), host_id, 'host'));

CREATE POLICY "Host role updates events"
  ON public.events FOR UPDATE
  USING (public.has_host_role(auth.uid(), host_id, 'host'));

CREATE POLICY "Host role deletes events"
  ON public.events FOR DELETE
  USING (public.has_host_role(auth.uid(), host_id, 'host'));

-- Update RSVPs: any host member (including checkers) can view RSVPs for check-in
DROP POLICY IF EXISTS "Hosts view event rsvps" ON public.rsvps;
CREATE POLICY "Host members view event rsvps"
  ON public.rsvps FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = rsvps.event_id AND public.is_host_member(auth.uid(), e.host_id)
  ));
