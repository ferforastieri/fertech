create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public read site content" on public.site_content;
create policy "Public read site content"
on public.site_content for select to anon, authenticated
using (true);

drop policy if exists "Authenticated write site content" on public.site_content;
create policy "Authenticated write site content"
on public.site_content for all to authenticated
using (public.is_admin())
with check (public.is_admin());
