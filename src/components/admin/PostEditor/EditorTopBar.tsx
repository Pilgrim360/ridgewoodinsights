'use client';

import Link from 'next/link';
import { EditorState } from '@/hooks/usePostEditor';
import { cn } from '@/lib/utils';

interface EditorTopBarProps {
  state: EditorState;
  updateField: <K extends keyof EditorState>(
    field: K,
    value: EditorState[K]
  ) => void;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
  disabled?: boolean;
}

export function EditorTopBar({
  state,
  updateField,
  isDirty,
  isSaving,
  lastSaved,
  saveError,
  onSave,
  onPublish,
  disabled,
}: EditorTopBarProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('title', e.target.value);
  };

  return (
    <div className="sticky top-0 z-10 border-b border-surface bg-white">
      <div className="px-6 py-4 space-y-4">
        {/* Title and back link */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/admin/posts"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Posts
          </Link>
          <div className="flex items-center gap-2 text-sm">
            {saveError && (
              <span className="text-red-600" role="alert">
                {saveError}
              </span>
            )}
            {isSaving && (
              <span className="text-text/60 flex items-center gap-1">
                <div className="h-3 w-3 animate-spin rounded-full border border-text/30 border-t-text" />
                Saving...
              </span>
            )}
            {!isSaving && !isDirty && lastSaved && (
              <span className="text-text/60">
                Saved {formatRelativeTime(lastSaved)}
              </span>
            )}
            {isDirty && !isSaving && (
              <span className="text-amber-600">Changes not saved</span>
            )}
          </div>
        </div>

        {/* Title input */}
        <input
          type="text"
          value={state.title}
          onChange={handleTitleChange}
          disabled={disabled}
          placeholder="Post title..."
          className="w-full text-2xl font-bold text-secondary bg-transparent focus:outline-none placeholder:text-text/30 disabled:text-text/50"
        />
      </div>

      {/* Action buttons */}
      <div className="px-6 py-3 bg-background border-t border-surface flex justify-end gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={disabled || !isDirty || isSaving}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            disabled || !isDirty || isSaving
              ? 'bg-surface text-text/50 cursor-not-allowed'
              : 'bg-white border border-surface text-secondary hover:bg-surface'
          )}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={disabled || isSaving || !state.title || !state.slug}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors',
            disabled || isSaving || !state.title || !state.slug
              ? 'bg-primary/50 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90'
          )}
          title={!state.title || !state.slug ? 'Title and slug are required' : undefined}
        >
          {state.status === 'published' ? 'Update' : 'Publish'}
        </button>
      </div>
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
