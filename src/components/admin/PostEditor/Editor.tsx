'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAdminError } from '@/contexts/AdminErrorContext';
import { useAdminHeaderSlots } from '@/contexts/AdminHeaderSlotsContext';
import { usePostEditor, EditorState } from '@/hooks/usePostEditor';
import { updatePost } from '@/lib/admin/posts';
import { cn } from '@/lib/utils';

import { useSidebarVisibility } from '@/hooks/useSidebarVisibility';
import { EditorSidebar } from './EditorSidebar';
import { SidebarToggle } from './SidebarToggle';
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
  const { setActions, setSidebarToggle } = useAdminHeaderSlots();

  const {
    isVisible: isSidebarVisible,
    isMobile: isSidebarMobile,
    toggle: toggleSidebar,
    isMounted: isSidebarMounted,
  } = useSidebarVisibility();

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
  }, [postId, state, showSuccess, showError, router, performSave]);

  const updateFieldWithNull = <K extends keyof EditorState>(
    field: K,
    value: EditorState[K] | null
  ) => {
    updateField(field, value as EditorState[K]);
  };

  const canPublish = Boolean(state.title.trim()) && Boolean(state.slug.trim());
  const publishDisabledReason = canPublish ? undefined : 'Title and slug are required';

  useEffect(() => {
    setActions(
      <EditorHeaderActions
        isDirty={isDirty}
        isSaving={isSaving}
        lastSaved={lastSaved}
        saveError={saveError}
        onSave={explicitSave}
        onPublish={handlePublish}
        canPublish={canPublish}
        publishDisabledReason={publishDisabledReason}
        postStatus={state.status}
      />
    );

    if (isSidebarMobile) {
      setSidebarToggle(
        <SidebarToggle
          onClick={toggleSidebar}
          isVisible={isSidebarVisible}
          className="absolute top-1/2 -translate-y-1/2 right-4 lg:hidden"
        />
      );
    }

    return () => {
      setActions(null);
      setSidebarToggle(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDirty,
    isSaving,
    lastSaved,
    saveError,
    state.status,
    isSidebarMobile,
    isSidebarVisible,
    toggleSidebar,
  ]);

  if (!isSidebarMounted) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto flex gap-4">
        <div className="flex-1 min-w-0">
          <TipTapEditor
            title={state.title}
            onTitleChange={(value) => updateField('title', value)}
            content={state.content}
            onChange={(value) => updateField('content', value)}
            disabled={isSaving}
            onError={showError}
          />
        </div>

        <div
          className={cn(
            'flex-shrink-0 transition-all duration-300 ease-in-out',
            isSidebarMobile
              ? 'fixed inset-y-0 right-0 z-20 w-80 bg-white border-l border-surface transform'
              : 'relative',
            isSidebarVisible
              ? 'w-80'
              : 'w-0',
            isSidebarMobile && (isSidebarVisible ? 'translate-x-0' : 'translate-x-full')
          )}
        >
          {!isSidebarMobile && (
            <SidebarToggle
              onClick={toggleSidebar}
              isVisible={isSidebarVisible}
            />
          )}

          <div
            className={cn(
              'sticky top-4 space-y-6 overflow-hidden',
              isSidebarVisible ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="bg-white border border-surface rounded-lg p-4">
              <EditorSidebar
                state={state}
                updateField={updateFieldWithNull}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        {isSidebarVisible && isSidebarMobile && (
          <div
            className="fixed inset-0 bg-black/20 z-10"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

interface EditorHeaderActionsProps {
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
  canPublish: boolean;
  publishDisabledReason?: string;
  postStatus: 'draft' | 'published' | 'scheduled';
}

function EditorHeaderActions({
  isDirty,
  isSaving,
  lastSaved,
  saveError,
  onSave,
  onPublish,
  canPublish,
  publishDisabledReason,
  postStatus,
}: EditorHeaderActionsProps) {
  const publishDisabled = isSaving || !canPublish;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center text-sm">
        {saveError ? (
          <span className="text-red-600" role="alert">
            {saveError}
          </span>
        ) : isSaving ? (
          <span className="text-text/60 inline-flex items-center gap-2">
            <span className="h-3 w-3 animate-spin rounded-full border border-text/30 border-t-text" />
            Saving…
          </span>
        ) : isDirty ? (
          <span className="text-amber-600">Unsaved changes</span>
        ) : lastSaved ? (
          <span className="text-text/60">Saved {formatRelativeTime(lastSaved)}</span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => void onSave()}
        disabled={!isDirty || isSaving}
        className={cn(
          'h-9 px-3 rounded-md text-sm font-medium transition-colors border',
          !isDirty || isSaving
            ? 'bg-surface text-text/50 border-surface cursor-not-allowed'
            : 'bg-white text-secondary border-surface hover:bg-surface'
        )}
      >
        {isSaving ? 'Saving…' : 'Save'}
      </button>

      <button
        type="button"
        onClick={() => void onPublish()}
        disabled={publishDisabled}
        className={cn(
          'h-9 px-3 rounded-md text-sm font-medium text-white transition-colors',
          publishDisabled
            ? 'bg-primary/50 cursor-not-allowed'
            : 'bg-primary hover:bg-primary/90'
        )}
        title={publishDisabledReason}
      >
        {postStatus === 'published' ? 'Update' : 'Publish'}
      </button>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
