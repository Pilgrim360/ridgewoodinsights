'use client';

import React, { useCallback } from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminErrorProvider } from '@/contexts/AdminErrorContext';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { getSupabaseClient } from '@/lib/supabase/client';

/**
 * Admin Root Layout
 * Provides auth context and error toasts for all admin routes (including login)
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const handleVisibilityChange = useCallback(() => {
    const supabase = getSupabaseClient();
    // A lightweight call to refresh the session and potentially reconnect
    supabase.auth.getSession().catch(error => {
      console.error('Error refreshing Supabase session on visibility change:', error.message);
    });
  }, []);

  usePageVisibility(handleVisibilityChange);

  return (
    <AdminAuthProvider>
      <AdminErrorProvider>
        {children}
      </AdminErrorProvider>
    </AdminAuthProvider>
  );
}
