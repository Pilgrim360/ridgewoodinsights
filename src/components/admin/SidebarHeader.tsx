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
 * SidebarHeader - Clean, typographic logo
 */
export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ isExpanded, isMobile = false, onClose }, ref) => {
    return (
      <div
        ref={ref}
        className="flex items-center justify-between gap-3 px-6 py-8"
      >
        <Link
          href="/admin"
          className="flex items-center gap-2 hover:no-underline group"
          title="Admin Dashboard"
        >
          <span className="text-xl font-bold tracking-tighter text-primary">
            RW
          </span>

          {isExpanded && (
            <span className="text-sm font-medium text-zinc-400 tracking-tight transition-opacity duration-200">
              Insight
            </span>
          )}
        </Link>

        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);

SidebarHeader.displayName = 'SidebarHeader';
