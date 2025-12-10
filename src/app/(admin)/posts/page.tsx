/**
 * Posts List Page
 * Displays all blog posts with filtering, pagination, and CRUD actions
 * 
 * Server component for initial data fetch, uses client components for interactivity
 */

'use client';

import React, { useState, useCallback } from 'react';
import { useAdminError } from '@/contexts/AdminErrorContext';
import { PostFilters, PostData, CategoryData } from '@/types/admin';
import { getPosts, deletePost } from '@/lib/admin/posts';
import { getCategories } from '@/lib/admin/categories';
import { FilterBar } from '@/components/admin/Posts/FilterBar';
import { PostsTable } from '@/components/admin/Posts/PostsTable';

export default function PostsPage() {
  const { showError, showSuccess } = useAdminError();

  // State management
  const [posts, setPosts] = useState<PostData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filters, setFilters] = useState<PostFilters>({
    search: undefined,
    status: 'all',
    category_id: undefined,
    page: 1,
    per_page: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch posts and categories on mount and when filters change
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // Fetch posts with current filters
        const result = await getPosts(filters);
        setPosts(result.data);
        setPagination(result.meta);
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters, showError]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: PostFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Handle post deletion
  const handleDelete = useCallback(
    async (postId: string) => {
      try {
        setIsDeleting(true);
        await deletePost(postId);

        // Remove from local state and refresh
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        showSuccess('Post deleted successfully');

        // Refetch if this was the last item and we're not on page 1
        if (posts.length === 1 && pagination.page > 1) {
          setFilters((prev) => ({ ...prev, page: pagination.page - 1 }));
        }
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to delete post');
      } finally {
        setIsDeleting(false);
      }
    },
    [posts.length, pagination.page, showError, showSuccess]
  );

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
        pagination={pagination}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        isDeleting={isDeleting}
      />
    </div>
  );
}
