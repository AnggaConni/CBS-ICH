create table if not exists public.regional_ich_references (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  element_name text not null,
  country_names text[] not null default '{}',
  inscription_year integer,
  unesco_status text not null check (unesco_status in ('RL','USL','GSP','Art18')),
  unesco_list text not null,
  source_name text not null default 'UNESCO Intangible Cultural Heritage',
  source_url text not null,
  data_origin text not null default 'public_desk_research',
  verification_status text not null default 'unverified',
  source_checked_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_regional_ich_country_names on public.regional_ich_references using gin(country_names);
create index if not exists idx_regional_ich_year on public.regional_ich_references(inscription_year desc);
alter table public.regional_ich_references enable row level security;
drop policy if exists "public can read regional reference data" on public.regional_ich_references;
create policy "public can read regional reference data" on public.regional_ich_references for select to anon, authenticated using (true);
revoke all on table public.regional_ich_references from anon, authenticated, public;
grant select on public.regional_ich_references to anon, authenticated;
