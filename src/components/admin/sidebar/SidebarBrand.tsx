'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeft, X } from 'lucide-react';
import { SidebarState } from '@/types/admin';

interface SidebarBrandProps {
  state: SidebarState;
  isMobile?: boolean;
}

/**
 * SidebarBrand - Logo and collapse toggle
 * Shows brand identity and controls sidebar expansion
 */
export const SidebarBrand: React.FC<SidebarBrandProps> = ({ state, isMobile }) => {
  const { isExpanded, toggleExpand, closeMobileMenu } = state;

  return (
    <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 flex-shrink-0">
      {/* Logo */}
      <Link
        href="/admin"
        className={cn(
          'flex items-center gap-3 group transition-opacity hover:opacity-80',
          !isExpanded && !isMobile && 'justify-center w-full'
        )}
        title="Admin Dashboard"
        onClick={isMobile ? closeMobileMenu : undefined}
      >
        {/* Logo Icon */}
        <div
          className={cn(
            'flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80',
            'text-white font-bold shadow-sm transition-all',
            isExpanded || isMobile ? 'w-9 h-9 text-base' : 'w-10 h-10 text-lg'
          )}
        >
          R
        </div>

        {/* Logo Text */}
        {(isExpanded || isMobile) && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 leading-tight">
              Ridgewood
            </span>
            <span className="text-xs text-gray-500 leading-tight">
              Admin
            </span>
          </div>
        )}
      </Link>

      {/* Toggle Button */}
      {isMobile ? (
        <button
          onClick={closeMobileMenu}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg',
            'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20'
          )}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={toggleExpand}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg',
            'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20',
            !isExpanded && 'hidden'
          )}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeft className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};
