alter table public.communities
 add column if not exists created_by uuid references auth.users(id) on delete set null;
create unique index if not exists communities_one_self_created_per_user
 on public.communities(created_by) where created_by is not null;

revoke all on function public.register_community_for_current_user(text,text,text) from public,anon,authenticated;
drop function if exists public.register_community_for_current_user(text,text,text);

drop policy if exists "community members can view their communities" on public.communities;
create policy "members or creators can view communities"
on public.communities for select to authenticated
using(created_by=(select auth.uid()) or exists(
 select 1 from public.community_members m
 where m.community_id=communities.id and m.user_id=(select auth.uid())
));

drop policy if exists "authenticated users can register a community" on public.communities;
create policy "authenticated users can register a community"
on public.communities for insert to authenticated
with check(created_by=(select auth.uid()));
grant insert on public.communities to authenticated;

drop policy if exists "community owners can add themselves" on public.community_members;
create policy "community owners can add themselves"
on public.community_members for insert to authenticated
with check(
 user_id=(select auth.uid()) and role='owner'
 and exists(select 1 from public.communities c
            where c.id=community_members.community_id and c.created_by=(select auth.uid()))
);
grant insert on public.community_members to authenticated;
