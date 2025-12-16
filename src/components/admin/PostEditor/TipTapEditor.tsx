'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';

import { uploadPostImage } from '@/lib/admin/storage';
import { cn } from '@/lib/utils';
import { createPostEditorExtensions } from '@/lib/tiptap/editorExtensions';
import { sanitizePastedHtml } from '@/lib/tiptap/sanitize';
import { getTocHeadings, type TocHeading } from '@/lib/tiptap/toc';

import { EditorTableBubbleMenu } from './EditorTableBubbleMenu';
import { EditorToolbar } from './EditorToolbar';

export interface TipTapEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
  characterLimit?: number;
  onError?: (message: string) => void;

  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  postStatus: 'draft' | 'published' | 'scheduled';
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
  canPublish: boolean;
  publishDisabledReason?: string;
}

export function TipTapEditor({
  title,
  onTitleChange,
  content,
  onChange,
  disabled,
  characterLimit = 50000,
  onError,
  isDirty,
  isSaving,
  lastSaved,
  saveError,
  postStatus,
  onSave,
  onPublish,
  canPublish,
  publishDisabledReason,
}: TipTapEditorProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [isPastingUpload, setIsPastingUpload] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  const editor = useEditor({
    extensions: createPostEditorExtensions({
      placeholder: 'Write your post…',
      characterLimit,
    }),
    content,
    editable: !disabled,
    onCreate: ({ editor: ed }) => {
      editorRef.current = ed;
      setHeadings(getTocHeadings(ed));
    },
    onDestroy: () => {
      editorRef.current = null;
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
      setHeadings(getTocHeadings(ed));
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none',
          'prose-headings:text-secondary prose-p:text-text',
          'prose-a:text-primary',
          'min-h-[28rem] px-4 py-4 outline-none'
        ),
      },
      transformPastedHTML: sanitizePastedHtml,
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        const imageFiles = files.filter((file) => file.type.startsWith('image/'));

        if (imageFiles.length === 0) return false;

        void (async () => {
          setIsPastingUpload(true);
          try {
            for (const file of imageFiles) {
              const url = await uploadPostImage(file);
              editorRef.current
                ?.chain()
                .focus()
                .setImage({
                  src: url,
                  alt: file.name,
                })
                .run();
            }
          } catch (error) {
            onError?.(error instanceof Error ? error.message : 'Paste upload failed');
          } finally {
            setIsPastingUpload(false);
          }
        })();

        return true;
      },
      handleDrop: (_view, event) => {
        const dt = event.dataTransfer;
        if (!dt) return false;

        const files = Array.from(dt.files ?? []);
        const imageFiles = files.filter((file) => file.type.startsWith('image/'));

        if (imageFiles.length === 0) return false;

        void (async () => {
          setIsPastingUpload(true);
          try {
            for (const file of imageFiles) {
              const url = await uploadPostImage(file);
              editorRef.current
                ?.chain()
                .focus()
                .setImage({
                  src: url,
                  alt: file.name,
                })
                .run();
            }
          } catch (error) {
            onError?.(error instanceof Error ? error.message : 'Drop upload failed');
          } finally {
            setIsPastingUpload(false);
          }
        })();

        return true;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    setHeadings(getTocHeadings(editor));
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  const stats = useMemo(() => {
    if (!editor) {
      return {
        words: 0,
      };
    }

    return {
      words: editor.storage.characterCount.words(),
    };
  }, [editor, editor?.state]);

  if (!editor) return null;

  const publishDisabled = isSaving || !canPublish;
  const publishTitle = publishDisabledReason;

  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-20 border-b border-surface bg-background/95 backdrop-blur">
        <div className="px-4 py-2">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/posts"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              ← Posts
            </Link>

            <SaveStatus
              isDirty={isDirty}
              isSaving={isSaving}
              lastSaved={lastSaved}
              saveError={saveError}
            />

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => void onSave()}
                disabled={disabled || !isDirty || isSaving}
                className={cn(
                  'h-9 px-3 rounded-md text-sm font-medium transition-colors border',
                  disabled || !isDirty || isSaving
                    ? 'bg-surface text-text/50 border-surface cursor-not-allowed'
                    : 'bg-white text-secondary border-surface hover:bg-surface'
                )}
              >
                {isSaving ? 'Saving…' : 'Save'}
              </button>

              <button
                type="button"
                onClick={() => void onPublish()}
                disabled={disabled || publishDisabled}
                className={cn(
                  'h-9 px-3 rounded-md text-sm font-medium text-white transition-colors',
                  disabled || publishDisabled
                    ? 'bg-primary/50 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90'
                )}
                title={publishTitle}
              >
                {postStatus === 'published' ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="mt-2">
            <EditorToolbar editor={editor} headings={headings} disabled={disabled} onError={onError} />
          </div>
        </div>
      </div>

      <EditorTableBubbleMenu editor={editor} disabled={disabled} />

      <div className="overflow-hidden rounded-lg border border-surface bg-white">
        <div className="px-4 pt-4 pb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={disabled}
            placeholder="Post title…"
            className={cn(
              'w-full bg-transparent text-3xl font-bold text-secondary',
              'placeholder:text-text/30 focus:outline-none',
              disabled && 'text-text/50'
            )}
          />
        </div>

        <div className="border-t border-surface">
          <EditorContent editor={editor} />
        </div>

        <div className="flex items-center justify-between border-t border-surface bg-background px-4 py-2 text-xs text-text/70">
          <span>
            Words:{' '}
            <span className="font-medium text-secondary">{stats.words.toLocaleString()}</span>
          </span>

          {isPastingUpload ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Uploading…
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface SaveStatusProps {
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
}

function SaveStatus({ isDirty, isSaving, lastSaved, saveError }: SaveStatusProps) {
  if (saveError) {
    return (
      <span className="text-sm text-red-600" role="alert">
        {saveError}
      </span>
    );
  }

  if (isSaving) {
    return (
      <span className="text-sm text-text/60 inline-flex items-center gap-2">
        <span className="h-3 w-3 animate-spin rounded-full border border-text/30 border-t-text" />
        Saving…
      </span>
    );
  }

  if (isDirty) {
    return <span className="text-sm text-amber-600">Unsaved changes</span>;
  }

  if (lastSaved) {
    return <span className="text-sm text-text/60">Saved {formatRelativeTime(lastSaved)}</span>;
  }

  return null;
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
