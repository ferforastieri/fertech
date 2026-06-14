alter table public.profile
  add column if not exists logo_url text,
  add column if not exists photo_url text;

update public.profile
set logo_url = coalesce(nullif(logo_url, ''), '/logo.png'),
    photo_url = coalesce(nullif(photo_url, ''), '/logo.png')
where id = 'main';

alter table public.profile
  alter column logo_url set not null,
  alter column logo_url set default '/logo.png',
  alter column photo_url set not null,
  alter column photo_url set default '/logo.png';

alter table public.profile
  drop column if exists professional_logo_url,
  drop column if exists aurora_logo_url;
