'use client';

import { useCallback } from 'react';
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

  const refreshSession = useCallback(async () => {
    try {
      // Calling getUser() forces a session refresh.
      await supabase.auth.getUser();
      // In addition, ping the database to re-establish the connection.
      await supabase.from('categories').select('id').limit(1);
    } catch (error) {
      console.error('Error refreshing Supabase session:', error);
    }
  }, [supabase]);

  usePageVisibility(refreshSession);
}