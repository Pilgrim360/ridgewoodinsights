import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to protect cms routes
 * Redirects unauthenticated users to /cms/login
 */

export async function middleware(request: NextRequest) {
  // Only protect /cms routes (except /cms/login)
  if (!request.nextUrl.pathname.startsWith('/cms')) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/cms/login') {
    return NextResponse.next();
  }

  // Create Supabase client from request
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Check auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    return NextResponse.redirect(new URL('/cms/login', request.url));
  }

  // Verify user is cms
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    // Non-cms user trying to access cms routes
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/cms', '/cms/:path*'],
};

// Note: Login is excluded in the middleware function itself (line 15)
