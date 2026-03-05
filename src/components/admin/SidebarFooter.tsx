'use client';

import React from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarFooterProps {
  isExpanded: boolean;
  onToggleExpand?: () => void;
}

/**
 * SidebarFooter - Minimalist logout and collapse toggle
 */
export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ isExpanded, onToggleExpand }, ref) => {
    const { user, logout, isLoading } = useAdminAuth();

    if (!user) return null;

    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    return (
      <div
        ref={ref}
        className="px-6 py-8 mt-auto flex flex-col gap-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-3 text-zinc-500 hover:text-zinc-900 transition-colors disabled:opacity-50"
            aria-label="Logout"
            title={!isExpanded ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {isExpanded && <span className="text-sm font-medium tracking-tight">Logout</span>}
          </button>

          {onToggleExpand && isExpanded && (
            <button
              onClick={onToggleExpand}
              className="ml-auto text-zinc-400 hover:text-zinc-900 transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {!isExpanded && onToggleExpand && (
          <button
            onClick={onToggleExpand}
            className="flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    );
  }
);

SidebarFooter.displayName = 'SidebarFooter';
