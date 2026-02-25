/**
 * ActivityFeed Component
 * Displays recent post activity (published, drafted, updated)
 */

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Edit3, RefreshCcw } from 'lucide-react';
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
    post_published: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
    post_drafted: <Edit3 className="h-4 w-4" aria-hidden="true" />,
    post_updated: <RefreshCcw className="h-4 w-4" aria-hidden="true" />,
  };

  const colors = {
    post_published: 'text-emerald-700 bg-emerald-100',
    post_drafted: 'text-sky-700 bg-sky-100',
    post_updated: 'text-amber-700 bg-amber-100',
  };

  return (
    <div
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        colors[type]
      )}
    >
      {icons[type]}
    </div>
  );
}

function ActivityLabel({ type }: { type: RecentActivity['type'] }) {
  const labels = {
    post_published: 'Published',
    post_drafted: 'Draft saved',
    post_updated: 'Updated',
  };

  return (
    <span className="inline-flex rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
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
      <section className={cn('rounded-xl border border-surface bg-white p-6', className)} {...props}>
        <h3 className="text-base font-semibold text-secondary">Recent activity</h3>
        <div className="mt-4 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex animate-pulse items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-surface" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 rounded bg-surface" />
                <div className="h-3 w-1/4 rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isEmpty || activities.length === 0) {
    return (
      <section className={cn('rounded-xl border border-surface bg-white p-6', className)} {...props}>
        <h3 className="text-base font-semibold text-secondary">Recent activity</h3>
        <p className="py-8 text-center text-sm text-text">
          No recent activity yet. Publish your first post to start building momentum.
        </p>
      </section>
    );
  }

  return (
    <section className={cn('rounded-xl border border-surface bg-white', className)} {...props}>
      <div className="flex items-center justify-between border-b border-surface p-5">
        <h3 className="text-base font-semibold text-secondary">Recent activity</h3>
        <Link
          href="/admin/posts"
          className="text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          View all posts
        </Link>
      </div>

      <div className="divide-y divide-surface">
        {activities.map((activity) => (
          <Link
            key={activity.id}
            href={`/admin/posts/${activity.post_id}`}
            className="group flex items-start gap-3 p-4 transition-colors hover:bg-background"
          >
            <ActivityIcon type={activity.type} />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <ActivityLabel type={activity.type} />
                <span className="text-xs text-text/70">{formatRelativeTime(activity.created_at)}</span>
              </div>
              <p className="mt-2 truncate text-sm font-medium text-secondary">{activity.post_title}</p>
            </div>

            <ArrowRight
              className="mt-1 h-4 w-4 shrink-0 text-text/60 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
