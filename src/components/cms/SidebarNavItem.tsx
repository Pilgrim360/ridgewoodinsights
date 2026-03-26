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
 * SidebarNavItem - Individual navigation link
 * 
 * Features:
 * - Icon + label with smooth transitions
 * - Active state with primary background
 * - Hover effect with subtle background
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
          'flex items-center gap-3 px-3 py-1.5 rounded-md transition-all duration-200',
          'hover:no-underline group relative',
          isNested && 'pl-11',
          isActive
            ? 'bg-white/10 text-white shadow-sm'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5',
          !isExpanded && !isNested && 'justify-center'
        )}
        title={!isExpanded ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Icon */}
        {item.icon && (
          <span className="flex-shrink-0 flex items-center justify-center">
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
              'flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full',
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-primary/10 text-primary'
            )}
          >
            {item.badge}
          </span>
        )}

        {/* Tooltip for collapsed state */}
        {!isExpanded && !isNested && (
          <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10">
            {item.label}
          </span>
        )}
      </Link>
    );
  }
);

SidebarNavItem.displayName = 'SidebarNavItem';