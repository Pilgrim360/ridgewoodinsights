/**
 * QuickActions Component
 * Prominent shortcuts to common admin tasks
 */

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface QuickActionItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export interface QuickActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: QuickActionItem[];
}

const DEFAULT_ACTIONS: QuickActionItem[] = [
  {
    id: 'create-post',
    label: 'Create New Post',
    description: 'Start writing your next blog post',
    href: '/admin/posts/new',
    icon: '✏️',
    variant: 'primary',
  },
  {
    id: 'view-posts',
    label: 'View All Posts',
    description: 'Manage and edit existing posts',
    href: '/admin/posts',
    icon: '📄',
    variant: 'secondary',
  },
  {
    id: 'view-site',
    label: 'View Site',
    description: 'See how your posts look live',
    href: '/',
    icon: '🌐',
    variant: 'secondary',
  },
];

export function QuickActions({
  actions = DEFAULT_ACTIONS,
  className,
  ...props
}: QuickActionsProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)} {...props}>
      {actions.map((action) => (
        <Link
          key={action.id}
          href={action.href}
          className={cn(
            'rounded-lg p-6 border transition-all duration-200 hover:shadow-md',
            action.variant === 'primary'
              ? 'bg-primary text-white border-primary hover:bg-primary/90 shadow-sm'
              : 'bg-white border-surface text-secondary hover:border-primary hover:text-primary'
          )}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="text-3xl flex-shrink-0">{action.icon}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={cn('font-semibold text-base mb-1', action.variant === 'primary' ? 'text-white' : 'text-secondary')}>
                {action.label}
              </h3>
              <p className={cn('text-sm', action.variant === 'primary' ? 'text-white/80' : 'text-text/70')}>
                {action.description}
              </p>
            </div>

            {/* Arrow */}
            <div className="text-xl flex-shrink-0 opacity-60">→</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
