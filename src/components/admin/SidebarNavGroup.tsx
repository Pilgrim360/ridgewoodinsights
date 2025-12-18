'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavGroup } from '@/types/admin';
import { SidebarNavItem } from './SidebarNavItem';
import { ChevronDown } from 'lucide-react';

interface SidebarNavGroupProps {
  group: NavGroup;
  isExpanded: boolean;
  isGroupExpanded: boolean;
  onToggleGroup: () => void;
  onItemClick?: () => void;
}

/**
 * SidebarNavGroup - Expandable submenu group
 * 
 * Features:
 * - Main item is clickable link (routes to first item)
 * - Chevron button toggles submenu expansion
 * - Collapsible submenu with smooth height transition
 * - Active state detection for parent and children
 * - Nested item indentation
 * - Tooltip on hover when sidebar collapsed
 */
export const SidebarNavGroup = React.forwardRef<HTMLDivElement, SidebarNavGroupProps>(
  ({ group, isExpanded, isGroupExpanded, onToggleGroup, onItemClick }, ref) => {
    const pathname = usePathname();

    // Check if any child item is active
    const hasActiveChild = group.items.some((item) =>
      pathname.startsWith(item.href)
    );

    // Main route is the first item in the group (All Posts)
    const mainHref = group.items[0]?.href || '/admin';

    return (
      <div ref={ref} className="space-y-1">
        {/* Group Header - Clickable link with chevron button */}
        <div className="relative flex items-center gap-0">
          {/* Main clickable area - Link to first item */}
          <Link
            href={mainHref}
            onClick={onItemClick}
            className={cn(
              'flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
              'hover:bg-surface/50 group',
              hasActiveChild && 'bg-primary/5',
              !isExpanded && 'justify-center'
            )}
            title={!isExpanded ? group.label : undefined}
          >
            {/* Icon */}
            <span
              className={cn(
                'flex-shrink-0 flex items-center justify-center',
                hasActiveChild ? 'text-primary' : 'text-secondary'
              )}
            >
              {group.icon}
            </span>

            {/* Label - visible when expanded */}
            {isExpanded && (
              <span
                className={cn(
                  'flex-1 text-left text-sm font-medium whitespace-nowrap',
                  hasActiveChild ? 'text-primary' : 'text-secondary'
                )}
              >
                {group.label}
              </span>
            )}

            {/* Tooltip for collapsed state */}
            {!isExpanded && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-secondary text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                {group.label}
              </span>
            )}
          </Link>

          {/* Chevron toggle button - only visible when expanded */}
          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleGroup();
              }}
              className={cn(
                'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200',
                'hover:bg-surface/50 mr-1',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              )}
              aria-expanded={isGroupExpanded}
              aria-controls={`submenu-${group.id}`}
              aria-label={isGroupExpanded ? 'Collapse submenu' : 'Expand submenu'}
            >
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  hasActiveChild ? 'text-primary' : 'text-secondary',
                  isGroupExpanded && 'rotate-180'
                )}
              />
            </button>
          )}
        </div>

        {/* Submenu Items - visible when expanded and group is open */}
        {isExpanded && isGroupExpanded && (
          <div
            id={`submenu-${group.id}`}
            className="space-y-1 overflow-hidden animate-in slide-in-from-top-2 duration-200"
          >
            {group.items.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isExpanded={isExpanded}
                isNested={true}
                onClick={onItemClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

SidebarNavGroup.displayName = 'SidebarNavGroup';