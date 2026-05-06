
REVOKE EXECUTE ON FUNCTION public.create_rsvp(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.cancel_rsvp(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_rsvp(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_rsvp(UUID) TO authenticated;
