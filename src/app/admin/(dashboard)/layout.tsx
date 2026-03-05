'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminHeaderSlotsProvider } from '@/contexts/AdminHeaderSlotsContext';
import { useSidebarState } from '@/hooks/useSidebarState';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarState = useSidebarState();

  return (
    <AdminHeaderSlotsProvider>
      <div className="flex h-screen bg-white">
        <AdminSidebar state={sidebarState} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader
            onMenuToggle={sidebarState.toggleMobileMenu}
            isMobileMenuOpen={sidebarState.isMobileOpen}
          />

          <main className="flex-1 overflow-auto bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminHeaderSlotsProvider>
  );
}
