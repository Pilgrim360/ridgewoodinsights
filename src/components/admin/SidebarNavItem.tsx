'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/constants/admin-nav';

interface SidebarNavItemProps {
  item: NavItem;
  isExpanded: boolean;
  onLinkClick?: () => void;
}

export function SidebarNavItem({
  item,
  isExpanded,
  onLinkClick,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(
    item.children?.some((child) => pathname.startsWith(child.href)) ?? false
  );

  const isActive = item.children
    ? pathname.startsWith(item.href)
    : pathname === item.href;

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.children) {
      e.preventDefault();
      setIsSubMenuOpen(!isSubMenuOpen);
    } else if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <>
      <Link
        href={item.href}
        onClick={handleItemClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'hover:bg-slate-100',
          isActive
            ? 'text-slate-900 bg-slate-100'
            : 'text-slate-600 hover:text-slate-900',
          !isExpanded && 'justify-center'
        )}
      >
        <item.icon className="h-5 w-5" />
        <span className={cn('flex-1', !isExpanded && 'hidden')}>
          {item.label}
        </span>
        {item.children && isExpanded && (
          <ChevronDown
            className={cn(
              'h-4 w-4 transform transition-transform duration-200',
              isSubMenuOpen && 'rotate-180'
            )}
          />
        )}
      </Link>
      {isSubMenuOpen && item.children && isExpanded && (
        <ul className="pl-6 pt-2 space-y-1">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onLinkClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  'hover:bg-slate-100',
                  pathname === child.href
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
