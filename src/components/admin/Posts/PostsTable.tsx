'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Trash2, Edit } from 'lucide-react';
import { PostWithAuthor, CategoryData, PaginationMeta } from '@/types/admin';
import { cn } from '@/lib/utils';

interface PostsTableProps {
  posts: PostWithAuthor[];
  categories: CategoryData[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onDelete: (postId: string) => void;
  isLoading?: boolean;
}

function getCategoryName(categories: CategoryData[], categoryId: string | null): string {
  if (!categoryId) return '-';
  return categories.find((c) => c.id === categoryId)?.name ?? '-';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const statusStyles = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-blue-100 text-blue-700',
};

export function PostsTable({
  posts,
  categories,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: PostsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-surface">
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-surface rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-surface p-12 text-center">
        <p className="text-secondary font-medium">No posts found</p>
        <p className="text-sm text-text/60 mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-surface overflow-hidden">
      {/* Table */}
      <table className="w-full">
        <thead className="bg-surface/50 border-b border-surface">
          <tr>
            <th className="text-left text-xs font-medium text-text/60 uppercase tracking-wide px-4 py-3">
              Title
            </th>
            <th className="text-left text-xs font-medium text-text/60 uppercase tracking-wide px-4 py-3 w-24">
              Status
            </th>
            <th className="text-left text-xs font-medium text-text/60 uppercase tracking-wide px-4 py-3 w-32 hidden sm:table-cell">
              Category
            </th>
            <th className="text-left text-xs font-medium text-text/60 uppercase tracking-wide px-4 py-3 w-28 hidden md:table-cell">
              Date
            </th>
            <th className="w-16" />
          </tr>
        </thead>
        <tbody className="divide-y divide-surface">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-surface/30">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="block"
                >
                  <p className="font-medium text-secondary truncate max-w-xs">
                    {post.title}
                  </p>
                </Link>
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize',
                    statusStyles[post.status]
                  )}
                >
                  {post.status}
                </span>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className="text-sm text-text/70">
                  {getCategoryName(categories, post.category_id ?? null)}
                </span>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-sm text-text/60">
                  {formatDate(post.published_at ?? post.created_at ?? '')}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="p-1.5 rounded hover:bg-surface text-text/60 hover:text-secondary"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(post.id!)}
                    className="p-1.5 rounded hover:bg-red-50 text-text/60 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface">
          <p className="text-sm text-text/60">
            {pagination.total} posts
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-1.5 rounded hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-secondary">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.total_pages}
              className="p-1.5 rounded hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
