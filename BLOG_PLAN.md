Goal
Add a fully functional blog to an existing Next.js site using Supabase as the backend.
Public: Static + ISR (blazing fast, SEO-optimized).
Admin: Authenticated interface for writing/publishing (restricted to specific emails).
Cost: Free (Supabase Free Tier + Vercel).
Tech: Next.js 15+ App Router, Supabase (Postgres, Auth, Storage).
1. Architecture & Schema
Tech Stack
Frontend: Next.js 15+ App Router (Server Components + ISR).
Database: Supabase Postgres.
Auth: Supabase Auth (Magic Link) + Middleware protection.
Storage: Supabase Storage (Public bucket for images).
Database Schema
Run the following structure in your Supabase SQL Editor:
1. Enums & Tables
code
SQL
-- Enums for consistency
create type post_status as enum ('draft', 'published', 'scheduled');
create type disclaimer_type as enum ('none', 'general', 'legal');

-- 1. Profiles (Links to auth.users)
create table profiles (
  id uuid references auth.users(id) primary key,
  email text,
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
2. Row Level Security (RLS) Policies
Public Read: Enable generic read access for posts where status = 'published'.
Admin Write: Only authenticated users matching specific IDs (or policies checking an is_admin flag in profiles) can insert/update.
2. Implementation Steps
1. Install Dependencies
Remove legacy packages and use the modern SSR library.
code
Bash
npm install @supabase/supabase-js @supabase/ssr react-markdown remark-gfm
Optional (for Admin UI):
code
Bash
npm install @tiptap/react @tiptap/starter-kit
Step 2: Supabase Client Setup
Create a robust server client that handles Next.js 15 asynchronous cookies.
File: src/lib/supabase/server.ts
code
TypeScript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies(); // Await required in Next.js 15

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
            // Context is server component (read-only), ignore set errors
          }
        },
      },
    }
  );
}
Step 3: Public Blog Pages (ISR)
1. Blog Index (src/app/blog/page.tsx)
Fetch posts where status === 'published'.
Use revalidate to enable Incremental Static Regeneration.
code
TypeScript
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
         // Render PostCard component here
         <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
2. Single Post (src/app/blog/[slug]/page.tsx)
Use generateStaticParams to pre-build known paths.
code
TypeScript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const supabase = await createClient();
  const { data: posts } = await supabase.from('posts').select('slug').eq('status', 'published');
  return posts?.map(({ slug }) => ({ slug })) || [];
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) return <div>Post not found</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      {post.cover_image && <img src={post.cover_image} alt={post.title} />}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {post.content_markdown}
      </ReactMarkdown>
    </article>
  );
}
Step 4: Admin Authentication & Security
Instead of checking auth in a Layout, use Middleware to protect the /admin route entirely.
1. Middleware (src/middleware.ts)
code
TypeScript
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

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Optional: Check specific admin email
    if (user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
2. Login Page (src/app/login/page.tsx)
Create a simple form using Supabase Auth helpers to send a Magic Link.
Step 5: Admin Dashboard (/admin)
Create a Client Component for the dashboard to handle form state and image uploads.
List View: Fetch all posts (including drafts).
Editor View:
Title: Auto-generate slug on blur.
Image Upload:
code
TypeScript
const uploadImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(`public/${fileName}`, file);

  if (data) {
     const { data: { publicUrl } } = supabase.storage
       .from('blog-images')
       .getPublicUrl(`public/${fileName}`);
     return publicUrl;
  }
};
Editor: Textarea or TipTap.
Save: Upsert data to posts table.
Step 6: Configuration
1. Environment Variables (.env.local)
code
Text
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_EMAIL=admin@example.com
2. Image Optimization (next.config.mjs)
Allow Next.js to optimize images from your Supabase bucket.
code
JavaScript
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
3. Deployment Checklist
Vercel Project: Import repository.
Environment Variables: Add all variables from .env.local to Vercel Project Settings.
Supabase: Ensure "blog-images" bucket is set to Public.
Deploy: Push to main.