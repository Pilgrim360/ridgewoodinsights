'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useSidebarState } from '@/hooks/useSidebarState';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarState = useSidebarState();

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - Fixed on desktop */}
      <AdminSidebar state={sidebarState} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onMenuToggle={sidebarState.toggleMobileMenu}
          isMobileMenuOpen={sidebarState.isMobileOpen}
        />

        <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
