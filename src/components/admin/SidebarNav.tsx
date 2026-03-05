'use client';

import React from 'react';
import { NavItem, NavGroup } from '@/types/admin';
import { SidebarNavItem } from './SidebarNavItem';

interface SidebarNavProps {
  items: (NavItem | NavGroup)[];
  isExpanded: boolean;
  onItemClick?: () => void;
}

/**
 * SidebarNav - Flat navigation list
 */
export const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  ({ items, isExpanded, onItemClick }, ref) => {

    // Flatten items to remove groups for a minimalist look
    const flattenedItems: NavItem[] = items.flatMap(item => {
      if ('items' in item) {
        return item.items;
      }
      return [item];
    });

    return (
      <nav
        ref={ref}
        className="flex-1 space-y-1"
        aria-label="Main navigation"
      >
        {flattenedItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isExpanded={isExpanded}
            onClick={onItemClick}
          />
        ))}
      </nav>
    );
  }
);

SidebarNav.displayName = 'SidebarNav';
