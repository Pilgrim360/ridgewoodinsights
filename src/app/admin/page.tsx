/**
 * Admin Dashboard - Step 3
 * Displays quick stats, recent activity, and quick action shortcuts
 */

'use client';

import React, { useEffect, useState } from 'react';
import { DashboardStats, RecentActivity } from '@/types/admin';
import { getPostStats, getRecentActivity } from '@/lib/admin/posts';
import { getErrorMessage } from '@/lib/admin/supabase';
import { StatsCard } from '@/components/admin/Dashboard/StatsCard';
import { ActivityFeed } from '@/components/admin/Dashboard/ActivityFeed';
import { QuickActions } from '@/components/admin/Dashboard/QuickActions';
import { useAdminError } from '@/contexts/AdminErrorContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useAdminError();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch stats and activities in parallel
        const [statsData, activitiesData] = await Promise.all([
          getPostStats(),
          getRecentActivity(8),
        ]);

        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        showError(`Failed to load dashboard: ${getErrorMessage(error)}`);
        console.error('Dashboard load error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [showError]);

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
          isLoading={isLoading}
          isEmpty={activities.length === 0}
        />
      </section>
    </div>
  );
}
