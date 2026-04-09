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
import { cn } from '@/lib/utils';

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
      <div className="flex h-screen bg-background overflow-hidden">
        <CmsSidebar state={sidebarState} onSearchOpen={openSearch} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <CmsHeader
            onMenuToggle={sidebarState.toggleMobileMenu}
            isMobileMenuOpen={sidebarState.isMobileOpen}
            onSearchOpen={openSearch}
          />

          <CmsSubHeader />

          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="container mx-auto max-w-7xl px-4 py-6 md:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      <QuickSearch isOpen={isSearchOpen} onClose={closeSearch} />
    </CmsHeaderSlotsProvider>
  );
}

function CmsSubHeader() {
  const { slots } = useCmsHeaderSlots();

  return (
    <div
      className={cn(
        "border-b border-surface bg-white/80 backdrop-blur-md px-4 md:px-6 sticky top-14 z-30 transition-all duration-200",
        slots.subHeader ? "py-1 opacity-100 translate-y-0" : "h-0 py-0 border-0 opacity-0 -translate-y-1 pointer-events-none"
      )}
    >
      {slots.subHeader}
    </div>
  );
}
