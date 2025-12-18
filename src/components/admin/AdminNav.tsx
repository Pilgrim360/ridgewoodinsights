'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Tags,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AdminNavLink } from './AdminNavLink';
import { AdminNavFooter } from './AdminNavFooter';
import { cn } from '@/lib/utils';

interface AdminNavProps {
  isExpanded: boolean;
  isMobileOpen: boolean;
  toggleExpand: () => void;
  closeMobileMenu: () => void;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/admin/posts', label: 'Posts', icon: <FileText className="h-5 w-5" /> },
  { href: '/admin/categories', label: 'Categories', icon: <Tags className="h-5 w-5" /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export function AdminNav({
  isExpanded,
  isMobileOpen,
  toggleExpand,
  closeMobileMenu,
}: AdminNavProps) {
  const mobileNavRef = useRef<HTMLElement>(null);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMobileOpen || !mobileNavRef.current) return;

    const focusableElements = mobileNavRef.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen]);

  const Brand = () => (
    <div className="flex h-16 items-center justify-center border-b border-surface">
      <Link href="/admin">
        <span className="text-xl font-semibold">Ridgewood</span>
      </Link>
    </div>
  );

  const NavLinks = () => (
    <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
      {navItems.map((item) => (
        <AdminNavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          isExpanded={isExpanded}
          onClick={isMobileOpen ? closeMobileMenu : undefined}
        >
          {item.label}
        </AdminNavLink>
      ))}
    </nav>
  );

  const ToggleButton = () => (
    <div className="border-t border-surface p-4">
      <button
        onClick={toggleExpand}
        className="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted"
      >
        {isExpanded ? (
          <ChevronLeft className="h-6 w-6" />
        ) : (
          <ChevronRight className="h-6 w-6" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          'hidden h-screen flex-col border-r border-surface bg-white transition-all duration-300 ease-in-out md:flex',
          isExpanded ? 'w-60' : 'w-20'
        )}
      >
        <Brand />
        <NavLinks />
        <AdminNavFooter isExpanded={isExpanded} />
        <ToggleButton />
      </aside>

      {/* Mobile */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <aside
            ref={mobileNavRef}
            className="fixed top-0 left-0 z-50 flex h-screen w-60 flex-col border-r border-surface bg-white md:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-nav-title"
          >
            <h2 id="mobile-nav-title" className="sr-only">
              Main Navigation
            </h2>
            <Brand />
            <NavLinks />
            <AdminNavFooter isExpanded={true} />
          </aside>
        </>
      )}
    </>
  );
}
