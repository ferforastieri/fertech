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
