'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';

import { uploadPostImage } from '@/lib/cms/storage';
import { cn } from '@/lib/utils';
import { createPostEditorExtensions } from '@/lib/tiptap/editorExtensions';
import { sanitizePastedHtml } from '@/lib/tiptap/sanitize';

import { EditorImageBubbleMenu } from './EditorImageBubbleMenu';
import { EditorFloatingMenu } from './EditorFloatingMenu';
import { EditorToolbar } from './EditorToolbar';

export interface TipTapEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
  characterLimit?: number;
  onError?: (message: string) => void;
}

export function TipTapEditor({
  title,
  onTitleChange,
  content,
  onChange,
  disabled,
  characterLimit = 50000,
  onError,
}: TipTapEditorProps) {
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
    },
    onDestroy: () => {
      editorRef.current = null;
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
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
      transformPastedText: (text: string) => {
        return text;
      },
      handlePaste: (_view, event) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const files = Array.from(clipboardData.files);
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
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="space-y-4">
      <EditorImageBubbleMenu editor={editor} disabled={disabled} onError={onError} />
      <EditorFloatingMenu editor={editor} disabled={disabled} />

      <div className="overflow-hidden rounded-xl border border-surface bg-white shadow-sm">
        {/* Sticky Toolbar */}
        <div className="sticky top-0 z-20 border-b border-surface bg-white/80 backdrop-blur-md">
          <EditorToolbar
            editor={editor}
            disabled={disabled}
            onError={onError}
            className="w-full border-0 rounded-none bg-transparent"
          />
        </div>

        <div className="px-6 pt-8 pb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={disabled}
            placeholder="Post title…"
            className={cn(
              'w-full bg-transparent text-4xl font-bold text-secondary',
              'placeholder:text-text/20 focus:outline-none tracking-tight',
              disabled && 'text-text/50'
            )}
          />
        </div>

        <div className="px-2">
          <EditorContent editor={editor} />
        </div>

        <div className="flex items-center justify-between border-t border-surface bg-background/50 px-6 py-3 text-xs text-text/50">
          <div className="flex items-center gap-4">
            <span>
              Words:{' '}
              <span className="font-medium text-secondary">{stats.words.toLocaleString()}</span>
            </span>
          </div>

          {isPastingUpload ? (
            <span className="inline-flex items-center gap-2 text-primary font-medium">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Uploading…
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
