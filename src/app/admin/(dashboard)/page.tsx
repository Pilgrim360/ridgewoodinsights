'use client';

import React from 'react';
import { FileText, CheckCircle2, FileEdit, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
    <div className="space-y-12">
      {/* Header Section */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-secondary">Dashboard</h1>
        <p className="text-sm text-text/50 mt-1">Overview and management of your blog content.</p>
      </section>

      {/* Insights Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-text/40">Insights</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsQuery.isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-background animate-pulse rounded-lg border border-surface" />
            ))
          ) : stats ? (
            <>
              <StatsCard
                label="Total Posts"
                value={stats.total_posts}
                icon={<FileText className="w-4 h-4" />}
              />
              <StatsCard
                label="Published"
                value={stats.published_count}
                icon={<CheckCircle2 className="w-4 h-4" />}
                variant="success"
              />
              <StatsCard
                label="Drafts"
                value={stats.draft_count}
                icon={<FileEdit className="w-4 h-4" />}
                variant="info"
              />
              <StatsCard
                label="Scheduled"
                value={stats.scheduled_count}
                icon={<Calendar className="w-4 h-4" />}
                variant="primary"
              />
            </>
          ) : (
            <div className="col-span-full py-12 text-center border border-surface rounded-lg bg-white italic text-text/40">
              Statistics unavailable.
            </div>
          )}
        </div>
      </section>

      {/* Content Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        {/* Recent Activity */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-text/40">Recent Activity</h2>
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 group transition-colors"
            >
              View All Posts
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <ActivityFeed
            activities={activities}
            isLoading={activityQuery.isLoading}
            isEmpty={!activityQuery.isLoading && activities.length === 0}
          />
        </section>

        {/* Sidebar Widgets */}
        <section className="space-y-12">
          {/* Scheduled Content */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-text/40">Scheduled</h2>
            <ScheduledPosts />
          </div>
        </section>
      </div>
    </div>
  );
}
