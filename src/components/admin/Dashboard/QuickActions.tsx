/**
 * QuickActions Component
 * Prominent shortcuts to common admin tasks
 */

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Eye,
  FileText,
  FolderTree,
  Image as ImageIcon,
  PenSquare,
  Settings,
} from 'lucide-react';
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

const iconClass = 'h-5 w-5';

const DEFAULT_ACTIONS: QuickActionItem[] = [
  {
    id: 'create-post',
    label: 'Create New Post',
    description: 'Start writing your next blog post',
    href: '/admin/posts/new',
    icon: <PenSquare className={iconClass} aria-hidden="true" />,
    variant: 'primary',
  },
  {
    id: 'view-posts',
    label: 'View All Posts',
    description: 'Manage and edit existing posts',
    href: '/admin/posts',
    icon: <FileText className={iconClass} aria-hidden="true" />,
    variant: 'secondary',
  },
  {
    id: 'manage-categories',
    label: 'Manage Categories',
    description: 'Organize content taxonomy',
    href: '/admin/categories',
    icon: <FolderTree className={iconClass} aria-hidden="true" />,
    variant: 'secondary',
  },
  {
    id: 'media-library',
    label: 'Media Library',
    description: 'Upload and reuse images',
    href: '/admin/media',
    icon: <ImageIcon className={iconClass} aria-hidden="true" />,
    variant: 'secondary',
  },
  {
    id: 'settings',
    label: 'Site Settings',
    description: 'Update site details and defaults',
    href: '/admin/settings',
    icon: <Settings className={iconClass} aria-hidden="true" />,
    variant: 'secondary',
  },
  {
    id: 'view-site',
    label: 'Preview Live Site',
    description: 'Check your public-facing blog',
    href: '/',
    icon: <Eye className={iconClass} aria-hidden="true" />,
    variant: 'secondary',
  },
];

export function QuickActions({
  actions = DEFAULT_ACTIONS,
  className,
  ...props
}: QuickActionsProps) {
  return (
    <div
      className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3', className)}
      {...props}
    >
      {actions.map((action) => (
        <Link
          key={action.id}
          href={action.href}
          className={cn(
            'group rounded-xl border p-4 transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            action.variant === 'primary'
              ? 'border-primary bg-primary text-white shadow-sm hover:bg-primary/90'
              : 'border-surface bg-white text-secondary hover:border-primary/40 hover:shadow-sm'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg',
                action.variant === 'primary'
                  ? 'bg-white/15 text-white'
                  : 'bg-background text-primary group-hover:bg-primary/10'
              )}
            >
              {action.icon}
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  'text-sm font-semibold',
                  action.variant === 'primary' ? 'text-white' : 'text-secondary'
                )}
              >
                {action.label}
              </h3>
              <p
                className={cn(
                  'mt-1 text-sm leading-snug',
                  action.variant === 'primary' ? 'text-white/80' : 'text-text/80'
                )}
              >
                {action.description}
              </p>
            </div>

            <ArrowRight
              className={cn(
                'h-4 w-4 shrink-0 transition-transform',
                action.variant === 'primary' ? 'text-white/80' : 'text-text/70',
                'group-hover:translate-x-0.5'
              )}
              aria-hidden="true"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
