'use client';

import React from 'react';
import Link from 'next/link';
import { X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isExpanded: boolean;
  isMobile?: boolean;
  onClose?: () => void;
  onSearchOpen?: () => void;
}

/**
 * SidebarHeader - Logo and close button (mobile only)
 * 
 * Desktop: Shows only logo
 * Mobile: Shows logo with close button (X icon)
 * Smooth transitions for logo text visibility
 */
export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ isExpanded, isMobile = false, onClose, onSearchOpen }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-4 px-3 py-4 border-b border-surface",
          !isExpanded && !isMobile && "items-center"
        )}
      >
        <div className="flex items-center justify-between gap-3 w-full">
          {/* Logo */}
          <Link
            href="/cms"
            className="flex items-center gap-2.5 hover:no-underline group px-1"
            title="CMS Dashboard"
          >
            {/* Logo icon - always visible */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg font-bold text-sm transition-transform group-hover:scale-105 shadow-sm shadow-primary/20">
              R
            </div>

            {/* Logo text - visible when expanded */}
            {isExpanded && (
              <span className="text-base font-semibold text-secondary whitespace-nowrap transition-opacity duration-200">
                Ridgewood
              </span>
            )}
          </Link>

          {/* Close button - mobile only */}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:bg-surface/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Close menu"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Trigger - Desktop Only (moved from CmsHeader) */}
        {!isMobile && onSearchOpen && (
          <button
            onClick={onSearchOpen}
            className={cn(
              "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-200",
              "text-text/50 bg-background border border-surface",
              "hover:border-primary/30 hover:bg-white hover:text-text/70 hover:shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              !isExpanded ? "justify-center w-10 h-10 p-0" : "w-full"
            )}
            aria-label="Search (Ctrl+K)"
            title={!isExpanded ? "Search (Ctrl+K)" : undefined}
          >
            <Search className="w-4 h-4 flex-shrink-0" />
            {isExpanded && (
              <div className="flex items-center justify-between flex-1">
                <span className="text-xs">Search…</span>
                <kbd className="text-[10px] bg-surface px-1 py-0.5 rounded font-mono text-text/40">
                  ⌘K
                </kbd>
              </div>
            )}
          </button>
        )}
      </div>
    );
  }
);

SidebarHeader.displayName = 'SidebarHeader';