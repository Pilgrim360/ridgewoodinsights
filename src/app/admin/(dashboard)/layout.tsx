'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ModernNavigation } from '@/components/admin/ModernNavigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  AdminHeaderSlotsProvider,
  useAdminHeaderSlots,
} from '@/contexts/AdminHeaderSlotsContext';
import { useNavigationState } from '@/hooks/useNavigationState';

/**
 * Admin Dashboard Layout
 * Provides two-panel structure (sidebar + content) with modern navigation
 * Includes responsive navigation with mobile hamburger menu
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigationState = useNavigationState();

  return (
    <AdminHeaderSlotsProvider>
      <div className="min-h-screen bg-background">
        {/* Modern Navigation Sidebar - handles its own positioning */}
        <ModernNavigation />

        {/* Main Content Area */}
        <div className={cn(
          'transition-all duration-300 ease-out',
          // Desktop: account for sidebar width
          'md:ml-72',
          // When collapsed, reduce margin
          !navigationState.isExpanded && 'md:ml-20'
        )}>
          <div className="flex flex-col min-h-screen">
            <AdminHeader
              onMenuToggle={navigationState.toggleMobileMenu}
              isMobileMenuOpen={navigationState.isMobileOpen}
            />

            <AdminSubHeader />

            <main className="flex-1 overflow-auto">
              <div className="px-4 py-6 md:px-8">
                {children}
              </div>
            </main>
          </div>
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
