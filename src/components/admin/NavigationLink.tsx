/**
 * Modern Navigation Link Component
 * Clean, professional navigation items with elegant interactions
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavigationItem } from '@/constants/adminNavigation';

interface NavigationLinkProps {
  item: NavigationItem;
  isExpanded: boolean;
  onNavigate?: () => void;
  level?: number;
}

export function NavigationLink({ 
  item, 
  isExpanded, 
  onNavigate,
  level = 0 
}: NavigationLinkProps) {
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href;
  const isChildActive = hasChildren && item.children?.some(child => 
    pathname.startsWith(child.href)
  );

  // Check if this item should be highlighted as parent of active child
  const isParentActive = hasChildren && isChildActive && !isActive;

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const linkElement = (
    <Link
      href={item.href}
      onClick={handleClick}
      className={cn(
        // Base styles
        'group relative flex items-center gap-3 w-full rounded-xl transition-all duration-200',
        'hover:no-underline focus:no-underline',
        
        // Layout
        level === 0 ? 'px-4 py-3' : 'px-6 py-2 ml-4',
        
        // Active/hover states
        (isActive || isParentActive) && 'bg-primary/10 border-primary/20 border',
        !isActive && !isParentActive && 'hover:bg-surface/50',
        
        // Spacing for expanded/collapsed
        isExpanded ? 'justify-start' : 'justify-center px-3',
        
        // Focus styles
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
      )}
      title={!isExpanded ? item.label : undefined}
    >
      {/* Icon Container */}
      <div className="relative flex-shrink-0 transition-colors duration-200">
        <div className={cn(
          'absolute inset-0 transition-all duration-200',
          (isActive || isParentActive) && 'text-primary',
          !isActive && !isParentActive && 'text-text/60 group-hover:text-secondary'
        )}>
          {React.createElement(
            (isActive || isParentActive) && item.icon.active ? item.icon.active : item.icon.regular,
            { className: level === 0 ? 'w-5 h-5' : 'w-4 h-4' }
          )}
        </div>
        
        {/* Subtle background glow for active items */}
        {(isActive || isParentActive) && (
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
        )}
      </div>

      {/* Label and Description */}
      {isExpanded && (
        <div className="flex flex-col min-w-0 flex-1">
          <span className={cn(
            'text-sm font-medium truncate transition-colors duration-200',
            (isActive || isParentActive) && 'text-primary font-semibold',
            !isActive && !isParentActive && 'text-text group-hover:text-secondary'
          )}>
            {item.label}
          </span>
          
          {item.description && level === 0 && (
            <span className={cn(
              'text-xs truncate transition-colors duration-200',
              (isActive || isParentActive) ? 'text-primary/70' : 'text-text/50'
            )}>
              {item.description}
            </span>
          )}
        </div>
      )}

      {/* Badge */}
      {item.badge && isExpanded && item.badge.count && (
        <div className={cn(
          'flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium',
          item.badge.variant === 'success' && 'bg-success/20 text-success',
          item.badge.variant === 'warning' && 'bg-warning/20 text-warning',
          item.badge.variant === 'error' && 'bg-error/20 text-error',
          !item.badge.variant && 'bg-surface text-text'
        )}>
          {item.badge.count}
        </div>
      )}

      {/* Chevron for expandable items */}
      {hasChildren && isExpanded && (
        <div className={cn(
          'flex-shrink-0 w-4 h-4 transition-transform duration-200',
          isChildActive && 'rotate-90'
        )}>
          <svg className="w-full h-full text-text/40" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </Link>
  );

  // If has children and is expanded, wrap with child items
  if (hasChildren && isExpanded) {
    return (
      <div className="space-y-1">
        {linkElement}
        <div className="ml-4 space-y-1">
          {item.children?.map((child) => (
            <NavigationLink
              key={child.id}
              item={child}
              isExpanded={isExpanded}
              onNavigate={onNavigate}
              level={1}
            />
          ))}
        </div>
      </div>
    );
  }

  return linkElement;
}