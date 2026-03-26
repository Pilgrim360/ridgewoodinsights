'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/cms';

interface SidebarNavItemProps {
  item: NavItem;
  isExpanded: boolean;
  isNested?: boolean;
  onClick?: () => void;
}

/**
 * SidebarNavItem - Individual navigation link with refined SaaS styling
 * 
 * Features:
 * - Icon + label with smooth transitions
 * - Active state with subtle background and primary accent
 * - Hover effect with refined background
 * - Tooltip on hover when collapsed
 * - Badge support for counts
 */
export const SidebarNavItem = React.forwardRef<HTMLAnchorElement, SidebarNavItemProps>(
  ({ item, isExpanded, isNested = false, onClick }, ref) => {
    const pathname = usePathname();
    
    // Check if current route matches this item
    const isActive = item.href === '/cms'
      ? pathname === '/cms'
      : pathname.startsWith(item.href);

    return (
      <Link
        ref={ref}
        href={item.href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
          'hover:no-underline group relative',
          isNested && 'pl-11',
          isActive
            ? 'bg-primary/5 text-primary shadow-[inset_0_0_0_1px_rgba(0,100,102,0.1)]'
            : 'text-text/70 hover:bg-surface hover:text-secondary',
          !isExpanded && !isNested && 'justify-center'
        )}
        title={!isExpanded ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Icon */}
        {item.icon && (
          <span className={cn(
            "flex-shrink-0 flex items-center justify-center transition-colors",
            isActive ? "text-primary" : "text-text/40 group-hover:text-secondary"
          )}>
            {item.icon}
          </span>
        )}

        {/* Label - visible when expanded */}
        {isExpanded && (
          <span className="flex-1 text-sm font-medium whitespace-nowrap">
            {item.label}
          </span>
        )}

        {/* Badge - visible when expanded and badge exists */}
        {isExpanded && item.badge !== undefined && item.badge > 0 && (
          <span
            className={cn(
              'flex-shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-tight',
              isActive
                ? 'bg-primary/20 text-primary'
                : 'bg-surface text-text/50'
            )}
          >
            {item.badge}
          </span>
        )}

        {/* Tooltip for collapsed state */}
        {!isExpanded && !isNested && (
          <span className="absolute left-full ml-4 px-2 py-1 bg-secondary text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
            {item.label}
          </span>
        )}
      </Link>
    );
  }
);

SidebarNavItem.displayName = 'SidebarNavItem';
