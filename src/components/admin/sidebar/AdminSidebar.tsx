'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SidebarNav } from './SidebarNav';
import { SidebarUserMenu } from './SidebarUserMenu';
import { SidebarBrand } from './SidebarBrand';
import { useSidebarState } from '@/hooks/useSidebarState';

interface AdminSidebarProps {
  className?: string;
}

/**
 * AdminSidebar - Modern, polished left navigation panel
 * 
 * Features:
 * - Fixed left positioning with smooth collapse/expand
 * - Expandable submenu items
 * - Responsive mobile drawer with backdrop
 * - State persistence via localStorage
 * - Professional design inspired by Notion/Linear
 * - Focus trap and keyboard navigation
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
  const state = useSidebarState();
  const { isExpanded, isMobileOpen, closeMobileMenu } = state;
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle escape key for mobile menu
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen, closeMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen bg-white border-r border-gray-200',
          'transition-all duration-300 ease-in-out',
          'fixed left-0 top-0 z-30',
          isExpanded ? 'w-64' : 'w-20',
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <SidebarBrand state={state} />
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <SidebarNav state={state} />
        </div>

        <SidebarUserMenu state={state} />
      </aside>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <aside
          ref={mobileMenuRef}
          className={cn(
            'fixed top-0 left-0 h-screen w-72 bg-white z-50 md:hidden',
            'flex flex-col shadow-2xl',
            'animate-in slide-in-from-left duration-300'
          )}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <SidebarBrand state={state} isMobile />
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <SidebarNav state={state} isMobile />
          </div>

          <SidebarUserMenu state={state} isMobile />
        </aside>
      )}
    </>
  );
};
