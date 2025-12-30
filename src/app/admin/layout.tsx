'use client';

import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminErrorProvider } from '@/contexts/AdminErrorContext';
import { createAdminQueryClient } from '@/lib/queryClient';

/**
 * Admin Root Layout
 * Provides TanStack Query, auth context, and error toasts for all admin routes (including login)
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createAdminQueryClient());

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
