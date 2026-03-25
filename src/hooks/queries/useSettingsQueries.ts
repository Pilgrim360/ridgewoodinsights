'use client';

import { useQuery } from '@tanstack/react-query';
import { getSettings } from '@/lib/cms/settings';
import { SiteSettings } from '@/types/cms';
import { withSupabaseAuthRetry } from '@/lib/queryClient';
import { cmsQueryKeys } from './queryKeys';

export function useSiteSettings() {
  return useQuery<SiteSettings, Error>({
    queryKey: cmsQueryKeys.settings.all,
    queryFn: () => withSupabaseAuthRetry(() => getSettings()),
  });
}
