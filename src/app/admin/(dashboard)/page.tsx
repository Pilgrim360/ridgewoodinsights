'use client';

import React from 'react';
import { StatsCard } from '@/components/admin/Dashboard/StatsCard';
import { ActivityFeed } from '@/components/admin/Dashboard/ActivityFeed';
import { ScheduledPosts } from '@/components/admin/Dashboard/ScheduledPosts';
import { WelcomeSection } from '@/components/admin/Dashboard/WelcomeSection';
import { usePostStats, useRecentActivity } from '@/hooks/queries/usePostsQueries';

export default function AdminDashboard() {
  const statsQuery = usePostStats();
  const activityQuery = useRecentActivity(5);

  const stats = statsQuery.data;
  const activities = activityQuery.data ?? [];

  return (
    <div className="space-y-6">
      <WelcomeSection />

      {/* Stats */}
      <section>
        {statsQuery.isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-surface rounded-lg p-4 animate-pulse"
              >
                <div className="h-3 bg-surface rounded w-20 mb-2" />
                <div className="h-6 bg-surface rounded w-12" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard label="Total Posts" value={stats.total_posts} />
            <StatsCard label="Published" value={stats.published_count} />
            <StatsCard label="Drafts" value={stats.draft_count} />
            <StatsCard label="Scheduled" value={stats.scheduled_count} />
          </div>
        ) : null}
      </section>

      {/* Activity and Scheduled */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed
            activities={activities}
            isLoading={activityQuery.isLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <ScheduledPosts />
        </div>
      </section>
    </div>
  );
}
