create or replace function public.register_community_for_current_user(
  p_name text,
  p_province text default null,
  p_regency text default null
) returns uuid
language plpgsql
security definer
set search_path=''
as $$
declare
  v_user uuid;
  v_existing uuid;
  v_community uuid;
begin
  v_user := auth.uid();
  if v_user is null then raise exception 'Google sign-in is required'; end if;
  if p_name is null or length(trim(p_name)) < 2 or length(trim(p_name)) > 180 then
    raise exception 'Community name must be between 2 and 180 characters';
  end if;
  perform 1 from auth.users u where u.id=v_user for update;
  select m.community_id into v_existing from public.community_members m
  where m.user_id=v_user order by m.created_at limit 1;
  if v_existing is not null then return v_existing; end if;
  insert into public.communities(name,province,regency,verification_status)
  values(trim(p_name),nullif(trim(coalesce(p_province,'')),''),nullif(trim(coalesce(p_regency,'')),''),'pending')
  returning id into v_community;
  insert into public.community_members(community_id,user_id,role)
  values(v_community,v_user,'owner');
  return v_community;
end;
$$;
revoke all on function public.register_community_for_current_user(text,text,text) from public,anon;
grant execute on function public.register_community_for_current_user(text,text,text) to authenticated;

grant select on public.communities,public.ich_reports to anon;
drop policy if exists "public can see verified communities" on public.communities;
create policy "public can see verified communities" on public.communities
for select to anon using(verification_status='verified');
drop policy if exists "public can see published public reports" on public.ich_reports;
create policy "public can see published public reports" on public.ich_reports
for select to anon using(
 publication_status='published' and access_level='public'
 and exists(select 1 from public.communities c where c.id=ich_reports.community_id and c.verification_status='verified')
);
