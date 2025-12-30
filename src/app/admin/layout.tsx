'use client';

import React from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminErrorProvider } from '@/contexts/AdminErrorContext';
import { AuthErrorBoundary } from '@/components/admin/AuthErrorBoundary';
import { SessionManager } from '@/components/admin/SessionManager';

/**
 * Admin Root Layout
 * Provides auth context, error toasts, and session management for all admin routes
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminErrorProvider>
        <AuthErrorBoundary>
          <SessionManager>
            {children}
          </SessionManager>
        </AuthErrorBoundary>
      </AdminErrorProvider>
    </AdminAuthProvider>
  );
}
