'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_NAME } from '@/constants';
import { Button } from '../ui/Button';

export interface NavLink {
  href: string;
  label: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Remove pathname-based auto-close for now to fix immediate flicker
  // The menu should only close when user explicitly clicks a link, backdrop, or close button

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-secondary/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
      >
        <div className="flex h-20 items-center justify-between border-b border-surface px-6">
          <span className="text-xl font-bold text-primary">{SITE_NAME}</span>
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-secondary hover:bg-background hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="px-6 py-8" aria-label="Mobile navigation">
          <ul className="space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary translate-x-2'
                        : 'text-secondary hover:bg-background hover:text-primary hover:translate-x-2'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 pt-8 border-t border-surface">
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                window.location.href = '/contact';
                onClose();
              }}
            >
              Get Started
            </Button>
          </div>
        </nav>
      </div>
    </div>,
    document.body
  );
}
