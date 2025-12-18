'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  AdminHeaderSlotsProvider,
  useAdminHeaderSlots,
} from '@/contexts/AdminHeaderSlotsContext';
import { useSidebarState } from '@/hooks/useSidebarState';

/**
 * Admin Dashboard Layout
 * Modern two-panel structure with fixed sidebar and responsive content area
 * Sidebar is fixed on desktop, drawer on mobile
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarState = useSidebarState();

  return (
    <AdminHeaderSlotsProvider>
      <div className="min-h-screen bg-background">
        {/* Fixed Sidebar */}
        <AdminSidebar />

        {/* Main Content Area - Offset by sidebar width on desktop */}
        <div 
          className={`flex flex-col min-h-screen transition-all duration-300 ${
            sidebarState.isExpanded ? 'md:ml-64' : 'md:ml-20'
          }`}
        >
          <AdminHeader
            onMenuToggle={sidebarState.toggleMobileMenu}
            isMobileMenuOpen={sidebarState.isMobileOpen}
          />

          <AdminSubHeader />

          <main className="flex-1">
            <div className="px-4 py-3 md:px-6">{children}</div>
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
