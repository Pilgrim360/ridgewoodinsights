'use client';

import React from 'react';
import { FileText, CheckCircle2, FileEdit, Calendar } from 'lucide-react';
import { StatsCard } from '@/components/cms/Dashboard/StatsCard';
import { ActivityFeed } from '@/components/cms/Dashboard/ActivityFeed';
import { ScheduledPosts } from '@/components/cms/Dashboard/ScheduledPosts';
import { usePostStats, useRecentActivity } from '@/hooks/queries/usePostsQueries';
import { CmsPageHeader } from '@/components/cms/CmsPageHeader';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CMSDashboard() {
  const statsQuery = usePostStats();
  const activityQuery = useRecentActivity(8);

  const stats = statsQuery.data ?? null;
  const activities = activityQuery.data ?? [];

  return (
    <div className="space-y-10">
      <CmsPageHeader
        title="Dashboard"
        description="Monitor your blog performance and recent activity."
        actions={
          <Link
            href="/cms/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        }
      />

      <section aria-label="Statistics">
        <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">
          Insights
        </h2>
        {statsQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-surface rounded-xl p-5 animate-pulse"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-3 bg-surface rounded w-1/2" />
                  <div className="w-9 h-9 bg-surface rounded-lg" />
                </div>
                <div className="h-8 bg-surface rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </div>
        ) : (
          <div className="rounded-xl border border-surface bg-white p-8 text-center text-text/60 text-sm">
            Failed to load statistics. Please refresh the page.
          </div>
        )}
      </section>

      <section aria-label="Activity and upcoming posts">
        <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">
          Activity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ActivityFeed
              activities={activities}
              isLoading={activityQuery.isLoading}
              isEmpty={!activityQuery.isLoading && activities.length === 0}
            />
          </div>
          <div className="lg:col-span-1">
            <ScheduledPosts />
          </div>
        </div>
      </section>
    </div>
  );
}
