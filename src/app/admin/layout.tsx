'use client';

import React from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminErrorProvider } from '@/contexts/AdminErrorContext';
import ReactQueryClientProvider from '@/providers/ReactQueryClientProvider';

/**
 * Admin Root Layout
 * Provides auth context and error toasts for all admin routes (including login)
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
      <AdminAuthProvider>
        <AdminErrorProvider>{children}</AdminErrorProvider>
      </AdminAuthProvider>
    </ReactQueryClientProvider>
  );
}
