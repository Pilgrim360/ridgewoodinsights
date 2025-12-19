'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface SidebarHeaderProps {
  isExpanded: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

/**
 * SidebarHeader - Logo and close button (mobile only)
 * 
 * Desktop: Shows only logo
 * Mobile: Shows logo with close button (X icon)
 * Smooth transitions for logo text visibility
 */
export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ isExpanded, isMobile = false, onClose }, ref) => {
    return (
      <div
        ref={ref}
        className="flex items-center justify-between gap-3 px-4 py-4 border-b border-surface"
      >
        {/* Logo */}
        <Link
          href="/admin"
          className="flex items-center gap-3 hover:no-underline group"
          title="Admin Dashboard"
        >
          {/* Logo icon - always visible */}
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg font-bold text-sm transition-transform group-hover:scale-105">
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
    );
  }
);

SidebarHeader.displayName = 'SidebarHeader';