'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Handle keyboard shortcuts for sidebar toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + \ to toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === '\\') {
        event.preventDefault();
        if (window.innerWidth >= 1024) {
          setSidebarCollapsed(prev => !prev);
        } else {
          setIsMobileSidebarOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileSidebarOpen]);

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
      {/* Mobile toggle button */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          icon={isMobileSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        >
          {isMobileSidebarOpen ? 'Hide Settings' : 'Show Settings'}
        </Button>
      </div>

      <div className="flex-1 relative">
        {/* Main content area */}
        <div className={cn(
          "h-full transition-all duration-300",
          "lg:pr-80", // Always reserve space on desktop for sidebar when visible
          sidebarCollapsed ? "lg:pr-4" : "lg:pr-80" // Adjust padding based on collapsed state
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

        {/* Desktop sidebar toggle button - positioned over content */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            "hidden lg:flex absolute top-4 z-40",
            sidebarCollapsed ? "right-4" : "right-80", // Position over sidebar when visible, over content when hidden
            "bg-white border border-surface shadow-lg hover:shadow-xl",
            "transition-all duration-300"
          )}
          title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
          icon={sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        />

        {/* Desktop sidebar - fixed positioning */}
        <div className={cn(
          "hidden lg:block fixed top-0 right-0 h-full w-80 z-30",
          "transform transition-transform duration-300 ease-in-out",
          sidebarCollapsed ? "translate-x-full" : "translate-x-0"
        )}>
          <div className="sticky top-4 m-4 space-y-6">
            <div className="bg-white border border-surface rounded-lg p-4 pointer-events-auto h-fit">
              <EditorSidebar
                state={state}
                updateField={updateFieldWithNull}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            
            {/* Sidebar */}
            <div className="relative ml-auto w-full max-w-sm h-full bg-white border-l border-surface shadow-2xl transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                {/* Mobile sidebar header */}
                <div className="flex items-center justify-between p-4 border-b border-surface">
                  <h3 className="text-lg font-semibold text-secondary">Post Settings</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    icon={<ChevronLeft className="h-4 w-4" />}
                    aria-label="Close sidebar"
                  >
                    Close
                  </Button>
                </div>
                
                {/* Mobile sidebar content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <EditorSidebar
                    state={state}
                    updateField={updateFieldWithNull}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          </div>
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
        
        {/* Keyboard shortcut hint */}
        <span className="text-text/40 ml-3 text-xs" title="Toggle sidebar (Ctrl + \)">
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
