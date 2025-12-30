/**
 * Admin Dashboard - Step 3
 * Displays quick stats, recent activity, and quick action shortcuts
 */

'use client';

import React from 'react';
import { StatsCard } from '@/components/admin/Dashboard/StatsCard';
import { ActivityFeed } from '@/components/admin/Dashboard/ActivityFeed';
import { QuickActions } from '@/components/admin/Dashboard/QuickActions';
import { usePostStats, useRecentActivity } from '@/hooks/queries/usePostsQueries';

export default function AdminDashboard() {
  const statsQuery = usePostStats();
  const activityQuery = useRecentActivity(8);

  const isLoading = statsQuery.isLoading || activityQuery.isLoading;
  const stats = statsQuery.data ?? null;
  const activities = activityQuery.data ?? [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary">Dashboard</h1>
        <p className="text-text mt-1">Welcome back. Here&apos;s an overview of your blog.</p>
      </div>

      {/* Quick Actions Section */}
      <section>
        <QuickActions />
      </section>

      {/* Stats Grid */}
      <section>
        <h2 className="text-lg font-semibold text-secondary mb-4">Statistics</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-surface rounded-lg p-6 animate-pulse"
              >
                <div className="h-4 bg-surface rounded w-1/2 mb-4" />
                <div className="h-8 bg-surface rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Total Posts" value={stats.total_posts} icon="📊" />
            <StatsCard
              label="Published"
              value={stats.published_count}
              icon="✓"
              variant="success"
            />
            <StatsCard label="Drafts" value={stats.draft_count} icon="✎" variant="info" />
            <StatsCard
              label="Scheduled"
              value={stats.scheduled_count}
              icon="📅"
              variant="primary"
            />
          </div>
        ) : (
          <div className="text-center py-8 text-text">Failed to load statistics</div>
        )}
      </section>

      {/* Activity Feed */}
      <section>
        <ActivityFeed
          activities={activities}
          isLoading={isLoading || activityQuery.isFetching}
          isEmpty={!isLoading && activities.length === 0}
        />
      </section>
    </div>
  );
}
