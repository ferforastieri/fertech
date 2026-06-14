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
