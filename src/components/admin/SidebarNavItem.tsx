'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/admin';

interface SidebarNavItemProps {
  item: NavItem;
  isExpanded: boolean;
  onClick?: () => void;
}

/**
 * SidebarNavItem - Minimalist navigation link
 */
export const SidebarNavItem = React.forwardRef<HTMLAnchorElement, SidebarNavItemProps>(
  ({ item, isExpanded, onClick }, ref) => {
    const pathname = usePathname();
    
    const isActive = item.href === '/admin' 
      ? pathname === '/admin'
      : pathname.startsWith(item.href);

    return (
      <Link
        ref={ref}
        href={item.href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-6 py-2 transition-colors duration-200',
          'hover:no-underline group relative',
          isActive
            ? 'text-zinc-900 font-semibold'
            : 'text-zinc-500 hover:text-zinc-900',
          !isExpanded && 'justify-center px-0'
        )}
        title={!isExpanded ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Active Indicator - subtle left line */}
        {isActive && isExpanded && (
          <div className="absolute left-0 w-1 h-4 bg-zinc-900 rounded-r-full" />
        )}

        {/* Icon */}
        {item.icon && (
          <span className={cn(
            "flex-shrink-0 flex items-center justify-center transition-colors",
            isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900"
          )}>
            {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 18 })}
          </span>
        )}

        {/* Label */}
        {isExpanded && (
          <span className="flex-1 text-sm tracking-tight whitespace-nowrap">
            {item.label}
          </span>
        )}

        {/* Tooltip for collapsed state */}
        {!isExpanded && (
          <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
            {item.label}
          </span>
        )}
      </Link>
    );
  }
);

SidebarNavItem.displayName = 'SidebarNavItem';
