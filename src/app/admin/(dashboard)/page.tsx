/**
 * Admin Dashboard - Step 3
 * Displays quick stats, recent activity, and quick action shortcuts
 */

'use client';

import React from 'react';
import { StatsCard } from '@/components/admin/Dashboard/StatsCard';
import { ActivityFeed } from '@/components/admin/Dashboard/ActivityFeed';
import { QuickActions } from '@/components/admin/Dashboard/QuickActions';
import { WelcomeHero } from '@/components/admin/Dashboard/WelcomeHero';
import { ContentChart } from '@/components/admin/Dashboard/ContentChart';
import { usePostStats, useRecentActivity } from '@/hooks/queries/usePostsQueries';
import {
  BarChart3,
  CheckCircle2,
  FileEdit,
  Calendar
} from 'lucide-react';

export default function AdminDashboard() {
  const statsQuery = usePostStats();
  const activityQuery = useRecentActivity(8);

  const isLoading = statsQuery.isLoading || activityQuery.isLoading;
  const stats = statsQuery.data ?? null;
  const activities = activityQuery.data ?? [];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Hero Section */}
      <WelcomeHero />

      {/* Stats Grid */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-xl font-bold text-secondary">At a Glance</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-surface rounded-xl p-6 h-32 animate-pulse"
              />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              label="Total Posts"
              value={stats.total_posts}
              icon={BarChart3}
              variant="default"
              trend={{ direction: 'up', percentage: 12 }}
            />
            <StatsCard
              label="Published"
              value={stats.published_count}
              icon={CheckCircle2}
              variant="success"
              trend={{ direction: 'up', percentage: 8 }}
            />
            <StatsCard
              label="Drafts"
              value={stats.draft_count}
              icon={FileEdit}
              variant="info"
            />
            <StatsCard
              label="Scheduled"
              value={stats.scheduled_count}
              icon={Calendar}
              variant="primary"
            />
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-surface text-text/60">
            Failed to load statistics
          </div>
        )}
      </section>

      {/* Main Content Grid: Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Chart */}
          <ContentChart />

          {/* Quick Actions Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <h2 className="text-xl font-bold text-secondary">Quick Actions</h2>
            </div>
            <QuickActions />
          </section>
        </div>

        <div className="lg:col-span-1">
          {/* Activity Feed */}
          <ActivityFeed
            activities={activities}
            isLoading={activityQuery.isLoading}
            isEmpty={!activityQuery.isLoading && activities.length === 0}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
