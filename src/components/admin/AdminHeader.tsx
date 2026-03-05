'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminHeaderSlots } from '@/contexts/AdminHeaderSlotsContext';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const AdminHeader = React.forwardRef<HTMLElement, AdminHeaderProps>(
  ({ onMenuToggle, isMobileMenuOpen }, ref) => {
    const { slots } = useAdminHeaderSlots();

    return (
      <header
        ref={ref}
        className={cn(
          'flex items-center justify-between gap-4 border-b border-surface bg-white px-4 py-3 md:px-6'
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:hidden"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="min-w-0">
            {slots.title ?? (
              <>
                <p className="text-xs uppercase tracking-wide text-text/60">Admin</p>
                <h1 className="truncate text-lg font-semibold text-secondary">Blog control panel</h1>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">{slots.actions}</div>
      </header>
    );
  }
);

AdminHeader.displayName = 'AdminHeader';
