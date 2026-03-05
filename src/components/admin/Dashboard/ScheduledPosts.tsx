'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { useScheduledPosts } from '@/hooks/queries/usePostsQueries';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ScheduledPosts() {
  const { data: posts, isLoading } = useScheduledPosts();

  return (
    <div className="bg-white rounded-lg border border-surface">
      <div className="px-4 py-3 border-b border-surface flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-secondary">Scheduled</h3>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-8 bg-surface rounded animate-pulse" />
          ))}
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-text/60">No scheduled posts</p>
        </div>
      ) : (
        <div className="divide-y divide-surface">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/admin/posts/${post.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-surface/50 transition-colors"
            >
              <p className="text-sm text-secondary truncate pr-4">{post.title}</p>
              <span className="text-xs text-text/50 flex-shrink-0">
                {formatDate(post.published_at!)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
