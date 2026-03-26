'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CmsSidebar } from '@/components/cms/CmsSidebar';
import { QuickSearch } from '@/components/cms/QuickSearch';
import {
  CmsHeaderSlotsProvider,
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
      <div className="flex h-screen bg-white">
        <CmsSidebar state={sidebarState} />

        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-200",
          sidebarState.isExpanded ? "md:ml-0" : "md:ml-0"
        )}>
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-surface bg-white">
            <button
              onClick={sidebarState.toggleMobileMenu}
              className="p-2 -ml-2 text-secondary hover:bg-surface rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <span className="font-bold text-sm uppercase tracking-tight">Ridgewood</span>
            <div className="w-10" /> {/* Spacer */}
          </header>

          <main className="flex-1 overflow-auto pointer-events-auto bg-white">
            <div className="max-w-[1600px] mx-auto px-4 py-8 md:px-10 lg:px-16 pointer-events-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      <QuickSearch isOpen={isSearchOpen} onClose={closeSearch} />
    </CmsHeaderSlotsProvider>
  );
}
