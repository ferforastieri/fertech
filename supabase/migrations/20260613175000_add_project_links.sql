alter table public.projects
  add column if not exists project_url text,
  add column if not exists site_url text;

update public.projects
set site_url = url
where site_url is null
  and url is not null;
