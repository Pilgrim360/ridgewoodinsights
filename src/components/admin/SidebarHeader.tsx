'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

/**
 * SidebarHeader - Logo and collapse toggle
 * Shows logo text when expanded, icon-only when collapsed
 * Toggle button always visible
 */
export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ isExpanded, onToggleExpand }, ref) => {
    return (
      <div
        ref={ref}
        className="flex items-center justify-between gap-3 px-4 py-4 border-b border-surface"
      >
        {/* Logo */}
        <Link
          href="/admin"
          className="flex items-center gap-2 hover:no-underline"
          title="Admin Dashboard"
        >
          {/* Logo icon/mark - always visible */}
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-md font-bold">
            R
          </div>

          {/* Logo text - only visible when expanded */}
          {isExpanded && (
            <span className="text-sm font-semibold text-secondary whitespace-nowrap">
              Ridgewood
            </span>
          )}
        </Link>

        {/* Collapse toggle button (desktop only) */}
        <button
          onClick={onToggleExpand}
          className={cn(
            'hidden md:flex flex-shrink-0 w-6 h-6 items-center justify-center rounded-md',
            'text-secondary hover:bg-surface transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
          )}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-pressed={isExpanded}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? (
            // Collapse icon (left arrow)
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            // Expand icon (right arrow)
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>
    );
  }
);

SidebarHeader.displayName = 'SidebarHeader';
