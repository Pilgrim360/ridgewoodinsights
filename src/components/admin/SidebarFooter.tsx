'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface SidebarFooterProps {
  isExpanded: boolean;
}

/**
 * SidebarFooter - User info and logout button
 * Shows user email and logout button when expanded
 * Shows only logout icon when collapsed
 */
export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ isExpanded }, ref) => {
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
        className="border-t border-surface px-4 py-4 flex flex-col gap-3"
      >
        {/* User info - only when expanded */}
        {isExpanded && (
          <div className="min-w-0">
            <p className="text-xs font-medium text-secondary truncate">
              {user.email}
            </p>
            <p className="text-xs text-text/70">Admin</p>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-2 rounded-lg',
            'text-secondary hover:bg-surface transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isExpanded ? 'justify-start' : 'justify-center'
          )}
          title="Logout"
          aria-label="Logout"
        >
          {/* Logout icon */}
          <svg
            className="flex-shrink-0 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>

          {/* Label - only when expanded */}
          {isExpanded && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    );
  }
);

SidebarFooter.displayName = 'SidebarFooter';
