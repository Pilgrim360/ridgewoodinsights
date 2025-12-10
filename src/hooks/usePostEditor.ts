'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { updatePost } from '@/lib/admin/posts';
import { isContentValid } from '@/lib/admin/html';

export interface EditorState {
  title: string;
  slug: string;
  content: string;
  category_id: string | null;
  cover_image: string | null;
  status: 'draft' | 'published' | 'scheduled';
  excerpt: string;
  published_at?: string;
}

export interface UsePostEditorOptions {
  postId?: string;
  initialState: EditorState;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export function usePostEditor({
  postId,
  initialState,
  onError,
  onSuccess,
}: UsePostEditorOptions) {
  const [state, setState] = useState<EditorState>(initialState);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const debouncedSaveRef = useRef<ReturnType<typeof debounce>>(null);

  // Auto-save function
  const performSave = useCallback(
    async (stateToSave: EditorState) => {
      if (!postId) return;

      try {
        setIsSaving(true);
        setSaveError(null);

        // Validate content
        if (!isContentValid(stateToSave.content)) {
          throw new Error('Content cannot be empty');
        }

        // Update post via API
        await updatePost(postId, {
          title: stateToSave.title,
          slug: stateToSave.slug,
          content: stateToSave.content,
          category_id: stateToSave.category_id,
          cover_image: stateToSave.cover_image,
          excerpt: stateToSave.excerpt,
          status: stateToSave.status,
          published_at: stateToSave.published_at,
        });

        setLastSaved(new Date());
        setIsDirty(false);
        onSuccess?.('Post saved successfully');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to save post';
        setSaveError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [postId, onError, onSuccess]
  );

  // Create debounced auto-save (2 second delay)
  useEffect(() => {
    debouncedSaveRef.current = debounce(
      (stateToSave: EditorState) => {
        performSave(stateToSave);
      },
      2000,
      { leading: false, trailing: true }
    );

    return () => {
      debouncedSaveRef.current?.cancel();
    };
  }, [performSave]);

  // Trigger auto-save when state changes
  useEffect(() => {
    if (!postId || !isDirty) return;

    debouncedSaveRef.current?.(state);
  }, [state, isDirty, postId]);

  // Handle field changes
  const updateField = useCallback(
    <K extends keyof EditorState>(field: K, value: EditorState[K]) => {
      setState((prev) => ({
        ...prev,
        [field]: value,
      }));
      setIsDirty(true);
    },
    []
  );

  // Explicit save (Ctrl+S / Cmd+S)
  const explicitSave = useCallback(async () => {
    debouncedSaveRef.current?.cancel();
    await performSave(state);
  }, [state, performSave]);

  // Keyboard shortcut handler (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        explicitSave();
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
    performSave: performSave as (stateToSave: EditorState) => Promise<void>,
  };
}
