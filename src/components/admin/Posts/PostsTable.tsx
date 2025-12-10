/**
 * PostsTable Component
 * Renders posts data in a responsive table with pagination
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { PostData, CategoryData, PaginationMeta } from '@/types/admin';
import { PostRow } from './PostRow';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PostsTableProps {
  posts: PostData[];
  categories: CategoryData[];
  pagination: PaginationMeta;
  onDelete: (postId: string) => Promise<void>;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

export function PostsTable({
  posts,
  categories,
  pagination,
  onDelete,
  onPageChange,
  isLoading = false,
  isDeleting = false,
}: PostsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-surface bg-white p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-surface border-t-primary" />
          <p className="text-text">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-surface bg-white p-8 text-center">
        <p className="text-text">No posts found. Create your first post to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="rounded-lg border border-surface bg-white overflow-hidden">
        {/* Responsive table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface bg-background">
                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  categories={categories}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text">
            Showing {(pagination.page - 1) * pagination.per_page + 1} to{' '}
            {Math.min(pagination.page * pagination.per_page, pagination.total)} of{' '}
            {pagination.total} posts
          </p>

          <div className="flex gap-2">
            {/* Previous button */}
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading || isDeleting}
              className={cn(
                'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
                'border border-surface bg-white',
                'hover:bg-background transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.total_pages) },
                (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum = i + 1;
                  if (pagination.total_pages > 5) {
                    const start = Math.max(1, pagination.page - 2);
                    pageNum = start + i;
                    if (pageNum > pagination.total_pages) return null;
                  }
                  return pageNum;
                }
              ).map((pageNum) => {
                if (pageNum === null) return null;

                const isActive = pageNum === pagination.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum as number)}
                    disabled={isLoading || isDeleting}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium',
                      'transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'border border-surface bg-white hover:bg-background',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    aria-label={`Page ${pageNum}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.total_pages || isLoading || isDeleting}
              className={cn(
                'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
                'border border-surface bg-white',
                'hover:bg-background transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label="Next page"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
