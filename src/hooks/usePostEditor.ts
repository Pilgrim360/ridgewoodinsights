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
  author_id?: string;
  disclaimer_type?: 'none' | 'general' | 'legal';
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
      // If no postId and no title, don't create ghost draft
      if (!postId && !stateToSave.title) return;

      try {
        setIsSaving(true);
        setSaveError(null);

        // Validate content if we have an ID (strict mode) or if user is trying to publish
        if (stateToSave.status === 'published' && !isContentValid(stateToSave.content)) {
          throw new Error('Content cannot be empty for published posts');
        }

        let savedPost;
        
        if (postId) {
          // Update existing post
          savedPost = await updatePost(postId, {
            title: stateToSave.title,
            slug: stateToSave.slug,
            content: stateToSave.content,
            category_id: stateToSave.category_id,
            cover_image: stateToSave.cover_image,
            excerpt: stateToSave.excerpt,
            status: stateToSave.status,
            published_at: stateToSave.published_at,
            disclaimer_type: stateToSave.disclaimer_type,
          });
        } else {
          // Create new post (first save)
          // Dynamically import createPost to avoid circular dependency if possible, or assume it's available
          const { createPost } = await import('@/lib/admin/posts');
          
          savedPost = await createPost({
            title: stateToSave.title || 'Untitled Post',
            slug: stateToSave.slug || `post-${Date.now()}`,
            content: stateToSave.content,
            category_id: stateToSave.category_id,
            cover_image: stateToSave.cover_image,
            excerpt: stateToSave.excerpt,
            status: 'draft', // Always start as draft
            author_id: stateToSave.author_id,
            disclaimer_type: stateToSave.disclaimer_type,
          });
        }

        setLastSaved(new Date());
        setIsDirty(false);
        onSuccess?.(postId ? 'Post saved successfully' : 'Draft created');
        
        return savedPost;
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

  // Create debounced auto-save (5 second delay)
  useEffect(() => {
    debouncedSaveRef.current = debounce(
      (stateToSave: EditorState) => {
        performSave(stateToSave);
      },
      5000,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    performSave: performSave as (stateToSave: EditorState) => Promise<any>,
  };
}
