'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

import { useAdminError } from '@/contexts/AdminErrorContext';
import { useAdminHeaderSlots } from '@/contexts/AdminHeaderSlotsContext';
import { usePostEditor, EditorState } from '@/hooks/usePostEditor';
import { updatePost } from '@/lib/admin/posts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

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
  const { setActions } = useAdminHeaderSlots();

  // Sidebar state for collapsible functionality
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  // Handle keyboard shortcuts for sidebar toggle (desktop only)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle desktop shortcuts
      if (window.innerWidth < 1024) return;
      
      // Ctrl/Cmd + \ to toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === '\\') {
        event.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

    return () => {
      setActions(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, isSaving, lastSaved, saveError, state.status]);

  return (
    <div className="h-full flex flex-col bg-background pointer-events-auto">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main content area */}
        <div className={cn(
          "flex-1 min-w-0 overflow-y-auto transition-all duration-300",
          "lg:pr-0" // No padding needed with proper flex layout
        )}>
          <TipTapEditor
            title={state.title}
            onTitleChange={(value) => updateField('title', value)}
            content={state.content}
            onChange={(value) => updateField('content', value)}
            disabled={isSaving}
            onError={showError}
          />
        </div>

        {/* Desktop sidebar - normal flow, not fixed */}
        <div className={cn(
          "hidden lg:flex flex-col w-80 flex-shrink-0 transition-all duration-300",
          sidebarCollapsed ? "w-0" : "w-80"
        )}>
          {sidebarCollapsed ? (
            /* Collapsed state - just show toggle button */
            <div className="w-16 flex flex-col items-center py-4 border-l border-surface bg-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(false)}
                className="mb-4"
                title="Show sidebar"
                icon={<ChevronRight className="h-4 w-4" />}
              />
            </div>
          ) : (
            /* Expanded sidebar */
            <div className="w-80 flex flex-col h-full border-l border-surface bg-white">
              {/* Sidebar header with toggle */}
              <div className="flex items-center justify-between p-4 border-b border-surface flex-shrink-0">
                <h3 className="text-lg font-semibold text-secondary">Post Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(true)}
                  title="Hide sidebar"
                  icon={<ChevronLeft className="h-4 w-4" />}
                />
              </div>
              
              {/* Sidebar content - scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                <EditorSidebar
                  state={state}
                  updateField={updateFieldWithNull}
                  disabled={isSaving}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile sidebar - shown below main content */}
        <div className="lg:hidden border-t border-surface bg-white">
          {/* Mobile toggle */}
          <div className="p-4 border-b border-surface">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="w-full justify-center"
              icon={isMobileSidebarOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            >
              {isMobileSidebarOpen ? 'Hide Settings' : 'Show Settings'}
            </Button>
          </div>
          
          {/* Mobile sidebar content */}
          {isMobileSidebarOpen && (
            <div className="overflow-y-auto">
              <div className="p-4">
                <EditorSidebar
                  state={state}
                  updateField={updateFieldWithNull}
                  disabled={isSaving}
                />
              </div>
            </div>
          )}
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
        
        {/* Keyboard shortcut hint */}
        <span className="text-text/40 ml-3 text-xs hidden lg:inline" title="Toggle sidebar (Ctrl + \)">
          Ctrl+\ to toggle sidebar
        </span>
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
