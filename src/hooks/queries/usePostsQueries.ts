'use client';

import { useMemo } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPost, getPostStats, getPosts, getRecentActivity } from '@/lib/cms/posts';
import {
  DashboardStats,
  PaginatedResult,
  PostData,
  PostFilters,
  RecentActivity,
} from '@/types/cms';
import { withSupabaseAuthRetry, REALTIME_QUERY_STALE_TIME_MS } from '@/lib/queryClient';
import { cmsQueryKeys, NormalizedPostFilters } from './queryKeys';

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
    // Intentionally listing individual primitive properties instead of the `filters`
    // object reference to avoid unnecessary recomputations on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.search, filters.status, filters.category_id, filters.page, filters.per_page]
  );

  return useQuery<PaginatedResult<PostData>, Error>({
    queryKey: cmsQueryKeys.posts.list(normalized),
    queryFn: () => withSupabaseAuthRetry(() => getPosts(normalized)),
    placeholderData: keepPreviousData,
  });
}

export function usePostById(id?: string) {
  return useQuery<PostData, Error>({
    queryKey: id ? cmsQueryKeys.posts.byId(id) : ['posts', 'missing-id'],
    queryFn: () => withSupabaseAuthRetry(() => getPost(id!)),
    enabled: Boolean(id),
  });
}

export function usePostStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: cmsQueryKeys.posts.stats(),
    queryFn: () => withSupabaseAuthRetry(() => getPostStats()),
  });
}

export function useRecentActivity(limit: number = 10) {
  return useQuery<RecentActivity[], Error>({
    queryKey: cmsQueryKeys.posts.activity(limit),
    queryFn: () => withSupabaseAuthRetry(() => getRecentActivity(limit)),
    staleTime: REALTIME_QUERY_STALE_TIME_MS,
  });
}
