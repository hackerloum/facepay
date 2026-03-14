# FacePay Supabase Setup

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and keys from Settings > API

## 2. Run Migrations

In Supabase Dashboard > SQL Editor, run the migration file:

```
supabase/migrations/20250314000001_initial_schema.sql
```

Or if using Supabase CLI locally:

```bash
supabase db push
```

## 3. Create Storage Bucket

In Supabase Dashboard > Storage:

1. Create a new bucket named `face-images`
2. Set to **Public** (for avatar URLs)
3. Add policy: Allow public read, authenticated/service write

Or run in SQL Editor:

```sql
insert into storage.buckets (id, name, public)
values ('face-images', 'face-images', true);

create policy "Public read access for face images"
on storage.objects for select
using (bucket_id = 'face-images');

create policy "Service role can upload face images"
on storage.objects for insert
with check (bucket_id = 'face-images');
```

## 4. Environment Variables

Add to your `.env` files:

- `SUPABASE_URL` - Project URL
- `SUPABASE_ANON_KEY` - Anon/public key
- `SUPABASE_SERVICE_KEY` - Service role key (backend only, keep secret)
