'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileText, Trash2, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostData, CategoryData, PaginationMeta } from '@/types/admin';
import { PostRow } from './PostRow';
import { Button } from '@/components/ui/Button';

export interface PostsTableProps {
  posts: PostData[];
  categories: CategoryData[];
  pagination: PaginationMeta;
  onDelete: (postId: string) => Promise<void>;
  onBulkDelete: (postIds: string[]) => Promise<void>;
  onBulkPublish: (postIds: string[]) => Promise<void>;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isDeleting?: boolean;
  selectedPosts?: string[];
  onSelectChange?: (postId: string) => void;
  onSelectAll?: (postIds: string[]) => void;
}

export function PostsTable({
  posts,
  categories,
  pagination,
  onDelete,
  onBulkDelete,
  onBulkPublish,
  onPageChange,
  isLoading = false,
  isDeleting = false,
  selectedPosts = [],
  onSelectChange,
  onSelectAll,
}: PostsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-surface bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface bg-background">
                {['', 'Title', 'Status', 'Category', 'Date', ''].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-semibold text-text/50 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-surface animate-pulse">
                  <td className="px-4 py-4"><div className="h-4 w-4 bg-surface rounded" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-surface rounded w-48" /></td>
                  <td className="px-4 py-4"><div className="h-5 bg-surface rounded-full w-20" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-surface rounded w-24" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-surface rounded w-20" /></td>
                  <td className="px-4 py-4"><div className="h-6 w-6 bg-surface rounded ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-surface bg-white flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-text/40" />
        </div>
        <p className="font-medium text-secondary mb-1">No posts found</p>
        <p className="text-sm text-text/60 mb-6">
          Try adjusting your filters or create your first post.
        </p>
        <Button variant="primary" size="sm" asChild>
          <Link href="/admin/posts/new">Create post</Link>
        </Button>
      </div>
    );
  }

  const allSelected = selectedPosts.length > 0 && selectedPosts.length === posts.length;
  const someSelected = selectedPosts.length > 0 && selectedPosts.length < posts.length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions Toolbar */}
      {selectedPosts.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
          <span className="text-sm font-medium text-primary">
            {selectedPosts.length} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              icon={<CheckSquare className="w-3.5 h-3.5" />}
              onClick={() => onBulkPublish(selectedPosts)}
              disabled={isDeleting}
            >
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => onBulkDelete(selectedPosts)}
              disabled={isDeleting}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectAll?.([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-surface bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface bg-background">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={(e) => {
                      if (e.target.checked && onSelectAll) {
                        onSelectAll(posts.map((p) => p.id!));
                      } else if (onSelectAll) {
                        onSelectAll([]);
                      }
                    }}
                    className="h-4 w-4 rounded border-surface text-primary focus:ring-primary accent-primary"
                  />
                </th>
                {['Title', 'Status', 'Category', 'Date', ''].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold text-text/50 uppercase tracking-wide"
                  >
                    {header}
                  </th>
                ))}
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
                  isSelected={selectedPosts.includes(post.id!)}
                  onSelectChange={onSelectChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text/60">
            {(pagination.page - 1) * pagination.per_page + 1}–
            {Math.min(pagination.page * pagination.per_page, pagination.total)} of{' '}
            {pagination.total} posts
          </p>

          <div className="flex gap-1.5">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading || isDeleting}
              className={cn(
                'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
                'border border-surface bg-white text-secondary',
                'hover:bg-background transition-colors',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                let pageNum = i + 1;
                if (pagination.total_pages > 5) {
                  const start = Math.max(1, pagination.page - 2);
                  pageNum = start + i;
                  if (pageNum > pagination.total_pages) return null;
                }
                return pageNum;
              }).map((pageNum) => {
                if (pageNum === null) return null;
                const isActive = pageNum === pagination.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum as number)}
                    disabled={isLoading || isDeleting}
                    className={cn(
                      'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'border border-surface bg-white text-secondary hover:bg-background',
                      'disabled:opacity-40 disabled:cursor-not-allowed'
                    )}
                    aria-label={`Page ${pageNum}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.total_pages || isLoading || isDeleting}
              className={cn(
                'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
                'border border-surface bg-white text-secondary',
                'hover:bg-background transition-colors',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
