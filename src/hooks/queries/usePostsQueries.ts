'use client';

import { useMemo } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPost, getPostStats, getPosts, getRecentActivity } from '@/lib/admin/posts';
import {
  DashboardStats,
  PaginatedResult,
  PostData,
  PostFilters,
  RecentActivity,
} from '@/types/admin';
import { withSupabaseAuthRetry, REALTIME_QUERY_STALE_TIME_MS } from '@/lib/queryClient';
import { adminQueryKeys, NormalizedPostFilters } from './queryKeys';

function normalizeFilters(filters: PostFilters): NormalizedPostFilters {
  return {
    search: filters.search ?? '',
    status: (filters.status ?? 'all') as NormalizedPostFilters['status'],
    category_id: filters.category_id || undefined,
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 10,
  };
}

export function usePostsList(filters: PostFilters) {
  const normalized = useMemo(
    () => normalizeFilters(filters),
    [filters]
  );

  return useQuery<PaginatedResult<PostData>, Error>({
    queryKey: adminQueryKeys.posts.list(normalized),
    queryFn: () => withSupabaseAuthRetry(() => getPosts(normalized)),
    placeholderData: keepPreviousData,
  });
}

export function usePostById(id?: string) {
  return useQuery<PostData, Error>({
    queryKey: id ? adminQueryKeys.posts.byId(id) : ['posts', 'missing-id'],
    queryFn: () => withSupabaseAuthRetry(() => getPost(id!)),
    enabled: Boolean(id),
  });
}

export function usePostStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: adminQueryKeys.posts.stats(),
    queryFn: () => withSupabaseAuthRetry(() => getPostStats()),
  });
}

export function useRecentActivity(limit: number = 10) {
  return useQuery<RecentActivity[], Error>({
    queryKey: adminQueryKeys.posts.activity(limit),
    queryFn: () => withSupabaseAuthRetry(() => getRecentActivity(limit)),
    staleTime: REALTIME_QUERY_STALE_TIME_MS,
  });
}
