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

update public.projects
set site_url = url
where site_url is null
  and url is not null;

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
