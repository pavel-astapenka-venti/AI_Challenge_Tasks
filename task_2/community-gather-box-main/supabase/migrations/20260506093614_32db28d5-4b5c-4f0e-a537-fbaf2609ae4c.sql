CREATE OR REPLACE FUNCTION public.get_event_confirmed_count(_event_id uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::int FROM public.rsvps
  WHERE event_id = _event_id AND status = 'confirmed';
$$;

GRANT EXECUTE ON FUNCTION public.get_event_confirmed_count(uuid) TO anon, authenticated;