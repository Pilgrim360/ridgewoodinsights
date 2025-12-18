'use client';

import React, { useState } from 'react';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarState } from '@/types/admin';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Settings,
  FilePlus,
  FileEdit,
  Clock,
} from 'lucide-react';

interface SidebarNavProps {
  state: SidebarState;
  isMobile?: boolean;
}

export interface NavItem {
  id: string;
  href?: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  submenu?: {
    id: string;
    href: string;
    label: string;
    icon?: React.ReactNode;
  }[];
}

/**
 * SidebarNav - Navigation items with expandable submenus
 */
export const SidebarNav: React.FC<SidebarNavProps> = ({ state, isMobile }) => {
  const { isExpanded } = state;
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      href: '/admin',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'posts',
      href: '/admin/posts',
      label: 'Posts',
      icon: <FileText className="w-5 h-5" />,
      submenu: [
        {
          id: 'all-posts',
          href: '/admin/posts',
          label: 'All Posts',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: 'new-post',
          href: '/admin/posts/new',
          label: 'New Post',
          icon: <FilePlus className="w-4 h-4" />,
        },
        {
          id: 'drafts',
          href: '/admin/posts?status=draft',
          label: 'Drafts',
          icon: <FileEdit className="w-4 h-4" />,
        },
        {
          id: 'scheduled',
          href: '/admin/posts?status=scheduled',
          label: 'Scheduled',
          icon: <Clock className="w-4 h-4" />,
        },
      ],
    },
    {
      id: 'categories',
      href: '/admin/categories',
      label: 'Categories',
      icon: <FolderOpen className="w-5 h-5" />,
    },
    {
      id: 'media',
      href: '/admin/media',
      label: 'Media',
      icon: <ImageIcon className="w-5 h-5" />,
    },
  ];

  const settingsItems: NavItem[] = [
    {
      id: 'settings',
      href: '/admin/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="py-4 space-y-6">
      {/* Main Navigation */}
      <div className="px-3 space-y-1">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            isExpanded={isExpanded || !!isMobile}
            isSubmenuExpanded={expandedItems.has(item.id)}
            onToggleSubmenu={() => toggleItem(item.id)}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="px-3">
        <div className="border-t border-gray-200" />
      </div>

      {/* Settings Section */}
      <div className="px-3 space-y-1">
        {settingsItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            isExpanded={isExpanded || !!isMobile}
            isSubmenuExpanded={expandedItems.has(item.id)}
            onToggleSubmenu={() => toggleItem(item.id)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </nav>
  );
};
