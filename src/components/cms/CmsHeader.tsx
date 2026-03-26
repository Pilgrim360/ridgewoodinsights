'use client';

import React from 'react';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCmsHeaderSlots } from '@/contexts/CmsHeaderSlotsContext';

interface CmsHeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onSearchOpen?: () => void;
}

/**
 * CmsHeader - Minimal mobile-only header
 * 
 * Only visible on mobile devices (< md).
 * Provides access to sidebar toggle and search.
 */
export const CmsHeader = React.forwardRef<HTMLElement, CmsHeaderProps>(
  ({ onMenuToggle, isMobileMenuOpen, onSearchOpen }, ref) => {
    const { slots } = useCmsHeaderSlots();

    return (
      <header
        ref={ref}
        className={cn(
          'md:hidden bg-white border-b border-surface px-4 py-2',
          'flex items-center justify-between gap-4 h-14 sticky top-0 z-30'
        )}
        role="banner"
      >
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className={cn(
            'flex-shrink-0 w-9 h-9 flex items-center justify-center',
            'rounded-lg text-secondary hover:bg-surface',
            'focus:outline-none focus:ring-2 focus:ring-primary/20',
            'transition-colors'
          )}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-sidebar"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Title area */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          {slots.title ? (
            <div className="truncate font-semibold text-sm text-secondary">{slots.title}</div>
          ) : (
            <span className="font-bold text-primary tracking-tight">RIDGEWOOD</span>
          )}
        </div>

        {/* Right side: search */}
        <div className="flex items-center gap-1 w-9 justify-end">
          {onSearchOpen && (
            <button
              onClick={onSearchOpen}
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg',
                'text-text/50 hover:bg-surface hover:text-secondary',
                'transition-colors focus:outline-none'
              )}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>
    );
  }
);

CmsHeader.displayName = 'CmsHeader';
