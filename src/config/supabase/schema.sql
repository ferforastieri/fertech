create table if not exists public.profile (
  id text primary key,
  name text not null,
  role text not null,
  intro text not null,
  contact_url text not null,
  logo_url text not null default '/logo.png',
  social_links jsonb not null default '[]'::jsonb,
  technologies text[] not null default '{}',
  about_paragraphs text[] not null default '{}',
  highlights jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profile add column if not exists logo_url text not null default '/logo.png';
alter table public.profile add column if not exists social_links jsonb not null default '[]'::jsonb;

create table if not exists public.home_content (
  id text primary key,
  hero_eyebrow text not null,
  hero_headline text not null,
  hero_description text not null,
  projects_button_label text not null,
  resume_button_label text not null,
  contact_button_label text not null,
  stack_groups jsonb not null,
  classic_about_title text not null,
  classic_highlights_title text not null,
  classic_capabilities_title text not null,
  language_note text not null,
  aurora_about_eyebrow text not null,
  aurora_about_title text not null,
  projects_eyebrow text not null,
  projects_title text not null,
  projects_link_label text not null,
  projects_total_label text not null,
  blog_eyebrow text not null,
  blog_title text not null,
  contact_title text not null,
  contact_description text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.project_groups (
  id text primary key,
  title text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key,
  group_id text not null references public.project_groups(id) on delete cascade,
  title text not null,
  description text not null,
  logo text not null,
  tags text[] not null default '{}',
  url text,
  project_url text,
  site_url text,
  architecture jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.projects add column if not exists project_url text;
alter table public.projects add column if not exists site_url text;
alter table public.projects add column if not exists architecture jsonb;
update public.projects set site_url = url where site_url is null and url is not null;

create table if not exists public.articles (
  slug text primary key,
  title text not null,
  category text not null,
  description text not null,
  date text not null,
  read_time text not null,
  content text not null,
  kind text not null check (kind in ('work', 'personal')),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_experiences (
  id text primary key,
  company text not null,
  position text not null,
  location text not null,
  period text not null,
  responsibilities text[] not null default '{}',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_roles (
  id text primary key,
  experience_id text not null references public.resume_experiences(id) on delete cascade,
  position text not null,
  period text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_education (
  id text primary key,
  institution text not null,
  course text not null,
  location text not null,
  period text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_technologies (
  name text primary key,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_settings (
  id text primary key,
  about_paragraphs text[] not null default '{}',
  languages jsonb not null default '[]'::jsonb,
  sections jsonb not null default '[]'::jsonb,
  location text not null,
  download_label text not null,
  generating_label text not null,
  pdf_filename text not null,
  project_technologies_label text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.profile enable row level security;
alter table public.home_content enable row level security;
alter table public.project_groups enable row level security;
alter table public.projects enable row level security;
alter table public.articles enable row level security;
alter table public.resume_experiences enable row level security;
alter table public.resume_roles enable row level security;
alter table public.resume_education enable row level security;
alter table public.resume_technologies enable row level security;
alter table public.resume_settings enable row level security;
alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "Public read profile" on public.profile;
drop policy if exists "Public read home content" on public.home_content;
drop policy if exists "Public read project groups" on public.project_groups;
drop policy if exists "Public read projects" on public.projects;
drop policy if exists "Public read articles" on public.articles;
drop policy if exists "Public read resume experiences" on public.resume_experiences;
drop policy if exists "Public read resume roles" on public.resume_roles;
drop policy if exists "Public read resume education" on public.resume_education;
drop policy if exists "Public read resume technologies" on public.resume_technologies;
drop policy if exists "Public read resume settings" on public.resume_settings;
drop policy if exists "Authenticated write profile" on public.profile;
drop policy if exists "Authenticated write home content" on public.home_content;
drop policy if exists "Authenticated write project groups" on public.project_groups;
drop policy if exists "Authenticated write projects" on public.projects;
drop policy if exists "Authenticated write articles" on public.articles;
drop policy if exists "Authenticated write resume experiences" on public.resume_experiences;
drop policy if exists "Authenticated write resume roles" on public.resume_roles;
drop policy if exists "Authenticated write resume education" on public.resume_education;
drop policy if exists "Authenticated write resume technologies" on public.resume_technologies;
drop policy if exists "Authenticated write resume settings" on public.resume_settings;
drop policy if exists "Admin users can read admin list" on public.admin_users;

create policy "Public read profile" on public.profile for select using (true);
create policy "Public read home content" on public.home_content for select using (true);
create policy "Public read project groups" on public.project_groups for select using (true);
create policy "Public read projects" on public.projects for select using (true);
create policy "Public read articles" on public.articles for select using (true);
create policy "Public read resume experiences" on public.resume_experiences for select using (true);
create policy "Public read resume roles" on public.resume_roles for select using (true);
create policy "Public read resume education" on public.resume_education for select using (true);
create policy "Public read resume technologies" on public.resume_technologies for select using (true);
create policy "Public read resume settings" on public.resume_settings for select using (true);

create policy "Authenticated write profile" on public.profile for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write home content" on public.home_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Public read site content" on public.site_content for select to anon, authenticated using (true);
create policy "Authenticated write site content" on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write project groups" on public.project_groups for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write articles" on public.articles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write resume experiences" on public.resume_experiences for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write resume roles" on public.resume_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write resume education" on public.resume_education for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write resume technologies" on public.resume_technologies for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write resume settings" on public.resume_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin users can read admin list" on public.admin_users for select to authenticated using (public.is_admin());

-- Rode uma vez no SQL Editor, trocando pelo seu e-mail de login:
-- insert into public.admin_users (email) values ('seu-email@dominio.com') on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'logos',
  'logos',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read logos" on storage.objects;
drop policy if exists "Authenticated upload logos" on storage.objects;
drop policy if exists "Authenticated update logos" on storage.objects;
drop policy if exists "Authenticated delete logos" on storage.objects;

create policy "Public read logos"
on storage.objects for select
using (bucket_id = 'logos');

create policy "Authenticated upload logos"
on storage.objects for insert to authenticated
with check (bucket_id = 'logos' and public.is_admin());

create policy "Authenticated update logos"
on storage.objects for update to authenticated
using (bucket_id = 'logos' and public.is_admin())
with check (bucket_id = 'logos' and public.is_admin());

create policy "Authenticated delete logos"
on storage.objects for delete to authenticated
using (bucket_id = 'logos' and public.is_admin());
