'use client';

import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import {
  bulkDeletePosts,
  bulkPublishPosts,
  createPost,
  deletePost,
  publishPost,
  updatePost,
} from '@/lib/admin/posts';
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/lib/admin/categories';
import { deleteMedia, uploadMedia, type MediaItem } from '@/lib/admin/media';
import { updateSettings } from '@/lib/admin/settings';
import {
  CategoryData,
  CategoryWithPostCount,
  PaginatedResult,
  PostData,
  SiteSettings,
} from '@/types/admin';
import { AdminErrorHandler } from '@/lib/admin/error-handler';
import { useAdminError } from '@/contexts/AdminErrorContext';
import { withSupabaseAuthRetry } from '@/lib/queryClient';
import { adminQueryKeys, type NormalizedPostFilters } from './queryKeys';

type PostsListKey = ReturnType<typeof adminQueryKeys.posts.list>;

function getPostsFiltersFromKey(queryKey: QueryKey): NormalizedPostFilters | null {
  if (!Array.isArray(queryKey)) return null;
  const second = queryKey[1] as Record<string, unknown> | undefined;
  if (!second || typeof second !== 'object') return null;
  const filters = second.filters as NormalizedPostFilters | undefined;
  if (!filters || typeof filters !== 'object') return null;
  return filters;
}

function shouldIncludePostInList(filters: NormalizedPostFilters, post: PostData): boolean {
  if (filters.status !== 'all' && post.status !== filters.status) return false;
  if (filters.category_id && post.category_id !== filters.category_id) return false;
  if (filters.search) {
    const term = filters.search.toLowerCase();
    return post.title.toLowerCase().includes(term);
  }
  return true;
}

const mutationMeta = { toastHandled: true };

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<
    PostData,
    unknown,
    Omit<PostData, 'id' | 'created_at' | 'updated_at'>,
    {
      previousLists: Array<[QueryKey, PaginatedResult<PostData> | undefined]>;
      optimisticId: string;
    }
  >({
    mutationFn: (payload) => withSupabaseAuthRetry(() => createPost(payload)),
    meta: mutationMeta,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.posts.all });

      const previousLists = queryClient.getQueriesData<PaginatedResult<PostData>>({
        queryKey: adminQueryKeys.posts.all,
      });

      const optimisticId = `temp-${Date.now()}`;
      const optimisticPost: PostData = {
        ...payload,
        id: optimisticId,
        status: payload.status ?? 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      previousLists.forEach(([key, data]) => {
        const filters = getPostsFiltersFromKey(key);
        if (!filters || !data) return;
        if (!shouldIncludePostInList(filters, optimisticPost)) return;

        queryClient.setQueryData<PaginatedResult<PostData>>(key, {
          ...data,
          data: [optimisticPost, ...data.data],
          meta: {
            ...data.meta,
            total: data.meta.total + 1,
          },
        });
      });

      return { previousLists, optimisticId };
    },
    onError: (error, _payload, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: (created, _payload, context) => {
      const optimisticId = context?.optimisticId;

      if (optimisticId) {
        const lists = queryClient.getQueriesData<PaginatedResult<PostData>>({
          queryKey: adminQueryKeys.posts.all,
        });

        lists.forEach(([key, data]) => {
          const filters = getPostsFiltersFromKey(key);
          if (!filters || !data) return;

          const next = data.data.map((post) => (post.id === optimisticId ? created : post));
          queryClient.setQueryData<PaginatedResult<PostData>>(key, {
            ...data,
            data: next,
          });
        });
      }

      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.stats() });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      showSuccess(created.status === 'draft' ? 'Draft created' : 'Post created');
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { showError } = useAdminError();

  return useMutation<
    PostData,
    unknown,
    { id: string; updates: Partial<PostData> },
    {
      previousLists: Array<[QueryKey, PaginatedResult<PostData> | undefined]>;
      previousPost: PostData | undefined;
    }
  >({
    mutationFn: ({ id, updates }) => withSupabaseAuthRetry(() => updatePost(id, updates)),
    meta: mutationMeta,
    networkMode: 'always',
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.posts.all });

      const previousLists = queryClient.getQueriesData<PaginatedResult<PostData>>({
        queryKey: adminQueryKeys.posts.all,
      });

      const previousPost = queryClient.getQueryData<PostData>(adminQueryKeys.posts.byId(id));

      if (previousPost) {
        queryClient.setQueryData<PostData>(adminQueryKeys.posts.byId(id), {
          ...previousPost,
          ...updates,
        });
      }

      previousLists.forEach(([key, data]) => {
        const filters = getPostsFiltersFromKey(key);
        if (!filters || !data) return;

        const nextPosts = data.data
          .map((post) => (post.id === id ? { ...post, ...updates } : post))
          .filter((post) => shouldIncludePostInList(filters, post));

        queryClient.setQueryData<PaginatedResult<PostData>>(key, {
          ...data,
          data: nextPosts,
        });
      });

      return { previousLists, previousPost };
    },
    onError: (error, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(adminQueryKeys.posts.byId(variables.id), context.previousPost);
      }

      context?.previousLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(adminQueryKeys.posts.byId(saved.id!), saved);

      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.stats() });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<
    void,
    unknown,
    string,
    {
      previousLists: Array<[QueryKey, PaginatedResult<PostData> | undefined]>;
      previousPost: PostData | undefined;
    }
  >({
    mutationFn: (id) => withSupabaseAuthRetry(() => deletePost(id)),
    meta: mutationMeta,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.posts.all });

      const previousLists = queryClient.getQueriesData<PaginatedResult<PostData>>({
        queryKey: adminQueryKeys.posts.all,
      });

      const previousPost = queryClient.getQueryData<PostData>(adminQueryKeys.posts.byId(id));

      previousLists.forEach(([key, data]) => {
        const filters = getPostsFiltersFromKey(key);
        if (!filters || !data) return;

        const nextPosts = data.data.filter((post) => post.id !== id);
        if (nextPosts.length === data.data.length) return;

        queryClient.setQueryData<PaginatedResult<PostData>>(key, {
          ...data,
          data: nextPosts,
          meta: {
            ...data.meta,
            total: Math.max(0, data.meta.total - 1),
          },
        });
      });

      queryClient.removeQueries({ queryKey: adminQueryKeys.posts.byId(id) });

      return { previousLists, previousPost };
    },
    onError: (error, id, context) => {
      context?.previousLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      if (context?.previousPost) {
        queryClient.setQueryData(adminQueryKeys.posts.byId(id), context.previousPost);
      }

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.stats() });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      showSuccess('Post deleted');
    },
  });
}

export function useBulkDeletePosts() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<
    void,
    unknown,
    string[],
    {
      previousLists: Array<[QueryKey, PaginatedResult<PostData> | undefined]>;
    }
  >({
    mutationFn: (ids) => withSupabaseAuthRetry(() => bulkDeletePosts(ids)),
    meta: mutationMeta,
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.posts.all });

      const previousLists = queryClient.getQueriesData<PaginatedResult<PostData>>({
        queryKey: adminQueryKeys.posts.all,
      });

      previousLists.forEach(([key, data]) => {
        const filters = getPostsFiltersFromKey(key);
        if (!filters || !data) return;

        const nextPosts = data.data.filter((post) => !ids.includes(post.id ?? ''));

        queryClient.setQueryData<PaginatedResult<PostData>>(key, {
          ...data,
          data: nextPosts,
          meta: {
            ...data.meta,
            total: Math.max(0, data.meta.total - (data.data.length - nextPosts.length)),
          },
        });
      });

      ids.forEach((id) => queryClient.removeQueries({ queryKey: adminQueryKeys.posts.byId(id) }));

      return { previousLists };
    },
    onError: (error, _ids, context) => {
      context?.previousLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.stats() });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      showSuccess(`${ids.length} post(s) deleted`);
    },
  });
}

export function useBulkPublishPosts() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<
    void,
    unknown,
    string[],
    {
      previousLists: Array<[QueryKey, PaginatedResult<PostData> | undefined]>;
    }
  >({
    mutationFn: (ids) => withSupabaseAuthRetry(() => bulkPublishPosts(ids)),
    meta: mutationMeta,
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.posts.all });

      const previousLists = queryClient.getQueriesData<PaginatedResult<PostData>>({
        queryKey: adminQueryKeys.posts.all,
      });

      const now = new Date().toISOString();

      previousLists.forEach(([key, data]) => {
        const filters = getPostsFiltersFromKey(key);
        if (!filters || !data) return;

        const next: PostData[] = data.data
          .map((post): PostData => {
            if (!ids.includes(post.id ?? '')) return post;
            return {
              ...post,
              status: 'published',
              published_at: now,
            } as PostData;
          })
          .filter((post) => shouldIncludePostInList(filters, post));

        queryClient.setQueryData<PaginatedResult<PostData>>(key, {
          ...data,
          data: next,
        });
      });

      ids.forEach((id) => {
        const previousPost = queryClient.getQueryData<PostData>(adminQueryKeys.posts.byId(id));
        if (!previousPost) return;

        queryClient.setQueryData<PostData>(adminQueryKeys.posts.byId(id), {
          ...previousPost,
          status: 'published',
          published_at: now,
        });
      });

      return { previousLists };
    },
    onError: (error, _ids, context) => {
      context?.previousLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.stats() });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      showSuccess(`${ids.length} post(s) published`);
    },
  });
}

export function usePublishPost() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<
    PostData,
    unknown,
    { id: string; published_at?: string },
    { previousPost: PostData | undefined }
  >({
    mutationFn: ({ id, published_at }) => withSupabaseAuthRetry(() => publishPost(id, published_at)),
    meta: mutationMeta,
    onMutate: async ({ id, published_at }) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.posts.all });

      const previousPost = queryClient.getQueryData<PostData>(adminQueryKeys.posts.byId(id));
      const nextPublishedAt = published_at ?? new Date().toISOString();

      if (previousPost) {
        queryClient.setQueryData<PostData>(adminQueryKeys.posts.byId(id), {
          ...previousPost,
          status: 'published',
          published_at: nextPublishedAt,
        });
      }

      return { previousPost };
    },
    onError: (error, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(adminQueryKeys.posts.byId(variables.id), context.previousPost);
      }

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts.stats() });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      showSuccess('Post published');
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<
    CategoryData,
    unknown,
    Omit<CategoryData, 'id' | 'created_at'>,
    {
      previousAll: CategoryData[] | undefined;
      previousWithCount: CategoryWithPostCount[] | undefined;
      optimisticId: string;
    }
  >({
    mutationFn: (payload) => withSupabaseAuthRetry(() => createCategory(payload)),
    meta: mutationMeta,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.categories.all });

      const previousAll = queryClient.getQueryData<CategoryData[]>(adminQueryKeys.categories.all);
      const previousWithCount = queryClient.getQueryData<CategoryWithPostCount[]>(
        adminQueryKeys.categories.withCount()
      );

      const optimisticId = `temp-${Date.now()}`;
      const optimisticCategory: CategoryData = {
        ...payload,
        id: optimisticId,
        created_at: new Date().toISOString(),
      };

      if (previousAll) {
        queryClient.setQueryData<CategoryData[]>(adminQueryKeys.categories.all, [
          ...previousAll,
          optimisticCategory,
        ].sort((a, b) => a.name.localeCompare(b.name)));
      }

      if (previousWithCount) {
        queryClient.setQueryData<CategoryWithPostCount[]>(adminQueryKeys.categories.withCount(), [
          ...previousWithCount,
          { ...optimisticCategory, post_count: 0 },
        ].sort((a, b) => a.name.localeCompare(b.name)));
      }

      return { previousAll, previousWithCount, optimisticId };
    },
    onError: (error, _payload, context) => {
      if (context?.previousAll) {
        queryClient.setQueryData(adminQueryKeys.categories.all, context.previousAll);
      }
      if (context?.previousWithCount) {
        queryClient.setQueryData(adminQueryKeys.categories.withCount(), context.previousWithCount);
      }

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: (created, variables, context) => {
      const optimisticId = context?.optimisticId;

      if (optimisticId) {
        const list = queryClient.getQueryData<CategoryData[]>(adminQueryKeys.categories.all);
        if (list) {
          queryClient.setQueryData<CategoryData[]>(
            adminQueryKeys.categories.all,
            list
              .map((cat) => (cat.id === optimisticId ? created : cat))
              .sort((a, b) => a.name.localeCompare(b.name))
          );
        }

        const withCount = queryClient.getQueryData<CategoryWithPostCount[]>(
          adminQueryKeys.categories.withCount()
        );
        if (withCount) {
          queryClient.setQueryData<CategoryWithPostCount[]>(
            adminQueryKeys.categories.withCount(),
            withCount
              .map((cat) =>
                cat.id === optimisticId
                  ? ({ ...created, post_count: 0 } satisfies CategoryWithPostCount)
                  : cat
              )
              .sort((a, b) => a.name.localeCompare(b.name))
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories.withCount() });
      showSuccess(`Category "${variables.name}" created`);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<
    CategoryData,
    unknown,
    { id: string; updates: Partial<CategoryData> },
    {
      previousAll: CategoryData[] | undefined;
      previousWithCount: CategoryWithPostCount[] | undefined;
    }
  >({
    mutationFn: ({ id, updates }) => withSupabaseAuthRetry(() => updateCategory(id, updates)),
    meta: mutationMeta,
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.categories.all });

      const previousAll = queryClient.getQueryData<CategoryData[]>(adminQueryKeys.categories.all);
      const previousWithCount = queryClient.getQueryData<CategoryWithPostCount[]>(
        adminQueryKeys.categories.withCount()
      );

      if (previousAll) {
        queryClient.setQueryData<CategoryData[]>(
          adminQueryKeys.categories.all,
          previousAll
            .map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      }

      if (previousWithCount) {
        queryClient.setQueryData<CategoryWithPostCount[]>(
          adminQueryKeys.categories.withCount(),
          previousWithCount
            .map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      }

      return { previousAll, previousWithCount };
    },
    onError: (error, _variables, context) => {
      if (context?.previousAll) {
        queryClient.setQueryData(adminQueryKeys.categories.all, context.previousAll);
      }
      if (context?.previousWithCount) {
        queryClient.setQueryData(adminQueryKeys.categories.withCount(), context.previousWithCount);
      }

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories.withCount() });
      showSuccess(`Category "${updated.name}" updated`);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<
    void,
    unknown,
    { id: string; name?: string },
    {
      previousAll: CategoryData[] | undefined;
      previousWithCount: CategoryWithPostCount[] | undefined;
    }
  >({
    mutationFn: ({ id }) => withSupabaseAuthRetry(() => deleteCategory(id)),
    meta: mutationMeta,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.categories.all });

      const previousAll = queryClient.getQueryData<CategoryData[]>(adminQueryKeys.categories.all);
      const previousWithCount = queryClient.getQueryData<CategoryWithPostCount[]>(
        adminQueryKeys.categories.withCount()
      );

      if (previousAll) {
        queryClient.setQueryData<CategoryData[]>(
          adminQueryKeys.categories.all,
          previousAll.filter((cat) => cat.id !== id)
        );
      }

      if (previousWithCount) {
        queryClient.setQueryData<CategoryWithPostCount[]>(
          adminQueryKeys.categories.withCount(),
          previousWithCount.filter((cat) => cat.id !== id)
        );
      }

      return { previousAll, previousWithCount };
    },
    onError: (error, _variables, context) => {
      if (context?.previousAll) {
        queryClient.setQueryData(adminQueryKeys.categories.all, context.previousAll);
      }
      if (context?.previousWithCount) {
        queryClient.setQueryData(adminQueryKeys.categories.withCount(), context.previousWithCount);
      }

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories.withCount() });
      showSuccess(
        variables.name ? `Category "${variables.name}" deleted` : 'Category deleted'
      );
    },
  });
}

export function useUploadMedia(userId?: string) {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<
    MediaItem,
    unknown,
    File,
    { previous: MediaItem[] | undefined; optimisticPath: string | null }
  >({
    mutationFn: (file) => {
      if (!userId) throw new Error('Missing user session');
      return withSupabaseAuthRetry(() => uploadMedia(file, userId));
    },
    meta: mutationMeta,
    onMutate: async (file) => {
      if (!userId) return { previous: undefined, optimisticPath: null };

      await queryClient.cancelQueries({ queryKey: ['media'] });

      const key = adminQueryKeys.media.list({ userId });
      const previous = queryClient.getQueryData<MediaItem[]>(key);
      const optimisticPath = `temp-${Date.now()}-${file.name}`;

      queryClient.setQueryData<MediaItem[]>(key, (old) => {
        const list = old ?? [];
        return [
          {
            name: file.name,
            path: optimisticPath,
            url: '',
            created_at: new Date().toISOString(),
            size: file.size,
            type: 'other',
            used_in_posts: 0,
          } satisfies MediaItem,
          ...list,
        ];
      });

      return { previous, optimisticPath };
    },
    onError: (error, _file, context) => {
      if (userId) {
        queryClient.setQueryData(adminQueryKeys.media.list({ userId }), context?.previous);
      }

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      showSuccess('Upload complete');
    },
  });
}

export function useDeleteMedia(userId?: string) {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<
    void,
    unknown,
    string,
    {
      previousList: MediaItem[] | undefined;
    }
  >({
    mutationFn: (path) => withSupabaseAuthRetry(() => deleteMedia(path)),
    meta: mutationMeta,
    onMutate: async (path) => {
      if (!userId) return { previousList: undefined };

      await queryClient.cancelQueries({ queryKey: ['media'] });

      const key = adminQueryKeys.media.list({ userId });
      const previousList = queryClient.getQueryData<MediaItem[]>(key);

      queryClient.setQueryData<MediaItem[]>(key, (old) => {
        if (!old) return old;
        return old.filter((item) => item.path !== path);
      });

      return { previousList };
    },
    onError: (error, _path, context) => {
      if (userId) {
        queryClient.setQueryData(adminQueryKeys.media.list({ userId }), context?.previousList);
      }

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      showSuccess('Media deleted');
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useAdminError();

  return useMutation<void, unknown, SiteSettings, { previous: SiteSettings | undefined }>({
    mutationFn: (settings) => withSupabaseAuthRetry(() => updateSettings(settings)),
    meta: mutationMeta,
    onMutate: async (settings) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.settings.all });

      const previous = queryClient.getQueryData<SiteSettings>(adminQueryKeys.settings.all);
      queryClient.setQueryData(adminQueryKeys.settings.all, settings);
      return { previous };
    },
    onError: (error, _settings, context) => {
      if (context?.previous) {
        queryClient.setQueryData(adminQueryKeys.settings.all, context.previous);
      }

      const parsed = AdminErrorHandler.parse(error);
      showError(parsed.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.settings.all });
      showSuccess('Settings saved successfully');
    },
  });
}
