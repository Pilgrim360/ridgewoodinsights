'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const navLinkVariants = cva(
  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:bg-muted hover:text-foreground',
        active: 'bg-primary text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface AdminNavLinkProps extends VariantProps<typeof navLinkVariants> {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onClick?: () => void;
}

export function AdminNavLink({
  href,
  icon,
  children,
  isExpanded,
  onClick,
}: AdminNavLinkProps) {
  const pathname = usePathname();
  // Dashboard link should only be active on the exact path
  // Other links should be active if the path starts with the href
  const isActive =
    href === '/admin'
      ? pathname === href
      : pathname.startsWith(href) && href.length > '/admin'.length;

  return (
    <Link
      href={href}
      className={cn(navLinkVariants({ variant: isActive ? 'active' : 'default' }))}
      onClick={onClick}
    >
      {icon}
      <span
        className={cn(
          'overflow-hidden transition-all duration-300',
          isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
        )}
      >
        {children}
      </span>
    </Link>
  );
}
