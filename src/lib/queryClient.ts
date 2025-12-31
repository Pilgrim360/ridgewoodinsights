import { QueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/lib/supabase/client';
import { AdminErrorHandler } from '@/lib/admin/error-handler';

export const DEFAULT_QUERY_STALE_TIME_MS = 5 * 60 * 1000;
export const REALTIME_QUERY_STALE_TIME_MS = 30 * 1000;
export const QUERY_DEDUPING_INTERVAL_MS = 30 * 1000;

function isAuthError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const err = error as Record<string, unknown>;
  const status = (err.status as number | undefined) ?? (err.statusCode as number | undefined);
  const code = err.code as string | undefined;
  const message = String(err.message ?? '');

  if (status === 401) return true;

  if (status === 403) {
    if (/jwt|token|auth|expired|invalid/i.test(message)) return true;
  }

  if (code === 'JWT_EXPIRED' || code === 'PGRST301') return true;

  if (/jwt|token expired|auth session missing|session.*missing|not authenticated/i.test(message)) {
    return true;
  }

  return false;
}

let refreshInFlight: Promise<void> | null = null;

async function refreshSupabaseSession(): Promise<void> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.refreshSession();

    if (error) throw error;
    if (!data.session) throw new Error('Session refresh did not return a session');
  })()
    .catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        AdminErrorHandler.log(AdminErrorHandler.parse(error));
      }
      throw error;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

export async function withSupabaseAuthRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (!isAuthError(error)) throw error;

    try {
      await refreshSupabaseSession();
      return await fn();
    } catch {
      try {
        await getSupabaseClient().auth.signOut();
      } catch {
        // ignore
      }

      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }

      throw error;
    }
  }
}

export function createAdminQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_QUERY_STALE_TIME_MS,
        refetchOnWindowFocus: 'always',
        refetchOnReconnect: true,
        networkMode: 'always',
        retry: (failureCount, error) => {
          if (isAuthError(error)) return false;
          return failureCount < 3;
        },
        retryDelay: (failureCount) => {
          const base = 1000;
          return Math.min(base * 2 ** (failureCount - 1), 4000);
        },
      },
      mutations: {
        networkMode: 'always',
        retry: (failureCount, error) => {
          if (isAuthError(error)) return false;
          return failureCount < 3;
        },
        retryDelay: (failureCount) => {
          const base = 1000;
          return Math.min(base * 2 ** (failureCount - 1), 4000);
        },
      },
    },
  });
}
