'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { isContentValid } from '@/lib/cms/html';
import { PostData } from '@/types/cms';
import { useCreatePost, useUpdatePost } from '@/hooks/queries/useCmsMutations';

export interface EditorState {
  title: string;
  slug: string;
  content: string;
  category_id: string | null;
  cover_image: string | null;
  status: 'draft' | 'published' | 'scheduled';
  excerpt: string;
  published_at?: string;
  author_id?: string;
  disclaimer_type?: 'none' | 'general' | 'legal';
}

export interface UsePostEditorOptions {
  postId?: string;
  initialState: EditorState;
}

export function usePostEditor({ postId, initialState }: UsePostEditorOptions) {
  const [state, setState] = useState<EditorState>(initialState);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateMutation = useUpdatePost();
  const createMutation = useCreatePost();

  const isSaving = updateMutation.isPending || createMutation.isPending;

  const savingLockRef = useRef(false);
  const currentSavePromise = useRef<Promise<PostData | undefined> | null>(null);

  /**
   * Performs an action while ensuring no other save actions are running.
   * If a save is already in progress, it waits for it to complete.
   */
  const performLockedAction = useCallback(
    async (action: () => Promise<PostData | undefined>): Promise<PostData | undefined> => {
      // Wait for any in-flight save to finish
      if (currentSavePromise.current) {
        await currentSavePromise.current;
      }

      const promise = (async () => {
        try {
          savingLockRef.current = true;
          return await action();
        } finally {
          savingLockRef.current = false;
          currentSavePromise.current = null;
        }
      })();

      currentSavePromise.current = promise;
      return promise;
    },
    []
  );

  const saveDraftOrUpdate = useCallback(
    async (stateToSave: EditorState): Promise<PostData | undefined> => {
      if (!postId && !stateToSave.title.trim()) return;

      setSaveError(null);

      try {
        if (stateToSave.status === 'published' && !isContentValid(stateToSave.content)) {
          throw new Error('Content cannot be empty for published posts');
        }

        if (postId) {
          const saved = await updateMutation.mutateAsync({
            id: postId,
            updates: {
              title: stateToSave.title,
              slug: stateToSave.slug,
              content: stateToSave.content,
              category_id: stateToSave.category_id,
              cover_image: stateToSave.cover_image,
              excerpt: stateToSave.excerpt,
              status: stateToSave.status,
              published_at: stateToSave.published_at,
              disclaimer_type: stateToSave.disclaimer_type,
            },
          });

          setLastSaved(new Date());
          setIsDirty(false);
          return saved;
        }

        const created = await createMutation.mutateAsync({
          title: stateToSave.title || 'Untitled Post',
          slug: stateToSave.slug || `post-${Date.now()}`,
          content: stateToSave.content,
          category_id: stateToSave.category_id,
          cover_image: stateToSave.cover_image,
          excerpt: stateToSave.excerpt,
          status: stateToSave.status || 'draft',
          author_id: stateToSave.author_id,
          disclaimer_type: stateToSave.disclaimer_type,
        });

        setLastSaved(new Date());
        setIsDirty(false);
        return created;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to save post';
        setSaveError(errorMessage);
        return undefined;
      }
    },
    [createMutation, postId, updateMutation]
  );

  const debouncedAutoSave = useMemo(
    () =>
      debounce(
        (nextState: EditorState) => {
          // For auto-saves, if a lock is held, we just skip it because
          // a more important save (manual or auto) is already happening.
          if (savingLockRef.current) return;
          void performLockedAction(() => saveDraftOrUpdate(nextState));
        },
        300,
        { leading: false, trailing: true }
      ),
    [performLockedAction, saveDraftOrUpdate]
  );

  useEffect(() => {
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

  useEffect(() => {
    if (!postId || !isDirty) return;
    debouncedAutoSave(state);
  }, [state, isDirty, postId, debouncedAutoSave]);

  const updateField = useCallback(<K extends keyof EditorState>(field: K, value: EditorState[K]) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  }, []);

  const explicitSave = useCallback(async () => {
    debouncedAutoSave.cancel();
    return await performLockedAction(() => saveDraftOrUpdate(state));
  }, [debouncedAutoSave, performLockedAction, saveDraftOrUpdate, state]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        void explicitSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [explicitSave]);

  return {
    state,
    updateField,
    isDirty,
    isSaving,
    lastSaved,
    saveError,
    explicitSave,
    performSave: saveDraftOrUpdate,
    performLockedAction,
  };
}
