'use client';

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

const ACTIVITY_LABELS = {
  post_published: 'Published',
  post_drafted: 'Drafted',
  post_updated: 'Updated',
} as const;

export function ActivityFeed({
  activities,
  isLoading = false,
  isEmpty = false,
  className,
  ...props
}: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)} {...props}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-2">
            <div className="h-4 bg-zinc-100 rounded w-3/4" />
            <div className="h-3 bg-zinc-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty || activities.length === 0) {
    return (
      <div className={cn('text-sm text-zinc-400 italic', className)} {...props}>
        No recent activity found.
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)} {...props}>
      {activities.map((activity) => (
        <div key={activity.id} className="group relative">
          <Link
            href={`/admin/posts/${activity.post_id}`}
            className="flex flex-col gap-1 hover:no-underline"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-900 tracking-tight group-hover:underline">
                {activity.post_title}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
              <span>{ACTIVITY_LABELS[activity.type]}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200" />
              <span>{formatRelativeTime(activity.created_at)}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
