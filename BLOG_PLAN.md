# Comprehensive Blog Plan for Next.js & Supabase

## Goal
Add a fully functional blog to an existing Next.js site using Supabase as the backend.
- **Public:** Static + ISR (blazing fast, SEO-optimized).
- **Admin:** Authenticated interface for writing/publishing (restricted to specific emails).
- **Cost:** Free (Supabase Free Tier + Vercel).
- **Tech:** Next.js 15+ App Router, Supabase (Postgres, Auth, Storage).

## 1. Supabase Project Setup
Before writing any code, the Supabase project needs to be configured.

### 1.1 Create the Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Save your Project URL and `anon` key.

### 1.2 Database Schema
Run the following SQL in the Supabase SQL Editor to create the necessary tables and types.

#### 1.2.1 Enums & Tables
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

#### 1.2.2 Auto-Create Profile Trigger
Add a trigger to automatically create a profile record when a user signs up:

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

### 1.3 Row Level Security (RLS) Policies
RLS is crucial for securing your data. Enable RLS on all tables and add the following policies:

```sql
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table categories enable row level security;
alter table posts enable row level security;

-- Helper function to check if user is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and is_admin = true
  );
$$ language sql stable;

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

-- Categories Policies
-- 1. Public can read all categories
create policy "Public can read categories" on categories
  for select using (true);

-- 2. Admins can perform all actions on categories
create policy "Admins can do everything on categories" on categories
  for all using (is_admin());
```

### 1.4 Storage for Images
1. Go to the "Storage" section in your Supabase project.
2. Create a new bucket named `blog-images`.
3. Make the bucket **public**.

#### Expected Storage Path Structure
Images must be uploaded to paths in the format: `{user-id}/{filename}`. For example:
```
blog-images/
  └── 550e8400-e29b-41d4-a716-446655440000/
      ├── cover-image-post-1.jpg
      └── featured-image-post-2.png
```

4. Add the following storage policies to secure image access:

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

### 1.5 Performance Optimization
Add database indexes to improve query performance for common operations:

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

### 1.6 Initial Setup Instructions
After creating the database schema and policies, you need to set up the initial admin user and categories:

#### 1.6.1 Promote Admin User
After your admin user signs up through Supabase Auth (the profile will be created automatically via the trigger), promote them to admin:

```sql
-- Replace with your actual admin email
update profiles 
set is_admin = true 
where email = 'your-admin-email@example.com';

-- Verify the update
select id, email, is_admin from profiles where is_admin = true;
```

#### 1.6.2 Create Initial Categories
Run this SQL to create some default blog categories:

```sql
insert into categories (name, slug) values
('Tax Planning', 'tax-planning'),
('Financial Strategy', 'financial-strategy'),
('Business Insights', 'business-insights'),
('Industry News', 'industry-news'),
('Accounting Tips', 'accounting-tips');
```

## 2. Implementation Steps

### 2.1 Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr react-markdown remark-gfm
```
Optional (for Admin UI):
```bash
npm install @tiptap/react @tiptap/starter-kit
```

### 2.2 Supabase Client Setup
Create a server client to interact with Supabase from Server Components.

**File: `src/lib/supabase/server.ts`**
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies(); // Await is required in Next.js 15

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
```

### 2.3 Public Blog Pages (ISR)
These pages will be statically generated and revalidated periodically.

#### 2.3.1 Blog Index (`src/app/(marketing)/insights/page.tsx`)
```typescript
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

export default async function BlogIndex() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('*, categories(name, slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts?.map((post) => (
        <Link href={`/insights/${post.slug}`} key={post.id}>
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

#### 2.3.2 Single Post (`src/app/(marketing)/insights/[slug]/page.tsx`)
```typescript
import { createClient } from '@/lib/supabase/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const supabase = await createClient();
  const { data: posts } = await supabase.from('posts').select('slug').eq('status', 'published');
  return posts?.map(({ slug }) => ({ slug })) || [];
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <article className="prose lg:prose-xl">
      <h1>{post.title}</h1>
      {post.cover_image && <img src={post.cover_image} alt={post.title} />}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {post.content_markdown}
      </ReactMarkdown>
    </article>
  );
}
```

### 2.4 Admin Authentication & Security
Use middleware to protect the `/admin` routes.

#### 2.4.1 Middleware (`src/middleware.ts`)
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

#### 2.4.2 Login Page (`src/app/login/page.tsx`)
A simple client component to handle the magic link login.

### 2.5 Admin Dashboard (`/admin`)
This will be a client component for managing posts.

#### 2.5.1 Image Upload Logic
```typescript
const uploadImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const supabase = createClient(); // Create a client component Supabase client
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(`public/${fileName}`, file);

  if (data) {
     const { data: { publicUrl } } = supabase.storage
       .from('blog-images')
       .getPublicUrl(`public/${fileName}`);
     return publicUrl;
  }
  return null;
};
```

### 2.6 Styling and UI
- **Styling:** Use Tailwind CSS for styling.
- **Components:** Consider using a component library like `shadcn/ui` for form elements and other UI components in the admin dashboard.

## 3. Configuration

### 3.1 Environment Variables (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_EMAIL=admin@example.com
```

**Note:** Make sure to also set the `app.admin_email` database parameter as described in section 1.6.1 to ensure RLS policies work correctly.

### 3.2 Image Optimization (`next.config.mjs`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-project-ref.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
export default nextConfig;
```

## 4. Deployment Checklist
1.  **Vercel Project:** Import your repository into Vercel.
2.  **Environment Variables:** Add the variables from `.env.local` to your Vercel project settings.
3.  **Supabase:** Ensure the `blog-images` bucket is public and RLS is enabled.
4.  **Deploy:** Push your changes to the main branch.
