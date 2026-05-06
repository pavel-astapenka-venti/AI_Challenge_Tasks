GRANT EXECUTE ON FUNCTION public.is_host_member(uuid, uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.has_host_role(uuid, uuid, public.host_member_role) TO anon;
GRANT EXECUTE ON FUNCTION public.can_moderate_report(public.report_target, uuid) TO anon;