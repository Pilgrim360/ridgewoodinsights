'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePageVisibility } from './usePageVisibility';
import { getSupabaseClient } from '@/lib/supabase/client';

/**
 * Custom hook to manage Supabase session state based on page visibility.
 *
 * This hook addresses an issue where the Supabase session can become stale
 * when the browser tab is inactive. By leveraging the Page Visibility API,
 * it automatically triggers a session refresh when the user returns to the tab.
 *
 * This is a client-side only hook.
 */
export function useSupabaseSessionManager() {
  const supabase = getSupabaseClient();
  const router = useRouter();

  const refreshConnectionAndData = useCallback(async () => {
    try {
      // First, ensure the Supabase connection is active.
      await supabase.auth.getUser();
      await supabase.from('categories').select('id').limit(1);

      // Then, trigger a router refresh to re-fetch server components and data.
      router.refresh();
    } catch (error) {
      console.error('Error refreshing session and data:', error);
    }
  }, [supabase, router]);

  usePageVisibility(refreshConnectionAndData);
}