'use client';

import React, { useEffect, useState } from 'react';
import { QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminErrorProvider } from '@/contexts/AdminErrorContext';
import { createAdminQueryClient } from '@/lib/queryClient';
import { getSupabaseClient } from '@/lib/supabase/client';

/**
 * Admin Root Layout
 * Provides TanStack Query, auth context, and error toasts for all admin routes (including login)
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createAdminQueryClient());

  useEffect(() => {
    const supabase = getSupabaseClient();

    const handleResume = () => {
      if (typeof window === 'undefined') return;

      if (document.visibilityState !== 'visible') return;

      onlineManager.setOnline(navigator.onLine);
      focusManager.setFocused(true);

      void supabase.auth.getSession();
      void queryClient.resumePausedMutations();
      void queryClient.refetchQueries({ type: 'active' });
    };

    handleResume();

    document.addEventListener('visibilitychange', handleResume);
    window.addEventListener('online', handleResume);

    return () => {
      document.removeEventListener('visibilitychange', handleResume);
      window.removeEventListener('online', handleResume);
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <AdminErrorProvider>{children}</AdminErrorProvider>
      </AdminAuthProvider>

      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
