'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminError } from '@/contexts/AdminErrorContext';
import { usePostEditor, EditorState } from '@/hooks/usePostEditor';
import { updatePost } from '@/lib/admin/posts';
import { EditorSidebar } from './EditorSidebar';
import { TipTapEditor } from './TipTapEditor';

interface EditorProps {
  postId?: string;
  initialData?: Partial<EditorState>;
}

const DEFAULT_STATE: EditorState = {
  title: '',
  slug: '',
  content: '',
  category_id: null,
  cover_image: null,
  status: 'draft',
  excerpt: '',
  disclaimer_type: 'none',
};

export function Editor({ postId, initialData }: EditorProps) {
  const router = useRouter();
  const { showSuccess, showError } = useAdminError();

  const initialState: EditorState = {
    ...DEFAULT_STATE,
    ...initialData,
  };

  const {
    state,
    updateField,
    isDirty,
    isSaving,
    lastSaved,
    saveError,
    explicitSave,
    performSave,
  } = usePostEditor({
    postId,
    initialState,
    onError: (error) => showError(error),
    onSuccess: (message) => showSuccess(message),
  });

  const handlePublish = useCallback(async () => {
    if (!state.title || !state.slug) {
      showError('Title and slug are required');
      return;
    }

    try {
      // If we don't have a postId yet, save first then publish
      let currentPostId = postId;
      
      if (!currentPostId) {
        const savedPost = await performSave(state);
        if (savedPost && savedPost.id) {
          currentPostId = savedPost.id;
        } else {
           throw new Error('Failed to create post before publishing');
        }
      }

      await updatePost(currentPostId!, {
        ...state,
        status: 'published',
      });

      showSuccess('Post published successfully');
      router.refresh();
      router.push(`/admin/posts`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to publish post';
      showError(errorMessage);
    }
  }, [postId, state, showSuccess, showError, router]);

  const updateFieldWithNull = <K extends keyof EditorState>(
    field: K,
    value: EditorState[K] | null
  ) => {
    updateField(field, value as EditorState[K]);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto flex gap-4 p-4">
        {/* Editor (main) */}
        <div className="flex-1 min-w-0">
          <TipTapEditor
            title={state.title}
            onTitleChange={(value) => updateField('title', value)}
            content={state.content}
            onChange={(value) => updateField('content', value)}
            disabled={isSaving}
            onError={showError}
            isDirty={isDirty}
            isSaving={isSaving}
            lastSaved={lastSaved}
            saveError={saveError}
            postStatus={state.status}
            onSave={explicitSave}
            onPublish={handlePublish}
            canPublish={Boolean(state.title.trim()) && Boolean(state.slug.trim())}
            publishDisabledReason={
              !state.title.trim() || !state.slug.trim() ? 'Title and slug are required' : undefined
            }
          />
        </div>

        {/* Sidebar (metadata) */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-4 space-y-6">
            <div className="bg-white border border-surface rounded-lg p-4">
              <EditorSidebar
                state={state}
                updateField={updateFieldWithNull}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
