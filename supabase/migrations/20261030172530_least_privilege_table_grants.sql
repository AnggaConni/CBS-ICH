-- Least-privilege table grants. RLS is the row-level authorization layer.
revoke all on table public.communities,public.community_members,public.ich_reports,public.ich_report_versions from anon,authenticated,public;
grant select,insert on public.communities to authenticated;
grant select,insert on public.community_members to authenticated;
grant select,insert,update on public.ich_reports to authenticated;
grant select,insert on public.ich_report_versions to authenticated;
grant select on public.communities,public.ich_reports to anon;
grant select on public.public_ich_dashboard to anon,authenticated;
