'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
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
        className="px-6 py-6 flex items-center justify-between gap-4"
        role="banner"
      >
        <button
          onClick={onMenuToggle}
          className="md:hidden text-zinc-400 hover:text-zinc-900 transition-colors"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex-1 flex items-center min-w-0">
          {slots.title && (
            <div className="text-sm font-medium text-zinc-400 tracking-tight">
              {slots.title}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {slots.actions}
        </div>
      </header>
    );
  }
);

AdminHeader.displayName = 'AdminHeader';
