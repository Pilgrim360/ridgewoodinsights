'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMediaItems, MediaItem, searchMedia } from '@/lib/admin/media';
import { withSupabaseAuthRetry, REALTIME_QUERY_STALE_TIME_MS } from '@/lib/queryClient';
import { adminQueryKeys } from './queryKeys';

export function useMediaLibrary(filters: { userId?: string; search?: string }) {
  const normalizedFilters = useMemo(
    () => ({
      userId: filters.userId,
      search: filters.search?.trim() || undefined,
    }),
    [filters.userId, filters.search]
  );

  return useQuery<MediaItem[], Error>({
    queryKey: normalizedFilters.userId
      ? adminQueryKeys.media.list({
          userId: normalizedFilters.userId,
          search: normalizedFilters.search,
        })
      : ['media', { filters: { userId: 'missing-user' } }],
    queryFn: () => {
      const userId = normalizedFilters.userId!;
      if (normalizedFilters.search) {
        return withSupabaseAuthRetry(() => searchMedia(userId, normalizedFilters.search!));
      }
      return withSupabaseAuthRetry(() => getMediaItems(userId));
    },
    enabled: Boolean(normalizedFilters.userId),
    staleTime: REALTIME_QUERY_STALE_TIME_MS,
  });
}

export function useMediaItem(path?: string, userId?: string) {
  return useQuery<MediaItem | null, Error>({
    queryKey: path ? adminQueryKeys.media.byPath(path) : ['media', 'missing-path'],
    queryFn: async () => {
      if (!path || !userId) return null;
      const items = await withSupabaseAuthRetry(() => getMediaItems(userId));
      return items.find((item) => item.path === path) ?? null;
    },
    enabled: Boolean(path && userId),
    staleTime: REALTIME_QUERY_STALE_TIME_MS,
  });
}
