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

update public.profile
set social_links = '[
  {"name":"Twitter","href":"https://x.com/viciofer","icon":"x"},
  {"name":"GitHub","href":"https://github.com/ferforastieri","icon":"github"},
  {"name":"LinkedIn","href":"https://linkedin.com/in/fernando-forastieri","icon":"linkedin"}
]'::jsonb
where id = 'main'
  and (social_links is null or social_links = '[]'::jsonb);

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
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

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

alter table public.profile enable row level security;
alter table public.project_groups enable row level security;
alter table public.projects enable row level security;
alter table public.articles enable row level security;
alter table public.resume_experiences enable row level security;
alter table public.resume_roles enable row level security;
alter table public.resume_education enable row level security;
alter table public.resume_technologies enable row level security;

drop policy if exists "Public read profile" on public.profile;
drop policy if exists "Public read project groups" on public.project_groups;
drop policy if exists "Public read projects" on public.projects;
drop policy if exists "Public read articles" on public.articles;
drop policy if exists "Public read resume experiences" on public.resume_experiences;
drop policy if exists "Public read resume roles" on public.resume_roles;
drop policy if exists "Public read resume education" on public.resume_education;
drop policy if exists "Public read resume technologies" on public.resume_technologies;
drop policy if exists "Authenticated write profile" on public.profile;
drop policy if exists "Authenticated write project groups" on public.project_groups;
drop policy if exists "Authenticated write projects" on public.projects;
drop policy if exists "Authenticated write articles" on public.articles;
drop policy if exists "Authenticated write resume experiences" on public.resume_experiences;
drop policy if exists "Authenticated write resume roles" on public.resume_roles;
drop policy if exists "Authenticated write resume education" on public.resume_education;
drop policy if exists "Authenticated write resume technologies" on public.resume_technologies;

create policy "Public read profile" on public.profile for select using (true);
create policy "Public read project groups" on public.project_groups for select using (true);
create policy "Public read projects" on public.projects for select using (true);
create policy "Public read articles" on public.articles for select using (true);
create policy "Public read resume experiences" on public.resume_experiences for select using (true);
create policy "Public read resume roles" on public.resume_roles for select using (true);
create policy "Public read resume education" on public.resume_education for select using (true);
create policy "Public read resume technologies" on public.resume_technologies for select using (true);

create policy "Authenticated write profile" on public.profile for all to authenticated using (true) with check (true);
create policy "Authenticated write project groups" on public.project_groups for all to authenticated using (true) with check (true);
create policy "Authenticated write projects" on public.projects for all to authenticated using (true) with check (true);
create policy "Authenticated write articles" on public.articles for all to authenticated using (true) with check (true);
create policy "Authenticated write resume experiences" on public.resume_experiences for all to authenticated using (true) with check (true);
create policy "Authenticated write resume roles" on public.resume_roles for all to authenticated using (true) with check (true);
create policy "Authenticated write resume education" on public.resume_education for all to authenticated using (true) with check (true);
create policy "Authenticated write resume technologies" on public.resume_technologies for all to authenticated using (true) with check (true);

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
with check (bucket_id = 'logos');

create policy "Authenticated update logos"
on storage.objects for update to authenticated
using (bucket_id = 'logos')
with check (bucket_id = 'logos');

create policy "Authenticated delete logos"
on storage.objects for delete to authenticated
using (bucket_id = 'logos');
