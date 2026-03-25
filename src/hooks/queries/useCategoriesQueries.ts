'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getCategories,
  getCategoriesWithCount,
  getCategory,
} from '@/lib/cms/categories';
import {
  CategoryData,
  CategoryWithPostCount,
} from '@/types/cms';
import { withSupabaseAuthRetry, REALTIME_QUERY_STALE_TIME_MS } from '@/lib/queryClient';
import { cmsQueryKeys } from './queryKeys';

export function useCategories() {
  return useQuery<CategoryData[], Error>({
    queryKey: cmsQueryKeys.categories.all,
    queryFn: () => withSupabaseAuthRetry(() => getCategories()),
    staleTime: REALTIME_QUERY_STALE_TIME_MS,
  });
}

export function useCategoriesWithCount() {
  return useQuery<CategoryWithPostCount[], Error>({
    queryKey: cmsQueryKeys.categories.withCount(),
    queryFn: () => withSupabaseAuthRetry(() => getCategoriesWithCount()),
    staleTime: REALTIME_QUERY_STALE_TIME_MS,
  });
}

export function useCategoryById(id?: string) {
  return useQuery<CategoryData, Error>({
    queryKey: id ? cmsQueryKeys.categories.byId(id) : ['categories', 'missing-id'],
    queryFn: () => withSupabaseAuthRetry(() => getCategory(id!)),
    enabled: Boolean(id),
  });
}
