-- FacePay - Storage bucket for face images
insert into storage.buckets (id, name, public)
values ('face-images', 'face-images', true)
on conflict (id) do nothing;

-- Public read for avatar URLs
create policy "Public read access for face images"
on storage.objects for select
using (bucket_id = 'face-images');

-- Allow authenticated and service role to upload
create policy "Allow uploads to face-images"
on storage.objects for insert
with check (bucket_id = 'face-images');
