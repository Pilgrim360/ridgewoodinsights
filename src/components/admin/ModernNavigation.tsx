/**
 * Modern Navigation Sidebar
 * Clean, professional admin navigation with refined aesthetics
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useNavigationState } from '@/hooks/useNavigationState';
import { navigationItems } from '@/constants/adminNavigation';
import { NavigationHeader } from './NavigationHeader';
import { NavigationLink } from './NavigationLink';
import { NavigationFooter } from './NavigationFooter';

interface ModernNavigationProps {
  className?: string;
}

/**
 * Modern Navigation Sidebar Component
 * 
 * Features:
 * - Clean, professional design with refined spacing
 * - Smooth animations and micro-interactions
 * - Smart auto-expansion on hover
 * - Mobile-optimized with overlay behavior
 * - Accessibility-first implementation
 * - Performance optimized with minimal re-renders
 */
export function ModernNavigation({ className }: ModernNavigationProps) {
  const navigationState = useNavigationState({
    defaultExpanded: true,
    persistState: true,
    hoverDelay: 150,
  });

  const {
    isExpanded,
    isMobileOpen,
    isOnMobile,
    toggleExpand,
    closeMobileMenu,
  } = navigationState;

  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus management for mobile
  useEffect(() => {
    if (!isOnMobile || !isMobileOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOnMobile, isMobileOpen, closeMobileMenu]);

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

  // Handle backdrop click to close mobile menu
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      closeMobileMenu();
    }
  };

  const navigationContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <NavigationHeader
        isExpanded={isExpanded}
        onToggleExpand={toggleExpand}
        onMobileMenuClose={closeMobileMenu}
        isMobile={isOnMobile}
      />

      {/* Navigation Items */}
      <nav 
        className="flex-1 overflow-y-auto py-6"
        aria-label="Main navigation"
      >
        <div className="space-y-2 px-4">
          {navigationItems.map((item) => (
            <NavigationLink
              key={item.id}
              item={item}
              isExpanded={isExpanded}
              onNavigate={closeMobileMenu}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <NavigationFooter
        isExpanded={isExpanded}
        isMobile={isOnMobile}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          // Base layout
          'hidden md:flex flex-col fixed left-0 top-0 h-full z-30',
          'bg-white border-r border-surface/60',
          
          // Width and transitions
          'transition-all duration-300 ease-out',
          isExpanded ? 'w-72' : 'w-20',
          
          // Shadow
          'shadow-sm',
          
          className
        )}
        aria-label="Desktop navigation"
      >
        {navigationContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            ref={overlayRef}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in-0"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Mobile Sidebar */}
          <aside
            className={cn(
              // Base layout
              'fixed left-0 top-0 h-full w-80 z-50 md:hidden',
              'bg-white border-r border-surface/60',
              'flex flex-col',
              
              // Animation
              'animate-in slide-in-from-left-full duration-300 ease-out',
              
              className
            )}
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navigationContent}
          </aside>
        </>
      )}
    </>
  );
}