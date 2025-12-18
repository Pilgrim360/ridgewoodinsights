'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminNav } from '@/components/admin/AdminNav';
import {
  AdminHeaderSlotsProvider,
  useAdminHeaderSlots,
} from '@/contexts/AdminHeaderSlotsContext';
import { useAdminNavState } from '@/hooks/useAdminNavState';

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
  const {
    isExpanded,
    isMobileOpen,
    toggleExpand,
    toggleMobileMenu,
    closeMobileMenu,
  } = useAdminNavState();

  return (
    <AdminHeaderSlotsProvider>
      <div className="flex h-screen bg-background">
        <AdminNav
          isExpanded={isExpanded}
          isMobileOpen={isMobileOpen}
          toggleExpand={toggleExpand}
          closeMobileMenu={closeMobileMenu}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader
            onMenuToggle={toggleMobileMenu}
            isMobileMenuOpen={isMobileOpen}
          />

          <AdminSubHeader />

          <main className="flex-1 overflow-auto">
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
