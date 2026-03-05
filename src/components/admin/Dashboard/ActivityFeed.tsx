'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowUpRight, Clock } from 'lucide-react';
import { RecentActivity } from '@/types/admin';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  activities: RecentActivity[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

export function ActivityFeed({ activities, isLoading, isEmpty }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-background animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="py-12 text-center border border-dashed border-surface rounded-lg">
        <p className="text-sm text-text/40">No recent activity found.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface">
      {activities.map((activity) => (
        <div key={activity.id} className="group py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-background group-hover:bg-primary/5 transition-colors">
              <FileText className="w-4 h-4 text-text/40 group-hover:text-primary transition-colors" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-secondary truncate">
                {activity.post_title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded",
                  activity.type === 'post_published' ? "bg-green-50 text-green-700" :
                  activity.type === 'post_drafted' ? "bg-amber-50 text-amber-700" :
                  "bg-blue-50 text-blue-700"
                )}>
                  {activity.type.replace('post_', '')}
                </span>
                <span className="text-xs text-text/40 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <Link
            href={`/admin/posts/${activity.post_id}`}
            className="shrink-0 p-2 text-text/30 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
            title="Edit Post"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      ))}
    </div>
  );
}
