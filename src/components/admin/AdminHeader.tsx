'use client';

import React from 'react';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminHeaderSlots } from '@/contexts/AdminHeaderSlotsContext';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onSearchOpen?: () => void;
}

export const AdminHeader = React.forwardRef<HTMLElement, AdminHeaderProps>(
  ({ onMenuToggle, isMobileMenuOpen, onSearchOpen }, ref) => {
    const { slots } = useAdminHeaderSlots();

    return (
      <header
        ref={ref}
        className={cn(
          'bg-white border-b border-surface px-4 py-3 md:px-6',
          'flex items-center justify-between gap-4'
        )}
        role="banner"
      >
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className={cn(
            'md:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center',
            'rounded-lg text-secondary hover:bg-surface',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
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

        {/* Title / Breadcrumbs area */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {slots.title ? (
            <div className="truncate">{slots.title}</div>
          ) : null}
        </div>

        {/* Right side: search + actions */}
        <div className="flex items-center gap-2">
          {onSearchOpen && (
            <button
              onClick={onSearchOpen}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
                'text-text/50 bg-background border border-surface',
                'hover:border-primary/30 hover:text-text/70',
                'transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
              aria-label="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Search…</span>
              <kbd className="hidden sm:inline text-xs bg-surface px-1 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </button>
          )}
          {slots.actions}
        </div>
      </header>
    );
  }
);

AdminHeader.displayName = 'AdminHeader';
