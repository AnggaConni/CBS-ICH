-- Moderators alone may verify, publish or archive reports and expose them publicly.
create or replace function public.guard_ich_publication_fields()
returns trigger language plpgsql set search_path='' as $$
begin
  if current_user in ('anon','authenticated') then
    if new.publication_status not in ('draft','submitted') then
      raise exception 'Only repository moderators can verify, publish or archive reports';
    end if;
    if new.access_level not in ('community','restricted') then
      raise exception 'Only repository moderators can make a report public';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists ich_reports_publication_guard on public.ich_reports;
create trigger ich_reports_publication_guard
before insert or update of publication_status,access_level on public.ich_reports
for each row execute function public.guard_ich_publication_fields();
