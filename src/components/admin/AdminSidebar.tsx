'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SidebarState, NavItem, NavGroup } from '@/types/admin';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';
import {
  LayoutDashboard,
  FileText,
  Tag,
  Image as ImageIcon,
  Settings,
} from 'lucide-react';

interface AdminSidebarProps {
  state: SidebarState;
}

/**
 * AdminSidebar - Clean, minimalist navigation
 */
export const AdminSidebar = React.forwardRef<HTMLDivElement, AdminSidebarProps>(
  ({ state }, ref) => {
    const { isExpanded, isMobileOpen, closeMobileMenu } = state;

    const navItems: (NavItem | NavGroup)[] = [
      {
        href: '/admin',
        label: 'Insights',
        icon: <LayoutDashboard />,
      },
      {
        href: '/admin/posts',
        label: 'Posts',
        icon: <FileText />,
      },
      {
        href: '/admin/categories',
        label: 'Categories',
        icon: <Tag />,
      },
      {
        href: '/admin/media',
        label: 'Library',
        icon: <ImageIcon />,
      },
      {
        href: '/admin/settings',
        label: 'Settings',
        icon: <Settings />,
      },
    ];

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
      if (isMobileOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isMobileOpen]);

    return (
      <>
        {/* Desktop Sidebar */}
        <div
          ref={ref}
          className={cn(
            'hidden md:flex flex-col h-screen bg-white border-r border-zinc-100 overflow-hidden',
            'transition-all duration-300 ease-in-out',
            isExpanded ? 'w-56' : 'w-20'
          )}
          role="navigation"
        >
          <SidebarHeader isExpanded={isExpanded} />
          
          <SidebarNav
            items={navItems}
            isExpanded={isExpanded}
          />

          <SidebarFooter isExpanded={isExpanded} onToggleExpand={state.toggleExpand} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/5 md:hidden transition-opacity duration-300"
              onClick={closeMobileMenu}
            />

            <div
              className={cn(
                'fixed top-0 left-0 h-screen w-64 bg-white z-50 md:hidden',
                'flex flex-col shadow-xl animate-in slide-in-from-left duration-300'
              )}
              role="navigation"
            >
              <SidebarHeader
                isExpanded={true}
                isMobile={true}
                onClose={closeMobileMenu}
              />

              <SidebarNav
                items={navItems}
                isExpanded={true}
                onItemClick={closeMobileMenu}
              />

              <SidebarFooter isExpanded={true} />
            </div>
          </>
        )}
      </>
    );
  }
);

AdminSidebar.displayName = 'AdminSidebar';
