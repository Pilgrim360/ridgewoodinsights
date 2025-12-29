'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';

import { uploadPostImage } from '@/lib/admin/storage';
import { cn } from '@/lib/utils';
import { createPostEditorExtensions } from '@/lib/tiptap/editorExtensions';
import { sanitizePastedHtml } from '@/lib/tiptap/sanitize';
import { useAdminHeaderSlots } from '@/contexts/AdminHeaderSlotsContext';

import { EditorImageBubbleMenu } from './EditorImageBubbleMenu';
import { EditorTableBubbleMenu } from './EditorTableBubbleMenu';
import { EditorTableContextMenu } from './EditorTableContextMenu';
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
  const { setSubHeader } = useAdminHeaderSlots();

  const [isPastingUpload, setIsPastingUpload] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const contextMenuTriggerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!editor) return;

    setSubHeader(
      <EditorToolbar
        editor={editor}
        disabled={disabled}
        onError={onError}
        className="w-full border-0 rounded-none bg-transparent p-0"
      />
    );

    return () => {
      setSubHeader(null);
    };
  }, [editor, disabled, onError, setSubHeader]);

  useEffect(() => {
    const editorElement = editor?.options.element;
    if (!editorElement) return;

    const handleContextMenu = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (editor.isActive('table')) {
        event.preventDefault();
        const { clientX, clientY } = mouseEvent;
        if (contextMenuTriggerRef.current) {
            contextMenuTriggerRef.current.style.top = `${clientY}px`;
            contextMenuTriggerRef.current.style.left = `${clientX}px`;
            setIsContextMenuOpen(true);
        }
      }
    };

    editorElement.addEventListener('contextmenu', handleContextMenu);

    return () => {
      editorElement.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [editor]);

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
    <div className="space-y-3">
      <EditorImageBubbleMenu editor={editor} disabled={disabled} onError={onError} />
      <EditorTableBubbleMenu editor={editor} disabled={disabled} />
      <EditorTableContextMenu
        editor={editor}
        disabled={disabled}
        isOpen={isContextMenuOpen}
        onOpenChange={setIsContextMenuOpen}
      >
        <div ref={contextMenuTriggerRef} style={{ position: 'absolute' }} />
      </EditorTableContextMenu>

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
