'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getCategories,
  getCategoriesWithCount,
  getCategory,
} from '@/lib/admin/categories';
import {
  CategoryData,
  CategoryWithPostCount,
} from '@/types/admin';
import { withSupabaseAuthRetry, REALTIME_QUERY_STALE_TIME_MS } from '@/lib/queryClient';
import { adminQueryKeys } from './queryKeys';

export function useCategories() {
  return useQuery<CategoryData[], Error>({
    queryKey: adminQueryKeys.categories.all,
    queryFn: () => withSupabaseAuthRetry(() => getCategories()),
    staleTime: REALTIME_QUERY_STALE_TIME_MS,
  });
}

export function useCategoriesWithCount() {
  return useQuery<CategoryWithPostCount[], Error>({
    queryKey: adminQueryKeys.categories.withCount(),
    queryFn: () => withSupabaseAuthRetry(() => getCategoriesWithCount()),
    staleTime: REALTIME_QUERY_STALE_TIME_MS,
  });
}

export function useCategoryById(id?: string) {
  return useQuery<CategoryData, Error>({
    queryKey: id ? adminQueryKeys.categories.byId(id) : ['categories', 'missing-id'],
    queryFn: () => withSupabaseAuthRetry(() => getCategory(id!)),
    enabled: Boolean(id),
  });
}
