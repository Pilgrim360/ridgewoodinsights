'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, CheckCircle, Edit3 } from 'lucide-react';
import { RecentActivity } from '@/types/admin';

interface ActivityFeedProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const activityIcons = {
  post_published: CheckCircle,
  post_drafted: FileText,
  post_updated: Edit3,
};

const activityLabels = {
  post_published: 'Published',
  post_drafted: 'Drafted',
  post_updated: 'Updated',
};

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-surface">
        <div className="px-4 py-3 border-b border-surface">
          <h3 className="font-medium text-secondary">Recent Activity</h3>
        </div>
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-surface" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-surface rounded w-20" />
                <div className="h-3 bg-surface rounded w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-surface">
      <div className="px-4 py-3 border-b border-surface">
        <h3 className="font-medium text-secondary">Recent Activity</h3>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-text/60">No recent activity</p>
        </div>
      ) : (
        <div className="divide-y divide-surface">
          {activities.slice(0, 5).map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <Link
                key={activity.id}
                href={`/admin/posts/${activity.post_id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-primary font-medium">
                    {activityLabels[activity.type]}
                  </p>
                  <p className="text-sm text-secondary truncate">
                    {activity.post_title}
                  </p>
                </div>
                <span className="text-xs text-text/40 flex-shrink-0">
                  {formatDate(activity.created_at)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
