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

  // Auto-save function with timeout and cancellation
  const cancelTokenRef = useRef<boolean>(false);
  
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
        let attempts = 0;
        const maxRetries = 3;
        
        // Retry logic with exponential backoff
        while (attempts < maxRetries) {
          try {
            if (postId) {
              // Update existing post with retry logic
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
            
            // Success! Break out of retry loop
            break;
          } catch (error) {
            attempts++;
            console.error(`Save attempt ${attempts} failed:`, error);
            
            if (attempts >= maxRetries) {
              throw error;
            }
            
            // Wait with exponential backoff before retry
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
            
            // Check if request was cancelled between attempts
            if (cancelTokenRef.current) {
              return;
            }
          }
        }

        // Check if request was cancelled
        if (cancelTokenRef.current) {
          return;
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
        
        // If auth/network error, trigger session recovery
        if (errorMessage.includes('Auth') || errorMessage.includes('Network')) {
          onError?.('Connection issues detected. Please check your internet connection.');
        }
      } finally {
        setIsSaving(false);
      }
    },
    [postId, onError, onSuccess]
  );

  // Create debounced auto-save (10 second delay for larger content)
  useEffect(() => {
    debouncedSaveRef.current = debounce(
      (stateToSave: EditorState) => {
        // Queue cancellation token for long-running saves
        cancelTokenRef.current = false;
        performSave(stateToSave);
      },
      10000, // Increased from 5s to 10s to handle larger content gracefully
      { leading: false, trailing: true }
    );

    return () => {
      debouncedSaveRef.current?.cancel();
      cancelTokenRef.current = true; // Cancel any in-flight request
    };
  }, [performSave]);

  // Network status awareness - cancel if disconnected
  useEffect(() => {
    const handleOnline = () => {
      // Re-enable saving when back online
      if (isDirty && postId) {
        debouncedSaveRef.current?.(state);
      }
    };
    
    const handleOffline = () => {
      // Cancel any pending saves when offline
      cancelTokenRef.current = true;
      debouncedSaveRef.current?.cancel();
      onError?.('You appear to be offline. Changes will be saved when connection is restored.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state, isDirty, postId, onError]);

  // Tab visibility awareness - disable autosave when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - cancel pending saves
        cancelTokenRef.current = true;
        debouncedSaveRef.current?.cancel();
      } else {
        // Tab is visible again - re-enable autosave if there are changes
        cancelTokenRef.current = false;
        if (isDirty && postId) {
          // Debounce re-engagement to allow network to stabilize
          setTimeout(() => {
            debouncedSaveRef.current?.(state);
          }, 2000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state, isDirty, postId]);

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
