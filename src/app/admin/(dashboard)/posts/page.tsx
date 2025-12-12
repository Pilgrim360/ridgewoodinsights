/**
 * Posts Management Page
 * Step 4: Lists all posts with filtering, sorting, and pagination
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAdminError } from '@/contexts/AdminErrorContext';
import { getPosts, deletePost, bulkDeletePosts, bulkPublishPosts } from '@/lib/admin/posts';
import { FilterBar } from '@/components/admin/Posts/FilterBar';
import { PostsTable } from '@/components/admin/Posts/PostsTable';
import { PostData, PostFilters, CategoryData } from '@/types/admin';
import { supabase } from '@/lib/admin/supabase';

interface PageState {
  posts: PostData[];
  categories: CategoryData[];
  filters: PostFilters;
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  } | null;
  isLoading: boolean;
  isDeleting: boolean;
  selectedPosts: string[];
  error: string | null;
}

export default function PostsPage() {
  const { showError, showSuccess } = useAdminError();
  const [state, setState] = useState<PageState>({
    posts: [],
    categories: [],
    filters: {
      search: '',
      status: 'all',
      page: 1,
      per_page: 10,
    },
    pagination: null,
    isLoading: true,
    isDeleting: false,
    selectedPosts: [],
    error: null,
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name', { ascending: true });

        if (error) throw error;

        setState((prev) => ({
          ...prev,
          categories: data || [],
        }));
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Don't show error to user - categories are optional
      }
    };

    fetchCategories();
  }, []);

  // Fetch posts when filters or page changes
  useEffect(() => {
    const fetchPosts = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await getPosts(state.filters);
        setState((prev) => ({
          ...prev,
          posts: result.data,
          pagination: result.meta,
          isLoading: false,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch posts';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        showError(message);
      }
    };

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters, showError]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: PostFilters) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...newFilters,
      },
    }));
  }, []);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        page,
      },
    }));
  }, []);

  // Handle post deletion
  const handleDeletePost = useCallback(
    async (postId: string) => {
      setState((prev) => ({ ...prev, isDeleting: true }));

      try {
        await deletePost(postId);
        showSuccess('Post deleted successfully');

        // Refresh posts list
        const result = await getPosts(state.filters);
        setState((prev) => ({
          ...prev,
          posts: result.data,
          pagination: result.meta,
          isDeleting: false,
          selectedPosts: prev.selectedPosts.filter(id => id !== postId),
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete post';
        showError(message);
        setState((prev) => ({ ...prev, isDeleting: false }));
      }
    },
    [state.filters, showError, showSuccess]
  );

  // Handle bulk delete
  const handleBulkDelete = useCallback(
    async (postIds: string[]) => {
      if (postIds.length === 0) return;

      setState((prev) => ({ ...prev, isDeleting: true }));

      try {
        await bulkDeletePosts(postIds);
        showSuccess(`${postIds.length} post(s) deleted successfully`);

        // Refresh posts list
        const result = await getPosts(state.filters);
        setState((prev) => ({
          ...prev,
          posts: result.data,
          pagination: result.meta,
          isDeleting: false,
          selectedPosts: [],
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete posts';
        showError(message);
        setState((prev) => ({ ...prev, isDeleting: false }));
      }
    },
    [state.filters, showError, showSuccess]
  );

  // Handle bulk publish
  const handleBulkPublish = useCallback(
    async (postIds: string[]) => {
      if (postIds.length === 0) return;

      setState((prev) => ({ ...prev, isDeleting: true }));

      try {
        await bulkPublishPosts(postIds);
        showSuccess(`${postIds.length} post(s) published successfully`);

        // Refresh posts list
        const result = await getPosts(state.filters);
        setState((prev) => ({
          ...prev,
          posts: result.data,
          pagination: result.meta,
          isDeleting: false,
          selectedPosts: [],
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to publish posts';
        showError(message);
        setState((prev) => ({ ...prev, isDeleting: false }));
      }
    },
    [state.filters, showError, showSuccess]
  );

  // Handle post selection
  const handleSelectPost = useCallback((postId: string) => {
    setState((prev) => ({
      ...prev,
      selectedPosts: prev.selectedPosts.includes(postId)
        ? prev.selectedPosts.filter(id => id !== postId)
        : [...prev.selectedPosts, postId],
    }));
  }, []);

  // Handle select all
  const handleSelectAll = useCallback((postIds: string[]) => {
    setState((prev) => ({
      ...prev,
      selectedPosts: postIds,
    }));
  }, []);

  // Fallback pagination if not loaded yet
  const paginationMeta = state.pagination || {
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0,
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar with search and dropdowns */}
      <FilterBar
        filters={state.filters}
        categories={state.categories}
        onFilterChange={handleFilterChange}
        isLoading={state.isLoading}
      />

      {/* Posts Table */}
      <PostsTable
        posts={state.posts}
        categories={state.categories}
        pagination={paginationMeta}
        onDelete={handleDeletePost}
        onBulkDelete={handleBulkDelete}
        onBulkPublish={handleBulkPublish}
        onPageChange={handlePageChange}
        isLoading={state.isLoading}
        isDeleting={state.isDeleting}
        selectedPosts={state.selectedPosts}
        onSelectChange={handleSelectPost}
        onSelectAll={handleSelectAll}
      />
    </div>
  );
}
