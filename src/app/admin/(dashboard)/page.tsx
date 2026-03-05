'use client';

import React from 'react';
import { StatsCard } from '@/components/admin/Dashboard/StatsCard';
import { ActivityFeed } from '@/components/admin/Dashboard/ActivityFeed';
import { ScheduledPosts } from '@/components/admin/Dashboard/ScheduledPosts';
import { usePostStats, useRecentActivity } from '@/hooks/queries/usePostsQueries';

export default function AdminDashboard() {
  const statsQuery = usePostStats();
  const activityQuery = useRecentActivity(10);

  const stats = statsQuery.data ?? null;
  const activities = activityQuery.data ?? [];

  return (
    <div className="space-y-16">
      {/* Overview Section */}
      <section aria-label="Insights">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-10">
          Insights
        </h2>

        {statsQuery.isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="h-3 bg-zinc-100 rounded w-1/2" />
                <div className="h-8 bg-zinc-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <StatsCard label="Total Posts" value={stats.total_posts} />
            <StatsCard label="Published" value={stats.published_count} />
            <StatsCard label="Drafts" value={stats.draft_count} />
            <StatsCard label="Scheduled" value={stats.scheduled_count} />
          </div>
        ) : null}
      </section>

      {/* Activity and Updates Section */}
      <section aria-label="Recent activity and upcoming content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-10">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Recent Activity
            </h3>
            <ActivityFeed
              activities={activities}
              isLoading={activityQuery.isLoading}
              isEmpty={!activityQuery.isLoading && activities.length === 0}
            />
          </div>

          <div className="space-y-10">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Upcoming
            </h3>
            <ScheduledPosts />
          </div>
        </div>
      </section>
    </div>
  );
}
