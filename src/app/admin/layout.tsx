import React from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminErrorProvider } from '@/contexts/AdminErrorContext';

/**
 * Admin layout wrapper
 * Provides auth context, error toasts, and two-panel structure (sidebar + content)
 * Will include Sidebar component in Step 2
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminErrorProvider>
        <div className="flex h-screen bg-white">
          {/* Sidebar will be added in Step 2 */}
          {/* <Sidebar /> */}

          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top navigation bar will be added in Step 2 */}
            {/* <AdminHeader /> */}

            {/* Page content */}
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto px-4 py-8">{children}</div>
            </main>
          </div>
        </div>
      </AdminErrorProvider>
    </AdminAuthProvider>
  );
}
