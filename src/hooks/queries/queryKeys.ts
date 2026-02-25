import { PostFilters } from '@/types/admin';

export interface NormalizedPostFilters {
  search: string;
  status: NonNullable<PostFilters['status']>;
  category_id?: string;
  page: number;
  per_page: number;
}

export interface MediaLibraryFilters {
  userId: string;
}

export const adminQueryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (filters: NormalizedPostFilters) => ['posts', { filters }] as const,
    byId: (id: string) => ['posts', id] as const,
    stats: () => ['posts', 'stats'] as const,
    activity: (limit: number) => ['activity', limit] as const,
    monthlyCounts: (months: number) => ['posts', 'monthly-counts', months] as const,
  },
  categories: {
    all: ['categories'] as const,
    byId: (id: string) => ['categories', id] as const,
    withCount: () => ['categories', { withCount: true }] as const,
  },
  media: {
    list: (filters: { userId: string; search?: string }) => ['media', { filters }] as const,
    byPath: (path: string) => ['media', path] as const,
  },
  settings: {
    all: ['settings'] as const,
  },
};
