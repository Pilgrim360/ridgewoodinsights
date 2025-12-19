'use client';

import { useEffect, useRef } from 'react';
import { usePageVisibility } from './usePageVisibility';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAdminError } from '@/contexts/AdminErrorContext';

export function useConnectionManager() {
  const isVisible = usePageVisibility();
  const { showSuccess, showError } = useAdminError();
  const wasVisible = useRef(isVisible);
  const isReconnecting = useRef(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Trigger on tab becoming visible
    if (isVisible && !wasVisible.current && !isReconnecting.current) {
      console.log('Page became visible, checking connection...');
      isReconnecting.current = true;

      supabase.auth
        .getSession()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error re-establishing session:', error);
            showError('Connection error. Please refresh the page.');
          } else if (data.session) {
            console.log('Supabase connection refreshed successfully.');
            // Optionally show a subtle success message
            // showSuccess('Connection restored');
          } else {
            console.warn('No active session found on reconnect.');
          }
        })
        .finally(() => {
          isReconnecting.current = false;
        });
    }

    wasVisible.current = isVisible;
  }, [isVisible, showError, showSuccess]);
}
