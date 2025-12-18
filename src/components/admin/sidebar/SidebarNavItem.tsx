'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import type { NavItem } from './SidebarNav';

interface SidebarNavItemProps {
  item: NavItem;
  isExpanded: boolean;
  isSubmenuExpanded: boolean;
  onToggleSubmenu: () => void;
  isMobile?: boolean;
}

/**
 * SidebarNavItem - Individual navigation item with optional submenu
 * 
 * Features:
 * - Active state detection based on pathname
 * - Expandable submenu with chevron indicator
 * - Hover states and smooth transitions
 * - Tooltip on collapsed state
 * - Badge support for counts (e.g., draft count)
 */
export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isExpanded,
  isSubmenuExpanded,
  onToggleSubmenu,
  isMobile: _isMobile,
}) => {
  const pathname = usePathname();
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  // Determine if this item or any submenu item is active
  const isActive = item.href
    ? pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
    : hasSubmenu && item.submenu?.some((sub) => pathname === sub.href || pathname.startsWith(sub.href));

  // Parent item content
  const ParentContent = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group',
        'relative',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        !isExpanded && 'justify-center'
      )}
      title={!isExpanded ? item.label : undefined}
    >
      {/* Icon */}
      <span className={cn('flex-shrink-0', isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700')}>
        {item.icon}
      </span>

      {/* Label */}
      {isExpanded && (
        <>
          <span className="flex-1 text-sm font-medium truncate">{item.label}</span>

          {/* Badge */}
          {item.badge !== undefined && item.badge > 0 && (
            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
              {item.badge}
            </span>
          )}

          {/* Chevron for submenu */}
          {hasSubmenu && (
            <ChevronRight
              className={cn(
                'flex-shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200',
                isSubmenuExpanded && 'rotate-90'
              )}
            />
          )}
        </>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
      )}
    </div>
  );

  // If item has no submenu, render as link
  if (!hasSubmenu && item.href) {
    return (
      <Link href={item.href} className="block">
        {ParentContent}
      </Link>
    );
  }

  // If item has submenu, render as button
  return (
    <div>
      <button onClick={onToggleSubmenu} className="w-full text-left">
        {ParentContent}
      </button>

      {/* Submenu */}
      {hasSubmenu && isExpanded && isSubmenuExpanded && (
        <div className="mt-1 ml-3 pl-6 border-l-2 border-gray-200 space-y-1">
          {item.submenu?.map((subItem) => {
            const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href);

            return (
              <Link key={subItem.id} href={subItem.href} className="block">
                <div
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200',
                    isSubActive
                      ? 'bg-primary/5 text-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {/* Sub-item Icon (optional) */}
                  {subItem.icon && (
                    <span
                      className={cn(
                        'flex-shrink-0',
                        isSubActive ? 'text-primary' : 'text-gray-400'
                      )}
                    >
                      {subItem.icon}
                    </span>
                  )}

                  {/* Sub-item Label */}
                  <span className="flex-1 text-sm truncate">{subItem.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
