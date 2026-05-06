
CREATE OR REPLACE FUNCTION public.add_host_creator_as_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.host_members (host_id, user_id, role)
  VALUES (NEW.id, NEW.user_id, 'host')
  ON CONFLICT (host_id, user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS host_profiles_add_creator_member ON public.host_profiles;
CREATE TRIGGER host_profiles_add_creator_member
AFTER INSERT ON public.host_profiles
FOR EACH ROW EXECUTE FUNCTION public.add_host_creator_as_member();

INSERT INTO public.host_members (host_id, user_id, role)
SELECT hp.id, hp.user_id, 'host'::host_member_role
FROM public.host_profiles hp
WHERE NOT EXISTS (
  SELECT 1 FROM public.host_members hm
  WHERE hm.host_id = hp.id AND hm.user_id = hp.user_id AND hm.role = 'host'
);
