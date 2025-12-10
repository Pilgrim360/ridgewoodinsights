import React from 'react';
import { AdminAuthWrapper } from './AdminAuthWrapper';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminErrorProvider } from '@/contexts/AdminErrorContext';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useSidebarState } from '@/hooks/useSidebarState';

// Client-side component containing the actual layout and providers
// This is necessary because the root layout is now a server component for auth
'use client';
function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const sidebarState = useSidebarState();

  return (
    <AdminAuthProvider>
      <AdminErrorProvider>
        <div className="flex h-screen bg-background">
          <Sidebar state={sidebarState} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader
              onMenuToggle={sidebarState.toggleMobileMenu}
              isMobileMenuOpen={sidebarState.isMobileOpen}
            />
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto px-4 py-8">{children}</div>
            </main>
          </div>
        </div>
      </AdminErrorProvider>
    </AdminAuthProvider>
  );
}


// The root layout for /admin is a Server Component that wraps the client layout with authentication
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthWrapper>
      <AdminClientLayout>{children}</AdminClientLayout>
    </AdminAuthWrapper>
  );
}
