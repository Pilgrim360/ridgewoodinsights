'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { usePostsList } from '@/hooks/queries/usePostsQueries';
import { cn } from '@/lib/utils';

function formatScheduledDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ScheduledPosts() {
  const { data, isLoading } = usePostsList({ status: 'scheduled', per_page: 5 });
  const posts = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="rounded-xl border border-surface bg-white">
        <div className="px-6 py-4 border-b border-surface">
          <h3 className="text-base font-semibold text-secondary">Scheduled Posts</h3>
        </div>
        <div className="p-6 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface rounded w-3/4" />
                <div className="h-3 bg-surface rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-surface bg-white">
        <div className="px-6 py-4 border-b border-surface">
          <h3 className="text-base font-semibold text-secondary">Scheduled Posts</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
          <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mb-3">
            <Calendar className="w-4 h-4 text-text/40" />
          </div>
          <p className="text-sm text-text/60">No scheduled posts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-surface bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-surface flex items-center justify-between">
        <h3 className="text-base font-semibold text-secondary">Scheduled Posts</h3>
        <Link
          href="/admin/posts?status=scheduled"
          className="text-xs font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
        >
          View all
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-surface">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/admin/posts/${post.id}`}
            className="flex items-center gap-3 px-6 py-3.5 hover:bg-background transition-colors group"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary truncate">{post.title}</p>
              {post.published_at && (
                <p className={cn('text-xs mt-0.5 flex items-center gap-1', 'text-text/60')}>
                  <Clock className="w-3 h-3" />
                  {formatScheduledDate(post.published_at)} at {formatTime(post.published_at)}
                </p>
              )}
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-text/30 group-hover:text-text/60 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
