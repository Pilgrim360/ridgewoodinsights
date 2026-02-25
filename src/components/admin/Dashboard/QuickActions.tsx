import React from 'react';
import Link from 'next/link';
import { PenLine, LayoutList, Globe, ArrowRight } from 'lucide-react';
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
    icon: <PenLine className="w-5 h-5" />,
    variant: 'primary',
  },
  {
    id: 'view-posts',
    label: 'View All Posts',
    description: 'Manage and edit existing posts',
    href: '/admin/posts',
    icon: <LayoutList className="w-5 h-5" />,
    variant: 'secondary',
  },
  {
    id: 'view-site',
    label: 'View Site',
    description: 'See how your posts look live',
    href: '/',
    icon: <Globe className="w-5 h-5" />,
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
            'rounded-xl p-5 border transition-all duration-200',
            'group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            action.variant === 'primary'
              ? 'bg-primary text-white border-primary hover:bg-primary-dark shadow-sm hover:shadow-md'
              : 'bg-white border-surface hover:border-primary/30 hover:shadow-md'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div
                className={cn(
                  'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center',
                  action.variant === 'primary'
                    ? 'bg-white/20 text-white'
                    : 'bg-primary/10 text-primary'
                )}
              >
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    'font-semibold text-sm mb-0.5',
                    action.variant === 'primary' ? 'text-white' : 'text-secondary'
                  )}
                >
                  {action.label}
                </h3>
                <p
                  className={cn(
                    'text-xs',
                    action.variant === 'primary' ? 'text-white/75' : 'text-text/60'
                  )}
                >
                  {action.description}
                </p>
              </div>
            </div>
            <ArrowRight
              className={cn(
                'w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:translate-x-0.5',
                action.variant === 'primary' ? 'text-white/60' : 'text-text/30'
              )}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
