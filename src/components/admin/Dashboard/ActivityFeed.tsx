import React from 'react';
import Link from 'next/link';
import { CheckCircle2, FileEdit, RefreshCw, ChevronRight } from 'lucide-react';
import { RecentActivity } from '@/types/admin';
import { formatRelativeTime } from '@/lib/admin/dates';
import { cn } from '@/lib/utils';

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  activities: RecentActivity[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

const ACTIVITY_CONFIG = {
  post_published: {
    Icon: CheckCircle2,
    iconClass: 'text-green-600',
    bgClass: 'bg-green-50',
    label: 'Published',
    labelClass: 'text-green-700',
  },
  post_drafted: {
    Icon: FileEdit,
    iconClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    label: 'Drafted',
    labelClass: 'text-blue-700',
  },
  post_updated: {
    Icon: RefreshCw,
    iconClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
    label: 'Updated',
    labelClass: 'text-amber-700',
  },
} as const;

function ActivityIcon({ type }: { type: RecentActivity['type'] }) {
  const config = ACTIVITY_CONFIG[type];
  const { Icon, iconClass, bgClass } = config;

  return (
    <div
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        bgClass
      )}
    >
      <Icon className={cn('w-4 h-4', iconClass)} />
    </div>
  );
}

export function ActivityFeed({
  activities,
  isLoading = false,
  isEmpty = false,
  className,
  ...props
}: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className={cn('rounded-xl border border-surface bg-white', className)} {...props}>
        <div className="px-6 py-4 border-b border-surface">
          <h3 className="text-base font-semibold text-secondary">Recent Activity</h3>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-surface rounded w-1/4" />
                <div className="h-4 bg-surface rounded w-3/4" />
              </div>
              <div className="h-3 bg-surface rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty || activities.length === 0) {
    return (
      <div className={cn('rounded-xl border border-surface bg-white', className)} {...props}>
        <div className="px-6 py-4 border-b border-surface">
          <h3 className="text-base font-semibold text-secondary">Recent Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-3">
            <FileEdit className="w-5 h-5 text-text/40" />
          </div>
          <p className="text-sm font-medium text-secondary mb-1">No activity yet</p>
          <p className="text-xs text-text/60">
            Create your first post to start seeing activity here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-surface bg-white overflow-hidden', className)} {...props}>
      <div className="px-6 py-4 border-b border-surface flex items-center justify-between">
        <h3 className="text-base font-semibold text-secondary">Recent Activity</h3>
        <Link
          href="/admin/posts"
          className="text-xs font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
        >
          View all posts
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-surface">
        {activities.map((activity) => {
          const config = ACTIVITY_CONFIG[activity.type];
          return (
            <Link
              key={activity.id}
              href={`/admin/posts/${activity.post_id}`}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-background transition-colors group"
            >
              <ActivityIcon type={activity.type} />

              <div className="flex-1 min-w-0">
                <span
                  className={cn(
                    'text-xs font-semibold uppercase tracking-wide',
                    config.labelClass
                  )}
                >
                  {config.label}
                </span>
                <p className="text-sm font-medium text-secondary truncate mt-0.5">
                  {activity.post_title}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-text/50">
                  {formatRelativeTime(activity.created_at)}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-text/30 group-hover:text-text/60 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
