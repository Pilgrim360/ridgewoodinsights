import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined
        }
      }
    );
    
    if (typeof window !== 'undefined') {
      client.auth.onAuthStateChange((event: string) => {
        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          console.log('Auth session refreshed or signed in');
        } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          console.log('Auth session ended');
        }
      });
      
      window.addEventListener('online', () => {
        console.log('Network connection restored');
      });
    }
  }
  return client;
}
