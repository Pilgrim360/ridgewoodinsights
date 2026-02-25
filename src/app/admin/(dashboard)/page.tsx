/**
 * Admin Dashboard
 * Editorial command center for blog management
 */

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarClock,
  Clock3,
  FileClock,
  LineChart,
  PenSquare,
  Sparkles,
} from 'lucide-react';
import { StatsCard } from '@/components/admin/Dashboard/StatsCard';
import { ActivityFeed } from '@/components/admin/Dashboard/ActivityFeed';
import { QuickActions } from '@/components/admin/Dashboard/QuickActions';
import { usePostStats, useRecentActivity } from '@/hooks/queries/usePostsQueries';

function formatNow() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
}

export default function AdminDashboard() {
  const statsQuery = usePostStats();
  const activityQuery = useRecentActivity(8);

  const isLoading = statsQuery.isLoading || activityQuery.isLoading;
  const stats = statsQuery.data ?? null;
  const activities = activityQuery.data ?? [];

  const dashboardHighlights = useMemo(() => {
    if (!stats) {
      return {
        publishingRate: 0,
        draftPressure: 0,
      };
    }

    const publishingRate =
      stats.total_posts > 0
        ? Math.round((stats.published_count / stats.total_posts) * 100)
        : 0;

    const draftPressure =
      stats.total_posts > 0 ? Math.round((stats.draft_count / stats.total_posts) * 100) : 0;

    return { publishingRate, draftPressure };
  }, [stats]);

  return (
    <div className="space-y-6 pb-8">
      <section className="rounded-2xl border border-surface bg-gradient-to-br from-white via-background to-primary/[0.06] p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-secondary shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Blog command center
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-secondary md:text-3xl">
              Welcome back, let&apos;s ship great content.
            </h1>
            <p className="text-sm text-text md:text-base">
              {formatNow()} · Stay consistent with publishing, improve draft quality, and keep
              your editorial queue healthy.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              <PenSquare className="h-4 w-4" aria-hidden="true" />
              New post
            </Link>
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-2 rounded-lg border border-surface bg-white px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:border-primary/30 hover:text-primary"
            >
              Review queue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <QuickActions />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary">Publishing snapshot</h2>
          <p className="text-xs text-text/80">Updated in real time</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-surface bg-white p-6"
              >
                <div className="mb-3 h-4 w-1/2 rounded bg-surface" />
                <div className="h-8 w-2/3 rounded bg-surface" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              label="Total posts"
              value={stats.total_posts}
              icon={<LineChart className="h-4 w-4" />}
              helperText="All-time published, draft, and scheduled content"
            />
            <StatsCard
              label="Published"
              value={stats.published_count}
              icon={<Sparkles className="h-4 w-4" />}
              variant="success"
              trend={{ direction: 'up', percentage: dashboardHighlights.publishingRate }}
              helperText="Published share of your full post library"
            />
            <StatsCard
              label="Drafts"
              value={stats.draft_count}
              icon={<FileClock className="h-4 w-4" />}
              variant="info"
              trend={{ direction: 'neutral', percentage: dashboardHighlights.draftPressure }}
              helperText="Drafts waiting for review and final edits"
            />
            <StatsCard
              label="Scheduled"
              value={stats.scheduled_count}
              icon={<CalendarClock className="h-4 w-4" />}
              variant="primary"
              helperText="Posts lined up for upcoming publication"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            Failed to load dashboard statistics. Please refresh to try again.
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ActivityFeed
          className="xl:col-span-2"
          activities={activities}
          isLoading={activityQuery.isLoading}
          isEmpty={!activityQuery.isLoading && activities.length === 0}
        />

        <aside className="rounded-xl border border-surface bg-white p-5">
          <h3 className="text-base font-semibold text-secondary">Editorial health</h3>
          <p className="mt-1 text-sm text-text/90">
            A compact view of what to prioritize next without overwhelming your team.
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-surface bg-background/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Cadence</p>
              <p className="mt-1 text-sm text-text">
                {stats && stats.scheduled_count > 0
                  ? `You have ${stats.scheduled_count} scheduled post${
                      stats.scheduled_count === 1 ? '' : 's'
                    } queued.`
                  : 'No scheduled posts yet. Queue one to maintain consistency.'}
              </p>
            </div>

            <div className="rounded-lg border border-surface bg-background/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Backlog focus
              </p>
              <p className="mt-1 text-sm text-text">
                {stats && stats.draft_count > 0
                  ? `${stats.draft_count} draft${stats.draft_count === 1 ? ' is' : 's are'} waiting for polish. Prioritize the top two this week.`
                  : 'No drafts waiting—great job keeping your queue clean.'}
              </p>
            </div>

            <Link
              href="/admin/posts?status=draft"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
            >
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              Review draft queue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
