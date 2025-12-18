'use client';

import React from 'react';
import { NavItem, NavGroup } from '@/types/admin';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarNavGroup } from './SidebarNavGroup';

interface SidebarNavProps {
  items: (NavItem | NavGroup)[];
  isExpanded: boolean;
  expandedGroups: Set<string>;
  onToggleGroup: (groupId: string) => void;
  onItemClick?: () => void;
}

/**
 * SidebarNav - Navigation list container
 * 
 * Renders a vertical stack of navigation items and expandable groups
 * with consistent spacing and scrollable overflow
 */
export const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  ({ items, isExpanded, expandedGroups, onToggleGroup, onItemClick }, ref) => {
    const isGroup = (item: NavItem | NavGroup): item is NavGroup => {
      return 'items' in item;
    };

    return (
      <nav
        ref={ref}
        className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1"
        aria-label="Main navigation"
      >
        {items.map((item) => {
          if (isGroup(item)) {
            return (
              <SidebarNavGroup
                key={item.id}
                group={item}
                isExpanded={isExpanded}
                isGroupExpanded={expandedGroups.has(item.id)}
                onToggleGroup={() => onToggleGroup(item.id)}
                onItemClick={onItemClick}
              />
            );
          }

          return (
            <SidebarNavItem
              key={item.href}
              item={item}
              isExpanded={isExpanded}
              onClick={onItemClick}
            />
          );
        })}
      </nav>
    );
  }
);

SidebarNav.displayName = 'SidebarNav';