'use client';

import React from 'react';
import { NAV_ITEMS } from '@/constants/admin-nav';
import { SidebarNavItem } from './SidebarNavItem';

interface SidebarNavProps {
  isExpanded: boolean;
  onLinkClick?: () => void;
}

export function SidebarNav({ isExpanded, onLinkClick }: SidebarNavProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
      <ul>
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <SidebarNavItem
              item={item}
              isExpanded={isExpanded}
              onLinkClick={onLinkClick}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
