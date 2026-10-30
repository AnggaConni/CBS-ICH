create or replace function public.guard_ich_report_version_immutable()
returns trigger language plpgsql set search_path='' as $$
begin
  raise exception 'Historical report versions are immutable';
end;
$$;
drop trigger if exists ich_report_versions_immutable on public.ich_report_versions;
create trigger ich_report_versions_immutable
before update or delete on public.ich_report_versions
for each row execute function public.guard_ich_report_version_immutable();

create or replace function public.guard_ich_latest_version()
returns trigger language plpgsql set search_path='' as $$
begin
  if new.latest_version_id is not null and not exists (
    select 1 from public.ich_report_versions v
    where v.id=new.latest_version_id and v.report_id=new.id
  ) then
    raise exception 'Latest version must belong to the same report';
  end if;
  return new;
end;
$$;
drop trigger if exists ich_reports_latest_version_guard on public.ich_reports;
create trigger ich_reports_latest_version_guard
before insert or update of latest_version_id on public.ich_reports
for each row execute function public.guard_ich_latest_version();
