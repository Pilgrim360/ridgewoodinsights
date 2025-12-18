'use client';

import React, { useEffect, useRef } from 'react';
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
 * AdminSidebar - Modern, professional navigation sidebar
 * 
 * Features:
 * - Clean, minimalist design inspired by Notion/Ghost/Linear
 * - Fixed left positioning with smooth collapse/expand (240px ↔ 64px)
 * - Expandable submenus with localStorage persistence
 * - Responsive mobile overlay with focus trap
 * - Smooth animations and hover effects
 * - Accessible keyboard navigation
 */
export const AdminSidebar = React.forwardRef<HTMLDivElement, AdminSidebarProps>(
  ({ state }, ref) => {
    const { isExpanded, isMobileOpen, expandedGroups, toggleGroup, closeMobileMenu } = state;
    const focusTrapRef = useRef<HTMLDivElement>(null);

    // Navigation structure
    const navItems: (NavItem | NavGroup)[] = [
      {
        href: '/admin',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        id: 'posts',
        label: 'Posts',
        icon: <FileText className="w-5 h-5" />,
        items: [
          { href: '/admin/posts', label: 'All Posts', icon: null },
          { href: '/admin/posts?status=draft', label: 'Drafts', icon: null },
          { href: '/admin/posts?status=scheduled', label: 'Scheduled', icon: null },
          { href: '/admin/posts/new', label: 'New Post', icon: null },
        ],
      },
      {
        href: '/admin/categories',
        label: 'Categories',
        icon: <Tag className="w-5 h-5" />,
      },
      {
        href: '/admin/media',
        label: 'Media Library',
        icon: <ImageIcon className="w-5 h-5" />,
      },
      {
        href: '/admin/settings',
        label: 'Settings',
        icon: <Settings className="w-5 h-5" />,
      },
    ];

    // Focus trap for mobile menu
    useEffect(() => {
      if (!isMobileOpen || typeof window === 'undefined') return;

      const handleKeyDown = (e: KeyboardEvent) => {
        // Close on Escape
        if (e.key === 'Escape') {
          closeMobileMenu();
          return;
        }

        // Focus trap: Keep focus within menu when Tab is pressed
        if (e.key !== 'Tab') return;

        const focusableElements = focusTrapRef.current?.querySelectorAll(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        const activeElement = document.activeElement;

        if (e.shiftKey) {
          // Shift+Tab - move to previous element
          if (activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab - move to next element
          if (activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobileOpen, closeMobileMenu]);

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
        {/* Desktop Sidebar (md+) */}
        <div
          ref={ref}
          className={cn(
            'hidden md:flex flex-col h-screen bg-white border-r border-surface overflow-hidden',
            'transition-all duration-200 ease-in-out',
            isExpanded ? 'w-60' : 'w-16'
          )}
          role="navigation"
          aria-label="Main navigation"
        >
          <SidebarHeader isExpanded={isExpanded} />
          
          <SidebarNav
            items={navItems}
            isExpanded={isExpanded}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
          />

          <SidebarFooter isExpanded={isExpanded} onToggleExpand={state.toggleExpand} />
        </div>

        {/* Mobile Sidebar Overlay (<md) */}
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-200"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Mobile Sidebar Panel */}
            <div
              ref={focusTrapRef}
              className={cn(
                'fixed top-0 left-0 h-screen w-60 bg-white z-50 md:hidden',
                'flex flex-col shadow-2xl',
                'animate-in slide-in-from-left duration-200'
              )}
              role="navigation"
              aria-label="Mobile navigation"
            >
              <SidebarHeader
                isExpanded={true}
                isMobile={true}
                onClose={closeMobileMenu}
              />

              <SidebarNav
                items={navItems}
                isExpanded={true}
                expandedGroups={expandedGroups}
                onToggleGroup={toggleGroup}
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