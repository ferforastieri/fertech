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
drop policy if exists "Public read site content" on public.site_content;
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
drop policy if exists "Authenticated write site content" on public.site_content;
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
create policy "Public read site content" on public.site_content for select to anon, authenticated using (true);

create policy "Authenticated write profile" on public.profile for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write home content" on public.home_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write project groups" on public.project_groups for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write articles" on public.articles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write resume experiences" on public.resume_experiences for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write resume roles" on public.resume_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write resume education" on public.resume_education for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write resume technologies" on public.resume_technologies for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write resume settings" on public.resume_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated write site content" on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin users can read admin list" on public.admin_users for select to authenticated using (public.is_admin());
