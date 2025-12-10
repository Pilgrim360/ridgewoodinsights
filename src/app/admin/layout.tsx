'use client';

import React from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminErrorProvider } from '@/contexts/AdminErrorContext';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useSidebarState } from '@/hooks/useSidebarState';

/**
 * Admin layout wrapper
 * Provides auth context, error toasts, and two-panel structure (sidebar + content)
 * Includes responsive navigation with mobile hamburger menu
 */

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const sidebarState = useSidebarState();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop (md+) and Mobile Overlay */}
      <Sidebar state={sidebarState} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <AdminHeader
          onMenuToggle={sidebarState.toggleMobileMenu}
          isMobileMenuOpen={sidebarState.isMobileOpen}
        />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminErrorProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminErrorProvider>
    </AdminAuthProvider>
  );
}
