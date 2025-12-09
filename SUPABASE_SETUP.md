# Supabase Setup for Ridgewood Insights Blog

**Status:** Complete ✓  
**Last Updated:** December 9, 2025

## Quick Checklist

- [x] Phase 1: Project & Credentials
- [x] Phase 2: Database Schema
- [x] Phase 3: Row Level Security (RLS)
- [x] Phase 4: Storage
- [x] Phase 5: Performance Indexes
- [x] Phase 6: Initial Data
- [x] Phase 7: Local Setup

---

## Phase 1: Project & Credentials

### Steps

1. Go to [Supabase](https://supabase.com/) and sign in
2. Click "New project"
3. Fill in:
   - **Name:** ridgewood-insights (or similar)
   - **Database Password:** Generate a strong password, save it
   - **Region:** Choose closest to your users
4. Wait for project initialization (~2 minutes)
5. Once ready, navigate to **Settings > API**
6. Copy and save:
   - **Project URL** → will be `NEXT_PUBLIC_SUPABASE_URL=https://nnnfcbmzygubyhufxwln.supabase.co'
   - **anon (public) key** → will be `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ZSCnt2zPLhDxAHVTLgglSg_YfstBeLN`

### Verification

- [ ] Project created and initialized
- [ ] Both URL and anon key copied to notes

---

## Phase 2: Database Schema

Go to **SQL Editor** in Supabase console and run the following SQL blocks in order.

### 2.1: Create Enums & Tables

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
  content_html text,
  cover_image text,
  status post_status default 'draft',
  published_at timestamptz,
  disclaimer_type disclaimer_type default 'none',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Verification:**
- [ ] Check **Tables** panel: profiles, categories, posts visible
- [ ] Check **Enums** section: post_status, disclaimer_type listed

### 2.2: Create Auto-Profile Trigger

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

**Verification:**
- [ ] Check **Triggers** section: on_auth_user_created visible
- [ ] Later: After first admin signup, verify profile auto-created

---

## Phase 3: Row Level Security (RLS)

### 3.1: Enable RLS on All Tables

```sql
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table categories enable row level security;
alter table posts enable row level security;
```

**Verification:**
- [ ] Go to each table in **Tables** panel
- [ ] Check **RLS** toggle is enabled (blue/on)

### 3.2: Create Admin Helper Function

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

**Verification:**
- [ ] Function appears in **Functions** section

### 3.3: Add Profiles Policies

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

### 3.4: Add Posts Policies

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

### 3.5: Add Categories Policies

```sql
-- Categories Policies
-- 1. Public can read all categories
create policy "Public can read categories" on categories
  for select using (true);

-- 2. Admins can perform all actions on categories
create policy "Admins can do everything on categories" on categories
  for all using (is_admin());
```

**Verification:**
- [ ] Go to each table's **RLS** section
- [ ] Verify all policies are listed:
  - profiles: 3 policies
  - posts: 6 policies
  - categories: 2 policies

---

## Phase 4: Storage Setup

### 4.1: Create Blog Images Bucket

1. Go to **Storage** in Supabase console
2. Click **Create a new bucket**
3. Name: `blog-images`
4. Check **Public bucket** (toggle on)
5. Click **Create bucket**

**Verification:**
- [ ] Bucket `blog-images` appears in storage list
- [ ] **Public** status is enabled

### 4.2: Add Storage Policies

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

**Verification:**
- [ ] Go to `blog-images` bucket in Storage
- [ ] Check **Policies** tab: 5 policies listed

---

## Phase 5: Performance Indexes

Run in SQL Editor:

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

**Verification:**
- [ ] Go to each table, check **Indexes** tab
- [ ] Verify all 8 indexes are created

---

## Phase 6: Initial Data Setup

### 6.1: Create Admin User (First)

1. Go to **Authentication > Users** in Supabase
2. Click **Add user**
3. Email: `albertnkhata@hotmail.com`
4. Password: Generate a temporary password
5. Click **Create user**

**Note:** A profile will auto-create via the trigger.

**Verification:**
- [ ] User appears in **Authentication > Users** list

### 6.2: Promote Admin User

Go to **SQL Editor** and run:

```sql
-- Replace with your actual admin email
update profiles 
set is_admin = true 
where email = 'albertnkhata@hotmail.com';

-- Verify the update
select id, email, is_admin from profiles where is_admin = true;
```

**Verification:**
- [ ] Query returns 1 row with is_admin = true

### 6.3: Create Initial Categories

```sql
insert into categories (name, slug) values
('Tax Planning', 'tax-planning'),
('Financial Strategy', 'financial-strategy'),
('Business Insights', 'business-insights'),
('Industry News', 'industry-news'),
('Accounting Tips', 'accounting-tips');
```

**Verification:**
- [ ] Go to **categories** table
- [ ] Verify 5 rows exist with correct names and slugs

---

## Phase 7: Local Setup

### 7.1: Create `.env.local`

In the project root (`/home/user/ridgewoodinsights/`), create a file named `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://nnnfcbmzygubyhufxwln.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ZSCnt2zPLhDxAHVTLgglSg_YfstBeLN
ADMIN_EMAIL=albertnkhata@hotmail.com
```

✓ All values set.

**Verification:**
- [ ] File created and saved
- [ ] No values are hardcoded elsewhere

### 7.2: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr react-quill
```

**Verification:**
- [ ] Check `package.json` — all 3 dependencies listed
- [ ] `node_modules/` updated

---

## Phase 8: Next Steps (After Supabase is Ready)

Once all phases complete:

1. Create Supabase client files (`src/lib/supabase/server.ts`, etc.)
2. Build public blog pages (`/insights` index and single post)
3. Set up admin authentication and dashboard
4. Test end-to-end

---

## Troubleshooting

### Tables not created
- Check SQL Editor for error messages
- Ensure SQL was run in correct order
- Look for syntax errors (missing semicolons)

### RLS policies not working
- Verify RLS is **enabled** on each table (blue toggle)
- Check `is_admin()` function exists
- Test with direct auth user

### Storage bucket not accessible
- Ensure bucket is marked **public**
- Check storage policies are created
- Verify bucket name matches `blog-images` exactly

### Profile not auto-created
- Check trigger exists in Triggers section
- Manual test: Create new auth user, then check profiles table

---

## Quick SQL Snippets (Later Reference)

**Check all policies on a table:**
```sql
select schemaname, tablename, policyname, qual, with_check from pg_policies where tablename = 'posts';
```

**Check indexes:**
```sql
select schemaname, tablename, indexname from pg_indexes where tablename = 'posts';
```

**Reset all profiles to non-admin (CAUTION):**
```sql
update profiles set is_admin = false;
```

---

**Status**: Update this checklist as you progress through each phase.
