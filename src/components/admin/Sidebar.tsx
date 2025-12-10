'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SidebarHeader } from './SidebarHeader';
import { SidebarLink } from './SidebarLink';
import { SidebarFooter } from './SidebarFooter';
import { SidebarState } from '@/types/admin';

interface SidebarProps {
  state: SidebarState;
}

/**
 * Sidebar - Main navigation component
 * 
 * Desktop (md+):
 * - Always visible, width toggles between 240px (expanded) and 80px (collapsed)
 * - Smooth transition with icons + optional labels
 * 
 * Mobile (<md):
 * - Hidden by default
 * - Click hamburger → overlay sidebar (100% width)
 * - Escape key or backdrop click closes
 * - Focus trap prevents tabbing outside menu
 */
export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ state }, ref) => {
    const { isExpanded, isMobileOpen, toggleExpand, closeMobileMenu } = state;
    const focusTrapRef = useRef<HTMLDivElement>(null);

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

    const navItems = [
      {
        href: '/admin',
        label: 'Dashboard',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 9l-3-3m0 0l3-3m0 3h9"
            />
          </svg>
        ),
      },
      {
        href: '/admin/posts',
        label: 'Posts',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        ),
      },
      {
        href: '/admin/categories',
        label: 'Categories',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        ),
      },
      {
        href: '/admin/settings',
        label: 'Settings',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
    ];

    return (
      <>
        {/* Desktop Sidebar (md+) */}
        <div
          ref={ref}
          className={cn(
            'hidden md:flex flex-col h-screen bg-white border-r border-surface',
            'transition-all duration-300 ease-in-out',
            isExpanded ? 'w-60' : 'w-20'
          )}
          role="navigation"
          aria-label="Main navigation"
        >
          <SidebarHeader isExpanded={isExpanded} onToggleExpand={toggleExpand} />

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
            {navItems.map((item) => (
              <SidebarLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isExpanded={isExpanded}
              />
            ))}
          </nav>

          <SidebarFooter isExpanded={isExpanded} />
        </div>

        {/* Mobile Sidebar Overlay (<md) */}
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Mobile Sidebar Panel */}
            <div
              ref={focusTrapRef}
              className={cn(
                'fixed top-0 left-0 h-screen w-60 bg-white z-50 md:hidden',
                'flex flex-col shadow-lg',
                'animate-in slide-in-from-left-full duration-300'
              )}
              role="navigation"
              aria-label="Mobile navigation"
            >
              <SidebarHeader isExpanded={true} onToggleExpand={closeMobileMenu} />

              {/* Navigation Links (Always expanded on mobile) */}
              <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
                {navItems.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isExpanded={true}
                    onClick={closeMobileMenu}
                  />
                ))}
              </nav>

              <SidebarFooter isExpanded={true} />
            </div>
          </>
        )}
      </>
    );
  }
);

Sidebar.displayName = 'Sidebar';
