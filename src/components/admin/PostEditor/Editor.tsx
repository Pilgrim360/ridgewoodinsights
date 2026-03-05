'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Clock, Loader2 } from 'lucide-react';

import { useAdminError } from '@/contexts/AdminErrorContext';
import { usePostEditor, EditorState } from '@/hooks/usePostEditor';
import { usePublishPost } from '@/hooks/queries/useAdminMutations';
import { cn } from '@/lib/utils';

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
  const { showError } = useAdminError();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const publishMutation = usePublishPost();

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
  });

  const handlePublish = useCallback(async () => {
    if (!state.title || !state.slug) {
      showError('Title and slug are required');
      return;
    }

    try {
      let currentPostId = postId;

      const savedPost = await performSave(state);
      if (!currentPostId && savedPost?.id) {
        currentPostId = savedPost.id;
      }

      if (!currentPostId) return;

      await publishMutation.mutateAsync({
        id: currentPostId,
        published_at: state.published_at,
      });

      router.refresh();
      router.push('/admin/posts');
    } catch {
      // Errors are already surfaced via the global admin toast system.
    }
  }, [performSave, postId, publishMutation, router, showError, state]);

  const updateFieldWithNull = <K extends keyof EditorState>(
    field: K,
    value: EditorState[K] | null
  ) => {
    updateField(field, value as EditorState[K]);
  };

  const canPublish = Boolean(state.title.trim()) && Boolean(state.slug.trim());
  const publishDisabledReason = canPublish ? undefined : 'Title and slug are required';

  const isBusy = isSaving || publishMutation.isPending;
  const editorDisabled = publishMutation.isPending;

  return (
    <div className="h-full flex flex-col pointer-events-auto">
      {/* Local Action Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-secondary">
            {postId ? 'Edit Post' : 'New Post'}
          </h1>
        </div>
        <EditorHeaderActions
          isDirty={isDirty}
          isSaving={isBusy}
          lastSaved={lastSaved}
          saveError={saveError}
          onSave={explicitSave}
          onPublish={handlePublish}
          canPublish={canPublish}
          publishDisabledReason={publishDisabledReason}
          postStatus={state.status}
        />
      </div>

      <div className="flex-1 overflow-visible flex flex-col lg:flex-row pointer-events-auto relative">
        <div className="flex-1 min-w-0 pointer-events-auto">
          <div className="max-w-4xl w-full">
            <TipTapEditor
              title={state.title}
              onTitleChange={(value) => updateField('title', value)}
              content={state.content}
              onChange={(value) => updateField('content', value)}
              disabled={editorDisabled}
              onError={showError}
            />
          </div>
        </div>

        <div
          className={cn(
            'flex-shrink-0 transition-all duration-300 ease-in-out relative pointer-events-auto',
            'w-full mt-8 lg:mt-0',
            isSidebarOpen ? 'lg:w-80 lg:ml-12' : 'lg:w-0 lg:ml-0'
          )}
        >
          <div className="sticky top-24">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                'hidden lg:flex absolute top-6 z-10',
                'items-center justify-center w-5 h-12',
                'bg-white border border-surface border-r-0 rounded-l-md shadow-sm',
                'text-secondary hover:text-primary transition-colors',
                '-left-5'
              )}
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarOpen ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>

            <div
              className={cn(
                'space-y-6 lg:w-80',
                isSidebarOpen ? 'opacity-100 visible' : 'lg:opacity-0 lg:invisible',
                'transition-all duration-300'
              )}
            >
              <div className="bg-white border border-surface rounded-xl p-6 pointer-events-auto">
                <EditorSidebar
                  state={state}
                  updateField={updateFieldWithNull}
                  disabled={editorDisabled}
                />
              </div>
            </div>
          </div>
        </div>
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
    <div className="flex items-center gap-4">
      {/* Save status indicator */}
      <div className="hidden sm:flex items-center text-[11px] font-bold uppercase tracking-wider">
        {saveError ? (
          <span className="flex items-center gap-1.5 text-red-600" role="alert">
            <AlertCircle className="w-3.5 h-3.5" />
            Save failed
          </span>
        ) : isSaving ? (
          <span className="flex items-center gap-1.5 text-text/50">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Saving…
          </span>
        ) : isDirty ? (
          <span className="flex items-center gap-1.5 text-amber-600">
            <Clock className="w-3.5 h-3.5" />
            Unsaved
          </span>
        ) : lastSaved ? (
          <span className="flex items-center gap-1.5 text-text/30">
            <Check className="w-3.5 h-3.5" />
            Saved {formatRelativeTime(lastSaved)}
          </span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => void onSave()}
        disabled={!isDirty || isSaving}
        className={cn(
          'h-9 px-4 rounded font-bold text-xs uppercase tracking-widest transition-all',
          !isDirty || isSaving
            ? 'bg-surface text-text/40 cursor-not-allowed'
            : 'bg-white text-secondary border border-surface hover:bg-surface'
        )}
      >
        Save Draft
      </button>

      <button
        type="button"
        onClick={() => void onPublish()}
        disabled={publishDisabled}
        className={cn(
          'h-9 px-4 rounded font-bold text-xs uppercase tracking-widest text-white transition-all shadow-sm active:scale-95',
          publishDisabled
            ? 'bg-primary/50 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-dark'
        )}
        title={publishDisabledReason}
      >
        {isSaving ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {postStatus === 'published' ? 'Updating…' : 'Publishing…'}
          </span>
        ) : postStatus === 'published' ? (
          'Update Post'
        ) : (
          'Publish Post'
        )}
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

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
