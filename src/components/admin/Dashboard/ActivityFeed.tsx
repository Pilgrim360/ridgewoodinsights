/**
 * ActivityFeed Component
 * Displays recent post activity (published, drafted, updated)
 */

import React from 'react';
import Link from 'next/link';
import { RecentActivity } from '@/types/admin';
import { formatRelativeTime } from '@/lib/admin/dates';
import { cn } from '@/lib/utils';

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  activities: RecentActivity[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

function ActivityIcon({ type }: { type: RecentActivity['type'] }) {
  const icons = {
    post_published: '✓',
    post_drafted: '✎',
    post_updated: '↻',
  };

  const colors = {
    post_published: 'text-green-600 bg-green-100',
    post_drafted: 'text-blue-600 bg-blue-100',
    post_updated: 'text-yellow-600 bg-yellow-100',
  };

  return (
    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold', colors[type])}>
      {icons[type]}
    </div>
  );
}

function ActivityLabel({ type }: { type: RecentActivity['type'] }) {
  const labels = {
    post_published: 'Published',
    post_drafted: 'Drafted',
    post_updated: 'Updated',
  };

  return <span className="text-xs font-semibold uppercase text-secondary">{labels[type]}</span>;
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
      <div className={cn('rounded-lg border border-surface bg-white p-6', className)} {...props}>
        <h3 className="text-lg font-semibold text-secondary mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface" />
              <div className="flex-1">
                <div className="h-4 bg-surface rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty || activities.length === 0) {
    return (
      <div className={cn('rounded-lg border border-surface bg-white p-6', className)} {...props}>
        <h3 className="text-lg font-semibold text-secondary mb-4">Recent Activity</h3>
        <p className="text-center text-text py-8">No recent activity. Create your first post to get started.</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg border border-surface bg-white overflow-hidden', className)} {...props}>
      <div className="p-6 border-b border-surface">
        <h3 className="text-lg font-semibold text-secondary">Recent Activity</h3>
      </div>

      <div className="divide-y divide-surface">
        {activities.map((activity) => (
          <Link
            key={activity.id}
            href={`/admin/posts/${activity.post_id}`}
            className="p-4 flex items-center gap-4 hover:bg-background transition-colors"
          >
            {/* Activity Icon */}
            <ActivityIcon type={activity.type} />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <ActivityLabel type={activity.type} />
              </div>
              <p className="text-sm font-medium text-text truncate">{activity.post_title}</p>
              <p className="text-xs text-text/60 mt-1">{formatRelativeTime(activity.created_at)}</p>
            </div>

            {/* Arrow */}
            <div className="text-surface flex-shrink-0">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
