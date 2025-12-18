'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';
import { type SidebarState } from '@/hooks/useSidebarState';

interface SidebarProps {
  state: SidebarState;
}

export function Sidebar({ state }: SidebarProps) {
  const { isExpanded, isMobileOpen, toggleExpand, closeMobileMenu } = state;
  const focusTrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileOpen || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusableElements = focusTrapRef.current?.querySelectorAll(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement =
        focusableElements[focusableElements.length - 1] as HTMLElement;
      const activeElement = document.activeElement;

      if (e.shiftKey) {
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, closeMobileMenu]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-full bg-white border-r border-slate-200 shadow-sm',
          'transition-all duration-300 ease-in-out',
          isExpanded ? 'w-64' : 'w-20'
        )}
      >
        <SidebarHeader isExpanded={isExpanded} />
        <SidebarNav isExpanded={isExpanded} />
        <SidebarFooter isExpanded={isExpanded} onToggleExpand={toggleExpand} />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <aside
            ref={focusTrapRef}
            className={cn(
              'fixed top-0 left-0 h-screen w-64 bg-white z-50 md:hidden',
              'flex flex-col shadow-lg',
              'animate-in slide-in-from-left-full duration-300'
            )}
          >
            <SidebarHeader isExpanded={true} onToggleExpand={closeMobileMenu} />
            <SidebarNav isExpanded={true} onLinkClick={closeMobileMenu} />
            <SidebarFooter isExpanded={true} />
          </aside>
        </>
      )}
    </>
  );
}
