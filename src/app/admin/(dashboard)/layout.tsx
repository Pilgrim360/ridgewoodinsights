'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  AdminHeaderSlotsProvider,
  useAdminHeaderSlots,
} from '@/contexts/AdminHeaderSlotsContext';
import { useSidebarState } from '@/hooks/useSidebarState';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarState = useSidebarState();

  return (
    <AdminHeaderSlotsProvider>
      <div className="flex h-screen bg-background">
        <AdminSidebar state={sidebarState} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader
            onMenuToggle={sidebarState.toggleMobileMenu}
            isMobileMenuOpen={sidebarState.isMobileOpen}
          />

          <AdminSubHeader />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">{children}</div>
          </main>
        </div>
      </div>
    </AdminHeaderSlotsProvider>
  );
}

function AdminSubHeader() {
  const { slots } = useAdminHeaderSlots();

  if (!slots.subHeader) return null;

  return <div className="border-b border-surface bg-white px-4 py-2 md:px-6">{slots.subHeader}</div>;
}
