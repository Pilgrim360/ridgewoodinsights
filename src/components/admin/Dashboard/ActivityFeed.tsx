/**
 * ActivityFeed Component
 * Displays recent post activity (published, drafted, updated)
 */

import React from 'react';
import Link from 'next/link';
import { RecentActivity } from '@/types/admin';
import { formatRelativeTime } from '@/lib/admin/dates';
import { cn } from '@/lib/utils';
import { CheckCircle, FileEdit, RefreshCw, ArrowRight } from 'lucide-react';

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  activities: RecentActivity[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

function ActivityIcon({ type }: { type: RecentActivity['type'] }) {
  const icons = {
    post_published: CheckCircle,
    post_drafted: FileEdit,
    post_updated: RefreshCw,
  };

  const colors = {
    post_published: 'text-green-600 bg-green-50',
    post_drafted: 'text-blue-600 bg-blue-50',
    post_updated: 'text-amber-600 bg-amber-50',
  };

  const Icon = icons[type];

  return (
    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110', colors[type])}>
      <Icon className="w-5 h-5" />
    </div>
  );
}

function StatusBadge({ type }: { type: RecentActivity['type'] }) {
  const labels = {
    post_published: 'Published',
    post_drafted: 'Draft',
    post_updated: 'Updated',
  };

  const styles = {
    post_published: 'bg-green-50 text-green-700 border-green-100',
    post_drafted: 'bg-blue-50 text-blue-700 border-blue-100',
    post_updated: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  return (
    <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border', styles[type])}>
      {labels[type]}
    </span>
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
      <div className={cn('rounded-xl border border-surface bg-white p-6 shadow-sm', className)} {...props}>
        <div className="h-6 bg-surface rounded w-1/4 mb-6 animate-pulse" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface" />
              <div className="flex-1">
                <div className="h-4 bg-surface rounded w-3/4 mb-2" />
                <div className="h-3 bg-surface rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty || activities.length === 0) {
    return (
      <div className={cn('rounded-xl border border-surface bg-white p-6 shadow-sm', className)} {...props}>
        <h3 className="text-lg font-semibold text-secondary mb-4">Recent Activity</h3>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-text/60">No recent activity found. Start by creating a post!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-surface bg-white overflow-hidden shadow-sm', className)} {...props}>
      <div className="px-6 py-5 border-b border-surface flex items-center justify-between bg-white">
        <h3 className="text-lg font-semibold text-secondary">Recent Activity</h3>
        <Link href="/admin/posts" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      <div className="divide-y divide-surface">
        {activities.map((activity) => (
          <Link
            key={activity.id}
            href={`/admin/posts/${activity.post_id}`}
            className="group p-4 sm:px-6 flex items-center gap-4 hover:bg-background transition-all duration-200"
          >
            {/* Activity Icon */}
            <ActivityIcon type={activity.type} />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge type={activity.type} />
                <span className="text-xs text-text/40">•</span>
                <span className="text-xs text-text/50 font-medium">{formatRelativeTime(activity.created_at)}</span>
              </div>
              <p className="text-sm font-semibold text-secondary truncate group-hover:text-primary transition-colors">
                {activity.post_title}
              </p>
            </div>

            {/* Arrow */}
            <div className="w-8 h-8 rounded-full border border-surface flex items-center justify-center text-text/30 group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
