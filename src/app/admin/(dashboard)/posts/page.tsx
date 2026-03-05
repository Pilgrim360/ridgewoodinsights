'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { PostsTable } from '@/components/admin/Posts/PostsTable';
import { PostFilters } from '@/types/admin';
import { useCategories } from '@/hooks/queries/useCategoriesQueries';
import { usePostsList } from '@/hooks/queries/usePostsQueries';
import { useDeletePost } from '@/hooks/queries/useAdminMutations';

export default function PostsPage() {
  const [filters, setFilters] = useState<PostFilters>({
    search: '',
    status: 'all',
    page: 1,
    per_page: 10,
  });

  const categoriesQuery = useCategories();
  const postsQuery = usePostsList(filters);
  const deletePostMutation = useDeletePost();

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((status: PostFilters['status']) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleDeletePost = useCallback(
    async (postId: string) => {
      if (!confirm('Are you sure you want to delete this post?')) return;
      try {
        await deletePostMutation.mutateAsync(postId);
      } catch {
        // Error handled by toast
      }
    },
    [deletePostMutation]
  );

  const posts = postsQuery.data?.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const pagination = postsQuery.data?.meta ?? {
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-secondary">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
          <input
            type="text"
            placeholder="Search posts..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-surface bg-white text-secondary placeholder:text-text/40 focus:outline-none focus:border-primary"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value as PostFilters['status'])}
          className="px-3 py-2 text-sm rounded-lg border border-surface bg-white text-secondary focus:outline-none focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Table */}
      <PostsTable
        posts={posts}
        categories={categories}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={handleDeletePost}
        isLoading={postsQuery.isLoading}
      />
    </div>
  );
}
