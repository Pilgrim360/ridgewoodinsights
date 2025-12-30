import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // Automatically refresh token when it's about to expire
          autoRefreshToken: true,
          // Persist session in localStorage
          persistSession: true,
          // Detect when session is lost
          detectSessionInUrl: true,
          // Flow type for authentication
          flowType: 'pkce',
        },
        // Enable realtime for auth state changes
        realtime: {
          params: {
            eventsPerSecond: 2,
          },
        },
      }
    );

    // Set up global error listener for auth failures
    client.auth.onAuthStateChange((event: string, session: { expires_at?: number } | null) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('[Supabase] Token refreshed automatically');
      } else if (event === 'SIGNED_OUT') {
        console.log('[Supabase] User signed out');
      } else if (event === 'USER_UPDATED') {
        console.log('[Supabase] User updated');
      }

      // Log session expiry for debugging
      if (session?.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000);
        console.log(`[Supabase] Session expires at: ${expiresAt.toLocaleString()}`);
      }
    });
  }
  return client;
}
