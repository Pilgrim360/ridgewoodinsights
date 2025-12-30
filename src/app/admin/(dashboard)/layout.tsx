'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  AdminHeaderSlotsProvider,
  useAdminHeaderSlots,
} from '@/contexts/AdminHeaderSlotsContext';
import { useSidebarState } from '@/hooks/useSidebarState';
import { useSupabaseSessionManager } from '@/hooks/useSupabaseSessionManager';

/**
 * Admin Dashboard Layout
 * Provides two-panel structure (sidebar + content)
 * Includes responsive navigation with mobile hamburger menu
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarState = useSidebarState();

  // Ensures the Supabase session is refreshed when the tab becomes visible
  useSupabaseSessionManager();

  return (
    <AdminHeaderSlotsProvider>
      <div className="flex h-screen bg-background">
        <AdminSidebar state={sidebarState} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader
            onMenuToggle={sidebarState.toggleMobileMenu}
            isMobileMenuOpen={sidebarState.isMobileOpen}
          />

          <AdminSubHeader />

          <main className="flex-1 overflow-auto pointer-events-auto">
            <div className="px-4 py-3 md:px-6 pointer-events-auto">{children}</div>
          </main>
        </div>
      </div>
    </AdminHeaderSlotsProvider>
  );
}

function AdminSubHeader() {
  const { slots } = useAdminHeaderSlots();

  if (!slots.subHeader) return null;

  return (
    <div className="border-b border-surface bg-white px-4 py-2 md:px-6">
      {slots.subHeader}
    </div>
  );
}
