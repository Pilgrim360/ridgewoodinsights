'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfileDropdown } from './UserProfileDropdown';

interface SidebarFooterProps {
  isExpanded: boolean;
  onToggleExpand?: () => void;
}

/**
 * SidebarFooter - User profile dropdown and collapse toggle
 * 
 * Features:
 * - User profile dropdown with avatar and email
 * - Clean collapse toggle
 * - Refined spacing and visual hierarchy
 */
export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ isExpanded, onToggleExpand }, ref) => {
    return (
      <div
        ref={ref}
        className="border-t border-surface px-3 py-3 flex flex-col gap-2"
      >
        <UserProfileDropdown isExpanded={isExpanded} />

        {/* Collapse toggle button - always visible on desktop */}
        {onToggleExpand && (
          <button
            onClick={onToggleExpand}
            className={cn(
              'flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-200',
              'text-text/40 hover:text-secondary hover:bg-surface group relative',
              'focus:outline-none focus:ring-2 focus:ring-primary/20',
              !isExpanded && 'justify-center'
            )}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-pressed={isExpanded}
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? (
              <>
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">Collapse</span>
              </>
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )}

            {/* Tooltip for collapsed state */}
            {!isExpanded && (
              <span className="absolute left-full ml-4 px-2 py-1 bg-secondary text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                Expand
              </span>
            )}
          </button>
        )}
      </div>
    );
  }
);

SidebarFooter.displayName = 'SidebarFooter';
