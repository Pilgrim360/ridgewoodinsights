/**
 * QuickActions Component
 * Prominent shortcuts to common admin tasks
 */

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PlusCircle, LayoutList, ExternalLink, LucideIcon } from 'lucide-react';

export interface QuickActionItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary';
}

const DEFAULT_ACTIONS: QuickActionItem[] = [
  {
    id: 'create-post',
    label: 'Create New Post',
    description: 'Start writing your next blog post',
    href: '/admin/posts/new',
    icon: PlusCircle,
    variant: 'primary',
  },
  {
    id: 'view-posts',
    label: 'View All Posts',
    description: 'Manage and edit existing posts',
    href: '/admin/posts',
    icon: LayoutList,
    variant: 'secondary',
  },
  {
    id: 'view-site',
    label: 'View Site',
    description: 'See how your posts look live',
    href: '/',
    icon: ExternalLink,
    variant: 'secondary',
  },
];

export interface QuickActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: QuickActionItem[];
}

export function QuickActions({
  actions = DEFAULT_ACTIONS,
  className,
  ...props
}: QuickActionsProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', className)} {...props}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.id}
            href={action.href}
            className={cn(
              'group rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]',
              action.variant === 'primary'
                ? 'bg-primary text-white border-primary shadow-md hover:bg-primary/95'
                : 'bg-white border-surface text-secondary hover:border-primary/30'
            )}
          >
            <div className="flex flex-col gap-4">
              <div className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
                action.variant === 'primary' ? 'bg-white/20' : 'bg-primary/5 text-primary'
              )}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={cn('font-bold text-lg', action.variant === 'primary' ? 'text-white' : 'text-secondary')}>
                    {action.label}
                  </h3>
                  <div className={cn('text-xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1', action.variant === 'primary' ? 'text-white' : 'text-primary')}>
                    →
                  </div>
                </div>
                <p className={cn('text-sm leading-relaxed', action.variant === 'primary' ? 'text-white/80' : 'text-text/70')}>
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
