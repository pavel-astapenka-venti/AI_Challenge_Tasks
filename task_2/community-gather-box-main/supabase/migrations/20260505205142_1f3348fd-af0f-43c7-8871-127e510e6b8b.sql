
-- 1. Hide contact_email column from anon & authenticated readers
REVOKE SELECT (contact_email) ON public.host_profiles FROM anon, authenticated;

-- Provide a secure way for the owner to fetch their own contact email
CREATE OR REPLACE FUNCTION public.get_my_host_contact_email(_host_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT contact_email FROM public.host_profiles
  WHERE id = _host_id AND user_id = auth.uid();
$$;
REVOKE EXECUTE ON FUNCTION public.get_my_host_contact_email(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_my_host_contact_email(uuid) TO authenticated;

-- 2. Stop broadcasting rsvps via realtime
ALTER PUBLICATION supabase_realtime DROP TABLE public.rsvps;

-- 3. Storage event-photos: prevent public listing
DROP POLICY IF EXISTS "Event photos publicly readable" ON storage.objects;
-- (Bucket is public, so direct public-URL access for images still works without a SELECT policy.)

-- 4. Storage event-photos: enforce confirmed-RSVP membership for uploads
DROP POLICY IF EXISTS "Authenticated users upload event photos to own folder" ON storage.objects;
CREATE POLICY "Confirmed attendees upload event photos to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'event-photos'
  AND (auth.uid())::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM public.rsvps r
    WHERE r.user_id = auth.uid()
      AND r.status = 'confirmed'
      AND r.event_id::text = (storage.foldername(name))[2]
  )
);

-- 5. Storage event-photos: explicit UPDATE policy (owner-only)
CREATE POLICY "Users update own event photo files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'event-photos'
  AND (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'event-photos'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 6. Lock SECURITY DEFINER helpers so anon role can't call them
REVOKE EXECUTE ON FUNCTION public.create_rsvp(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.cancel_rsvp(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.check_in_rsvp(uuid, boolean) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.accept_host_invite(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.acknowledge_promotion(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_host_role(uuid, uuid, host_member_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_host_member(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.can_moderate_report(report_target, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.preview_host_invite(text) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.create_rsvp(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_rsvp(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_in_rsvp(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_host_invite(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.acknowledge_promotion(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_host_role(uuid, uuid, host_member_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_host_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_moderate_report(report_target, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.preview_host_invite(text) TO authenticated;
