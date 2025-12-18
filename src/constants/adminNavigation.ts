/**
 * Admin Navigation Configuration
 * Clean, organized navigation structure for the admin CMS
 */

import { 
  DashboardIcon, 
  ContentIcon, 
  CategoriesIcon, 
  MediaIcon, 
  SettingsIcon, 
  DotIcon 
} from '@/components/admin/NavigationIcons';

export interface NavigationItem {
  id: string;
  href: string;
  label: string;
  description?: string;
  icon: {
    regular: React.ComponentType<{ className?: string }>;
    active?: React.ComponentType<{ className?: string }>;
  };
  badge?: {
    count?: number;
    variant?: 'default' | 'success' | 'warning' | 'error';
  };
  children?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    href: '/admin',
    label: 'Dashboard',
    description: 'Overview and analytics',
    icon: {
      regular: DashboardIcon,
      active: DashboardIcon,
    },
  },
  {
    id: 'posts',
    href: '/admin/posts',
    label: 'Content',
    description: 'Posts and articles',
    icon: {
      regular: ContentIcon,
      active: ContentIcon,
    },
    children: [
      {
        id: 'posts-all',
        href: '/admin/posts',
        label: 'All Posts',
        description: 'Manage all content',
        icon: {
          regular: DotIcon,
        },
      },
      {
        id: 'posts-new',
        href: '/admin/posts/new',
        label: 'New Post',
        description: 'Create content',
        icon: {
          regular: DotIcon,
        },
      },
    ],
  },
  {
    id: 'categories',
    href: '/admin/categories',
    label: 'Categories',
    description: 'Content organization',
    icon: {
      regular: CategoriesIcon,
      active: CategoriesIcon,
    },
  },
  {
    id: 'media',
    href: '/admin/media',
    label: 'Media Library',
    description: 'Images and files',
    icon: {
      regular: MediaIcon,
      active: MediaIcon,
    },
  },
  {
    id: 'settings',
    href: '/admin/settings',
    label: 'Settings',
    description: 'Site configuration',
    icon: {
      regular: SettingsIcon,
      active: SettingsIcon,
    },
  },
];

// Utility functions
export function findNavigationItem(items: NavigationItem[], path: string): NavigationItem | null {
  for (const item of items) {
    if (item.href === path) return item;
    if (item.children) {
      const found = findNavigationItem(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

export function getActiveNavigationItem(items: NavigationItem[], currentPath: string): NavigationItem | null {
  // Exact match first
  const exactMatch = findNavigationItem(items, currentPath);
  if (exactMatch) return exactMatch;

  // Parent match (for nested routes)
  for (const item of items) {
    if (currentPath.startsWith(item.href) && item.href !== '/admin') {
      return item;
    }
  }

  // Default to dashboard
  return findNavigationItem(items, '/admin');
}