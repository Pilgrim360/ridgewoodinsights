# Supabase SQL Commands - Execution Order

Run these in **Supabase SQL Editor** in this exact order. Copy each block, paste it in the editor, and click **Run**.

---

## 1. Create Enums & Tables

```sql
-- Enums for consistency
create type post_status as enum ('draft', 'published', 'scheduled');
create type disclaimer_type as enum ('none', 'general', 'legal');

-- 1. Profiles (Links to auth.users)
create table profiles (
  id uuid references auth.users(id) primary key,
  email text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Categories
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- 3. Posts
create table posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) not null,
  category_id uuid references categories(id),
  title text not null,
  slug text unique not null,
  excerpt text,
  content_markdown text,
  cover_image text,
  status post_status default 'draft',
  published_at timestamptz,
  disclaimer_type disclaimer_type default 'none',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**After running:** Check Tables panel for `profiles`, `categories`, `posts`.

---

## 2. Create Auto-Profile Trigger

```sql
-- Trigger function to create a profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Attach the trigger to the auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**After running:** Check Triggers section for `on_auth_user_created`.

---

## 3. Enable RLS on All Tables

```sql
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table categories enable row level security;
alter table posts enable row level security;
```

**After running:** Check each table's RLS toggle (should be blue/enabled).

---

## 4. Create Admin Helper Function

```sql
-- Helper function to check if user is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and is_admin = true
  );
$$ language sql stable;
```

**After running:** Check Functions section for `is_admin`.

---

## 5. Add Profiles Policies

```sql
-- Profiles Policies
-- 1. Users can read their own profile
create policy "Users can read own profile" on profiles
  for select using (auth.uid() = id);

-- 2. Users can update their own profile
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- 3. Admins can perform all actions on profiles
create policy "Admins can do everything on profiles" on profiles
  for all using (is_admin());
```

**After running:** Check `profiles` table RLS policies (should have 3).

---

## 6. Add Posts Policies

```sql
-- Posts Policies
-- 1. Public can read published posts
create policy "Public can read published posts" on posts
  for select using (status = 'published');

-- 2. Users can read their own posts (drafts)
create policy "Users can read own posts" on posts
  for select using (author_id = auth.uid());

-- 3. Users can create their own posts
create policy "Users can create posts" on posts
  for insert with check (author_id = auth.uid());

-- 4. Users can update their own posts
create policy "Users can update own posts" on posts
  for update using (author_id = auth.uid());

-- 5. Users can delete their own posts
create policy "Users can delete own posts" on posts
  for delete using (author_id = auth.uid());

-- 6. Admins can perform all actions on posts
create policy "Admins can do everything on posts" on posts
  for all using (is_admin());
```

**After running:** Check `posts` table RLS policies (should have 6).

---

## 7. Add Categories Policies

```sql
-- Categories Policies
-- 1. Public can read all categories
create policy "Public can read categories" on categories
  for select using (true);

-- 2. Admins can perform all actions on categories
create policy "Admins can do everything on categories" on categories
  for all using (is_admin());
```

**After running:** Check `categories` table RLS policies (should have 2).

---

## 8. Add Storage Policies

```sql
-- Storage policies for blog-images bucket
-- 1. Allow public read access to all images
create policy "Public can view images" on storage.objects
  for select using (bucket_id = 'blog-images');

-- 2. Allow authenticated users to upload images (must use user-id as first folder)
create policy "Authenticated users can upload images" on storage.objects
  for insert with check (
    bucket_id = 'blog-images' and 
    auth.role() = 'authenticated' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. Allow users to update their own images
create policy "Users can update own images" on storage.objects
  for update using (
    bucket_id = 'blog-images' and 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Allow users to delete their own images
create policy "Users can delete own images" on storage.objects
  for delete using (
    bucket_id = 'blog-images' and 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. Allow admins to perform all actions
create policy "Admins can do everything on storage" on storage.objects
  for all using (is_admin());
```

**After running:** Go to Storage > `blog-images` bucket > Policies tab. Should have 5 policies.

---

## 9. Create Performance Indexes

```sql
-- Indexes for better performance

-- Posts table indexes
create index idx_posts_status_published_at on posts(status, published_at desc) where status = 'published';
create index idx_posts_slug on posts(slug) where status = 'published';
create index idx_posts_author_id on posts(author_id);
create index idx_posts_category_id on posts(category_id);
create index idx_posts_status on posts(status);

-- Categories table indexes
create index idx_categories_slug on categories(slug);

-- Profiles table indexes
create index idx_profiles_email on profiles(email);

-- Composite index for blog listing (status + published_at)
create index idx_posts_blog_listing on posts(status, published_at desc) 
  where status in ('published', 'draft');
```

**After running:** Check each table's Indexes section. Should have 8 total.

---

## 10. Promote Admin User

**First:** Go to **Authentication > Users** and add user with email `albertnkhata@hotmail.com` (generate a password).

**Then run this SQL:**

```sql
-- Replace with your actual admin email
update profiles 
set is_admin = true 
where email = 'albertnkhata@hotmail.com';

-- Verify the update
select id, email, is_admin from profiles where is_admin = true;
```

**After running:** Query should return 1 row with `is_admin = true`.

---

## 11. Create Initial Categories

```sql
insert into categories (name, slug) values
('Tax Planning', 'tax-planning'),
('Financial Strategy', 'financial-strategy'),
('Business Insights', 'business-insights'),
('Industry News', 'industry-news'),
('Accounting Tips', 'accounting-tips');
```

**After running:** Go to `categories` table and verify 5 rows exist.

---

## Summary

- [ ] 1. Enums & Tables
- [ ] 2. Trigger
- [ ] 3. Enable RLS
- [ ] 4. Admin Helper Function
- [ ] 5. Profiles Policies
- [ ] 6. Posts Policies
- [ ] 7. Categories Policies
- [ ] 8. Storage Policies
- [ ] 9. Indexes
- [ ] 10. Promote Admin User
- [ ] 11. Create Initial Categories

**All done!** Then move to Phase 7 in `SUPABASE_SETUP.md` for dependencies.
