'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';

import { createPostEditorExtensions } from '@/lib/tiptap/editorExtensions';
import { sanitizePastedHtml } from '@/lib/tiptap/sanitize';
import { getTocHeadings, type TocHeading } from '@/lib/tiptap/toc';
import { uploadPostImage } from '@/lib/admin/storage';
import { cn } from '@/lib/utils';

import { EditorToolbar } from './EditorToolbar';
import { EditorTableBubbleMenu } from './EditorTableBubbleMenu';
import { EditorToc } from './EditorToc';

export interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
  characterLimit?: number;
  onError?: (message: string) => void;
}

export function TipTapEditor({
  content,
  onChange,
  disabled,
  characterLimit = 50000,
  onError,
}: TipTapEditorProps) {
  const [toc, setToc] = useState<TocHeading[]>([]);
  const [isUploading, setIsUploading] = useState(false);
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
      setToc(getTocHeadings(ed));
    },
    onDestroy: () => {
      editorRef.current = null;
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
      setToc(getTocHeadings(ed));
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none',
          'prose-headings:text-secondary prose-p:text-text',
          'prose-a:text-primary',
          'min-h-[26rem] p-4 outline-none'
        ),
      },
      transformPastedHTML: sanitizePastedHtml,
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        const imageFiles = files.filter((file) => file.type.startsWith('image/'));

        if (imageFiles.length === 0) return false;

        void (async () => {
          setIsUploading(true);
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
            setIsUploading(false);
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
          setIsUploading(true);
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
            setIsUploading(false);
          }
        })();

        return true;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    setToc(getTocHeadings(editor));
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  const stats = useMemo(() => {
    if (!editor) {
      return {
        characters: 0,
        words: 0,
      };
    }

    const characters = editor.storage.characterCount.characters();
    const words = editor.storage.characterCount.words();

    return {
      characters,
      words,
    };
  }, [editor, editor?.state]);

  if (!editor) return null;

  return (
    <div className="space-y-4">
      <EditorToolbar editor={editor} headings={toc} disabled={disabled} onError={onError} />

      <EditorTableBubbleMenu editor={editor} disabled={disabled} />

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-lg border border-surface bg-white">
            <EditorContent editor={editor} />
          </div>

          {isUploading && (
            <div className="mt-2 text-sm text-text/70">
              Uploading pasted media…
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-surface bg-white p-4">
            <p className="text-sm font-semibold text-secondary mb-3">Outline</p>
            <EditorToc editor={editor} headings={toc} />
          </div>

          <div className="rounded-lg border border-surface bg-white p-4">
            <p className="text-sm font-semibold text-secondary mb-2">Counts</p>
            <div className="space-y-1 text-sm text-text">
              <div className="flex items-center justify-between">
                <span>Words</span>
                <span className="font-medium text-secondary">{stats.words.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Characters</span>
                <span
                  className={cn(
                    'font-medium',
                    characterLimit && stats.characters > characterLimit
                      ? 'text-red-600'
                      : 'text-secondary'
                  )}
                >
                  {stats.characters.toLocaleString()}
                  {characterLimit ? ` / ${characterLimit.toLocaleString()}` : ''}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
