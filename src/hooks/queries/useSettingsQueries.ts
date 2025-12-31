'use client';

import { useQuery } from '@tanstack/react-query';
import { getSettings } from '@/lib/admin/settings';
import { SiteSettings } from '@/types/admin';
import { withSupabaseAuthRetry } from '@/lib/queryClient';
import { adminQueryKeys } from './queryKeys';

export function useSiteSettings() {
  return useQuery<SiteSettings, Error>({
    queryKey: adminQueryKeys.settings.all,
    queryFn: () => withSupabaseAuthRetry(() => getSettings()),
  });
}
