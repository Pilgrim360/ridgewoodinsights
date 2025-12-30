'use client';

import React from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminErrorProvider } from '@/contexts/AdminErrorContext';
import { DataRefreshProvider } from '@/contexts/DataRefreshContext';
import { AuthErrorBoundary } from '@/components/admin/AuthErrorBoundary';
import { SessionManager } from '@/components/admin/SessionManager';

/**
 * Admin Root Layout
 * Provides auth context, error toasts, data refresh, and session management for all admin routes
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminErrorProvider>
        <DataRefreshProvider>
          <AuthErrorBoundary>
            <SessionManager>
              {children}
            </SessionManager>
          </AuthErrorBoundary>
        </DataRefreshProvider>
      </AdminErrorProvider>
    </AdminAuthProvider>
  );
}
