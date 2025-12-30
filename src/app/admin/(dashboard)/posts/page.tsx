/**
 * Posts Management Page
 * Step 4: Lists all posts with filtering, sorting, and pagination
 */

'use client';

import React, { useCallback, useState } from 'react';
import { FilterBar } from '@/components/admin/Posts/FilterBar';
import { PostsTable } from '@/components/admin/Posts/PostsTable';
import { PostFilters } from '@/types/admin';
import { useCategories } from '@/hooks/queries/useCategoriesQueries';
import { usePostsList } from '@/hooks/queries/usePostsQueries';
import {
  useBulkDeletePosts,
  useBulkPublishPosts,
  useDeletePost,
} from '@/hooks/queries/useAdminMutations';

export default function PostsPage() {
  const [filters, setFilters] = useState<PostFilters>({
    search: '',
    status: 'all',
    page: 1,
    per_page: 10,
  });

  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const categoriesQuery = useCategories();
  const postsQuery = usePostsList(filters);

  const deletePostMutation = useDeletePost();
  const bulkDeleteMutation = useBulkDeletePosts();
  const bulkPublishMutation = useBulkPublishPosts();

  const isDeleting =
    deletePostMutation.isPending ||
    bulkDeleteMutation.isPending ||
    bulkPublishMutation.isPending;

  const handleFilterChange = useCallback((newFilters: PostFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const handleDeletePost = useCallback(
    async (postId: string) => {
      await deletePostMutation.mutateAsync(postId);
      setSelectedPosts((prev) => prev.filter((id) => id !== postId));
    },
    [deletePostMutation]
  );

  const handleBulkDelete = useCallback(
    async (postIds: string[]) => {
      if (postIds.length === 0) return;
      await bulkDeleteMutation.mutateAsync(postIds);
      setSelectedPosts([]);
    },
    [bulkDeleteMutation]
  );

  const handleBulkPublish = useCallback(
    async (postIds: string[]) => {
      if (postIds.length === 0) return;
      await bulkPublishMutation.mutateAsync(postIds);
      setSelectedPosts([]);
    },
    [bulkPublishMutation]
  );

  const handleSelectPost = useCallback((postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  }, []);

  const handleSelectAll = useCallback((postIds: string[]) => {
    setSelectedPosts(postIds);
  }, []);

  const posts = postsQuery.data?.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const paginationMeta = postsQuery.data?.meta ?? {
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0,
  };

  const isLoading = postsQuery.isLoading || postsQuery.isFetching;

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />

      <PostsTable
        posts={posts}
        categories={categories}
        pagination={paginationMeta}
        onDelete={handleDeletePost}
        onBulkDelete={handleBulkDelete}
        onBulkPublish={handleBulkPublish}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        isDeleting={isDeleting}
        selectedPosts={selectedPosts}
        onSelectChange={handleSelectPost}
        onSelectAll={handleSelectAll}
      />
    </div>
  );
}
