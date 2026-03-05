'use client';

import React from 'react';
import { Menu, Plus, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();

  // Basic breadcrumb logic
  const segments = pathname.split('/').filter(Boolean).slice(1); // skip 'admin'

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white border-b border-surface sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 text-text/60 hover:text-secondary hover:bg-surface rounded-md transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm font-medium" aria-label="Breadcrumb">
          <Link
            href="/admin"
            className="text-text/50 hover:text-secondary transition-colors"
          >
            Admin
          </Link>
          {segments.map((segment, index) => (
            <React.Fragment key={segment}>
              <ChevronRight className="w-4 h-4 mx-1.5 text-text/30" />
              <span className={cn(
                "capitalize",
                index === segments.length - 1 ? "text-secondary font-bold" : "text-text/50"
              )}>
                {segment.replace(/-/g, ' ')}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-text/60 hover:text-secondary transition-colors border border-transparent hover:border-surface rounded-md"
        >
          <Globe className="w-3.5 h-3.5" />
          View Site
        </Link>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary-dark transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>
    </header>
  );
}
