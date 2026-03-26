'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useCmsAuth } from '@/contexts/CmsAuthContext';
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
    const { user, logout, isLoading } = useCmsAuth();

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
        className="mt-auto px-3 py-4 flex flex-col gap-2"
      >
        {/* User info - only when expanded */}
        {isExpanded && (
          <div className="px-3 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase">
              {user.email.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user.email.split('@')[0]}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">Admin</p>
            </div>
          </div>
        )}

        {/* Action buttons row */}
        <div className="flex flex-col gap-1">
          {/* Logout button - hidden when collapsed */}
          {isExpanded && (
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center gap-3 px-3 py-1.5 rounded-md transition-all duration-200 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium">Log out</span>
            </button>
          )}

          {/* Collapse toggle button - always visible on desktop */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className={cn(
                'flex items-center gap-3 px-3 py-1.5 rounded-md transition-all duration-200',
                'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 group relative',
                !isExpanded && 'justify-center'
              )}
              aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-pressed={isExpanded}
              title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isExpanded ? (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-xs font-medium">Collapse</span>
                </>
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}

              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10">
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