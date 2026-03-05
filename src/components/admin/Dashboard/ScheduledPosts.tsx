'use client';

import React from 'react';
import Link from 'next/link';
import { usePostsList } from '@/hooks/queries/usePostsQueries';

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
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-2">
            <div className="h-4 bg-zinc-100 rounded w-2/3" />
            <div className="h-3 bg-zinc-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-sm text-zinc-400 italic">
        No upcoming scheduled posts.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <div key={post.id} className="group relative">
          <Link
            href={`/admin/posts/${post.id}`}
            className="flex flex-col gap-1 hover:no-underline"
          >
            <span className="text-sm font-semibold text-zinc-900 tracking-tight group-hover:underline">
              {post.title}
            </span>
            {post.published_at && (
              <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                <span>{formatScheduledDate(post.published_at)}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-200" />
                <span>{formatTime(post.published_at)}</span>
              </div>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
