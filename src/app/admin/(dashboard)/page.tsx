'use client';

import Link from 'next/link';
import React from 'react';
import { ArrowRight, Calendar, CheckCircle2, FileClock, FileText, PenSquare } from 'lucide-react';
import { usePostStats, usePostsList } from '@/hooks/queries/usePostsQueries';
import { formatRelativeTime } from '@/lib/admin/dates';

const statCards = [
  { key: 'total_posts', label: 'Total posts', icon: FileText },
  { key: 'published_count', label: 'Published', icon: CheckCircle2 },
  { key: 'draft_count', label: 'Drafts', icon: PenSquare },
  { key: 'scheduled_count', label: 'Scheduled', icon: Calendar },
] as const;

export default function AdminDashboard() {
  const statsQuery = usePostStats();
  const recentPostsQuery = usePostsList({ page: 1, per_page: 5 });

  const stats = statsQuery.data;
  const recentPosts = recentPostsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-surface bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text/60">Overview</p>
            <h2 className="mt-1 text-2xl font-semibold text-secondary">Manage your blog with clarity</h2>
            <p className="mt-2 max-w-2xl text-sm text-text/75">
              Keep content operations focused: write, schedule, publish, and maintain taxonomy from one clean workspace.
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark hover:no-underline"
          >
            New post
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Post metrics">
        {statCards.map(({ key, label, icon: Icon }) => (
          <article key={key} className="rounded-xl border border-surface bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text/70">{label}</p>
              <span className="rounded-md bg-background p-2 text-secondary">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-secondary">
              {statsQuery.isLoading ? '—' : stats?.[key] ?? 0}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-surface bg-white" aria-label="Recent posts">
        <div className="flex items-center justify-between border-b border-surface px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-secondary">Recent posts</h3>
            <p className="text-xs text-text/65">Latest updates across draft, scheduled, and published content.</p>
          </div>
          <Link href="/admin/posts" className="text-sm font-medium text-primary hover:no-underline hover:text-primary-dark">
            View all
          </Link>
        </div>

        {recentPostsQuery.isLoading ? (
          <div className="p-5 text-sm text-text/60">Loading recent posts…</div>
        ) : recentPosts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center text-sm text-text/65">
            <FileClock className="h-5 w-5" />
            No posts yet. Start by creating your first article.
          </div>
        ) : (
          <ul className="divide-y divide-surface">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-background hover:no-underline"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-secondary">{post.title}</p>
                    <p className="mt-1 text-xs text-text/65">
                      Updated {post.updated_at ? formatRelativeTime(post.updated_at) : 'recently'}
                    </p>
                  </div>
                  <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium capitalize text-secondary">
                    {post.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
