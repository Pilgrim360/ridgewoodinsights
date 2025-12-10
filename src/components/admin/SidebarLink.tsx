'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
  onClick?: () => void;
}

/**
 * SidebarLink - Navigation link item with active state styling
 * Shows icon-only when collapsed, full label when expanded
 * Active state: primary bg + white text
 * Inactive: secondary text + hover surface bg
 */
export const SidebarLink = React.forwardRef<HTMLAnchorElement, SidebarLinkProps>(
  ({ href, icon, label, isExpanded, onClick }, ref) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href) && (href === '/admin' ? pathname === '/admin' : true);

    return (
      <Link
        ref={ref}
        href={href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200',
          'hover:no-underline',
          isActive
            ? 'bg-primary text-white'
            : 'text-secondary hover:bg-surface'
        )}
        title={!isExpanded ? label : undefined}
      >
        {/* Icon - Always visible */}
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          {icon}
        </span>

        {/* Label - Only visible when expanded */}
        {isExpanded && (
          <span className="flex-1 whitespace-nowrap text-sm font-medium">
            {label}
          </span>
        )}
      </Link>
    );
  }
);

SidebarLink.displayName = 'SidebarLink';
