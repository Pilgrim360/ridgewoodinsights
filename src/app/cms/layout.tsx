'use client';

import React, { useEffect, useState } from 'react';
import { QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CmsAuthProvider } from '@/contexts/CmsAuthContext';
import { CmsErrorProvider } from '@/contexts/CmsErrorContext';
import { createCmsQueryClient } from '@/lib/queryClient';
import { getSupabaseClient } from '@/lib/supabase/client';

/**
 * CMS Root Layout
 * Provides TanStack Query, auth context, and error toasts for all cms routes (including login)
 */

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createCmsQueryClient());

  useEffect(() => {
    const supabase = getSupabaseClient();

    const handleResume = () => {
      if (typeof window === 'undefined') return;

      onlineManager.setOnline(navigator.onLine);

      if (document.visibilityState !== 'visible') {
        focusManager.setFocused(false);
        supabase.auth.stopAutoRefresh();
        return;
      }

      supabase.auth.startAutoRefresh();
      focusManager.setFocused(true);

      void supabase.auth.getSession();
      void queryClient.resumePausedMutations();
      void queryClient.refetchQueries({ type: 'active' });
    };

    handleResume();

    document.addEventListener('visibilitychange', handleResume);
    window.addEventListener('online', handleResume);
    window.addEventListener('offline', handleResume);
    window.addEventListener('focus', handleResume);

    return () => {
      document.removeEventListener('visibilitychange', handleResume);
      window.removeEventListener('online', handleResume);
      window.removeEventListener('offline', handleResume);
      window.removeEventListener('focus', handleResume);
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <CmsAuthProvider>
        <CmsErrorProvider>{children}</CmsErrorProvider>
      </CmsAuthProvider>

      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
