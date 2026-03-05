'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';

import { uploadPostImage } from '@/lib/admin/storage';
import { cn } from '@/lib/utils';
import { createPostEditorExtensions } from '@/lib/tiptap/editorExtensions';
import { sanitizePastedHtml } from '@/lib/tiptap/sanitize';

import { EditorImageBubbleMenu } from './EditorImageBubbleMenu';
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
          'min-h-[28rem] px-8 py-8 outline-none'
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
    <div className="space-y-6">
      <EditorImageBubbleMenu editor={editor} disabled={disabled} onError={onError} />

      <div className="bg-white border border-surface rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-surface p-1.5 bg-background/50">
          <EditorToolbar
            editor={editor}
            disabled={disabled}
            onError={onError}
            className="border-0 shadow-none bg-transparent"
          />
        </div>

        <div className="px-8 pt-10 pb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter Post Title..."
            className={cn(
              'w-full bg-transparent text-4xl font-bold tracking-tight text-secondary',
              'placeholder:text-text/20 focus:outline-none',
              disabled && 'text-text/50'
            )}
          />
        </div>

        <div className="border-t border-surface/30">
          <EditorContent editor={editor} />
        </div>

        <div className="flex items-center justify-between border-t border-surface bg-background/30 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-text/40">
          <div className="flex items-center gap-6">
            <span>
              Words:{' '}
              <span className="text-secondary">{stats.words.toLocaleString()}</span>
            </span>
            <span>
              Status:{' '}
              <span className={cn(disabled ? "text-amber-600" : "text-green-600")}>
                {disabled ? "Read Only" : "Ready"}
              </span>
            </span>
          </div>

          {isPastingUpload ? (
            <span className="inline-flex items-center gap-2 text-primary">
              <LoaderCircle className="w-3 h-3 animate-spin" />
              Uploading...
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LoaderCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}
