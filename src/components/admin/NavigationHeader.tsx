/**
 * Modern Navigation Header Component
 * Clean, professional branding with elegant toggle interaction
 */

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavigationHeaderProps {
  isExpanded: boolean;
  onToggleExpand?: () => void;
  onMobileMenuClose?: () => void;
  isMobile?: boolean;
}

export function NavigationHeader({ 
  isExpanded, 
  onToggleExpand, 
  onMobileMenuClose,
  isMobile = false 
}: NavigationHeaderProps) {
  
  const handleToggle = () => {
    if (isMobile && onMobileMenuClose) {
      onMobileMenuClose();
    } else if (onToggleExpand) {
      onToggleExpand();
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-surface/60">
      {/* Logo & Brand */}
      <Link 
        href="/admin" 
        className="flex items-center gap-3 group"
        onClick={isMobile ? onMobileMenuClose : undefined}
      >
        {/* Logo Icon */}
        <div className="relative">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <span className="text-white font-bold text-sm tracking-tight">R</span>
          </div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 w-9 h-9 bg-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 blur-sm" />
        </div>

        {/* Brand Text */}
        {isExpanded && (
          <div className="flex flex-col leading-tight">
            <span className="text-secondary font-semibold text-base tracking-tight">
              Ridgewood Insights
            </span>
            <span className="text-text/60 text-xs font-medium">
              Admin Portal
            </span>
          </div>
        )}
      </Link>

      {/* Toggle Button */}
      {!isMobile && onToggleExpand && (
        <button
          onClick={handleToggle}
          className={cn(
            'group relative p-2 rounded-lg transition-all duration-200',
            'hover:bg-surface/80 active:scale-95',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
          )}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <div className="relative w-4 h-4">
            <div className={cn(
              'absolute inset-0 w-4 h-0.5 bg-text/60 rounded-full transition-all duration-200',
              'group-hover:bg-secondary'
            )} />
            <div className={cn(
              'absolute inset-0 w-4 h-0.5 bg-text/60 rounded-full transition-all duration-200 top-1.5',
              'group-hover:bg-secondary'
            )} />
            <div className={cn(
              'absolute inset-0 w-4 h-0.5 bg-text/60 rounded-full transition-all duration-200 top-3',
              'group-hover:bg-secondary'
            )} />
          </div>
        </button>
      )}
    </div>
  );
}