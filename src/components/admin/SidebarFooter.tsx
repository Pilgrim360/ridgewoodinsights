'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarFooterProps {
  isExpanded: boolean;
  onToggleExpand?: () => void;
}

/**
 * SidebarFooter - User info, logout button, and collapse toggle
 * 
 * Features:
 * - User email display when expanded
 * - Logout and collapse buttons on same line when expanded
 * - Only collapse button visible when collapsed
 * - Smooth transitions
 * - Tooltip on hover when collapsed
 * - Loading state handling
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
        className="border-t border-surface px-3 py-4 flex flex-col gap-3"
      >
        {/* User info - only when expanded */}
        {isExpanded && (
          <div className="px-3 min-w-0">
            <p className="text-xs font-medium text-secondary truncate">
              {user.email}
            </p>
            <p className="text-xs text-text/70 mt-0.5">Admin</p>
          </div>
        )}

        {/* Action buttons row */}
        <div className="flex items-center gap-2">
          {/* Logout button - hidden when collapsed */}
          {isExpanded && (
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-secondary hover:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          )}

          {/* Collapse toggle button - always visible on desktop */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className={cn(
                'flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200',
                'text-secondary hover:bg-surface/50 group relative',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                !isExpanded && 'w-full'
              )}
              aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-pressed={isExpanded}
              title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isExpanded ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}

              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-secondary text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Expand sidebar
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

SidebarFooter.displayName = 'SidebarFooter';