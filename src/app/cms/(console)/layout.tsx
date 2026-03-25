'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CmsSidebar } from '@/components/cms/CmsSidebar';
import { CmsHeader } from '@/components/cms/CmsHeader';
import { QuickSearch } from '@/components/cms/QuickSearch';
import {
  CmsHeaderSlotsProvider,
  useCmsHeaderSlots,
} from '@/contexts/CmsHeaderSlotsContext';
import { useSidebarState } from '@/hooks/useSidebarState';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarState = useSidebarState();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <CmsHeaderSlotsProvider>
      <div className="flex h-screen bg-background">
        <CmsSidebar state={sidebarState} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <CmsHeader
            onMenuToggle={sidebarState.toggleMobileMenu}
            isMobileMenuOpen={sidebarState.isMobileOpen}
            onSearchOpen={openSearch}
          />

          <CmsSubHeader />

          <main className="flex-1 overflow-auto pointer-events-auto">
            <div className="px-4 py-5 md:px-6 pointer-events-auto">{children}</div>
          </main>
        </div>
      </div>

      <QuickSearch isOpen={isSearchOpen} onClose={closeSearch} />
    </CmsHeaderSlotsProvider>
  );
}

function CmsSubHeader() {
  const { slots } = useCmsHeaderSlots();

  if (!slots.subHeader) return null;

  return (
    <div className="border-b border-surface bg-white px-4 py-2 md:px-6">
      {slots.subHeader}
    </div>
  );
}
