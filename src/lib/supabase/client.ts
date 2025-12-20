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
        },
        global: {
          fetch: (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
            const timeoutMs = typeof init.signal === 'undefined' ? 60000 : undefined;
            
            if (timeoutMs !== undefined) {
              const controller = new AbortController();
              const signal = controller.signal;
              
              const timeoutPromise = new Promise<Response>((_, reject) => {
                setTimeout(() => {
                  reject(new Error('Request timeout'));
                  controller.abort();
                }, timeoutMs);
              });
              
              return Promise.race([
                fetch(input, { ...init, signal }) as Promise<Response>,
                timeoutPromise
              ]).finally(() => {
                if (!controller.signal.aborted) {
                  controller.abort();
                }
              });
            }
            
            return fetch(input, init) as Promise<Response>;
          }
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
      
      if (typeof window !== 'undefined') {
        window.addEventListener('online', () => {
          console.log('Network connection restored');
        });
      }
    }
  }
  return client;
}
