import {
  LayoutDashboard,
  Newspaper,
  Folders,
  Settings,
  Image,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  color?: string;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Posts',
    href: '/admin/posts',
    icon: Newspaper,
    children: [
      { label: 'All Posts', href: '/admin/posts', icon: Newspaper },
      { label: 'Drafts', href: '/admin/posts/drafts', icon: Newspaper },
      { label: 'Scheduled', href: '/admin/posts/scheduled', icon: Newspaper },
    ],
  },
  {
    label: 'Media Library',
    href: '/admin/media',
    icon: Image,
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: Folders,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];
