'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminHeaderSlots } from '@/contexts/AdminHeaderSlotsContext';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

/**
 * AdminHeader - Top navigation bar with mobile hamburger menu
 * Desktop (md+): Only shows breadcrumbs/title
 * Mobile (<md): Shows hamburger menu to toggle sidebar
 */
export const AdminHeader = React.forwardRef<HTMLElement, AdminHeaderProps>(
  ({ onMenuToggle, isMobileMenuOpen }, ref) => {
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
        {/* Mobile hamburger menu button */}
        <button
          onClick={onMenuToggle}
          className={cn(
            'md:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center',
            'rounded-lg text-secondary hover:bg-surface',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'transition-colors'
          )}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Title/Breadcrumbs area */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {slots.title ? (
            <div className="truncate">{slots.title}</div>
          ) : (
            <h1 className="text-lg font-semibold text-secondary">Admin</h1>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {slots.actions}
        </div>
      </header>
    );
  }
);

AdminHeader.displayName = 'AdminHeader';
