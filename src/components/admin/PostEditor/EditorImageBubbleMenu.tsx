'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { BubbleMenu, useEditorState, type Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ExternalLink,
  Maximize2,
  RefreshCcw,
  Tag,
  TextCursorInput,
  Trash2,
} from 'lucide-react';

import { uploadPostImage } from '@/lib/admin/storage';

import { ToolbarButton } from './ToolbarButton';
import { ToolbarSelect } from './ToolbarSelect';

type ImageAlign = 'left' | 'center' | 'right' | 'full' | 'none';

const ALIGN_CLASS_MAP: Record<Exclude<ImageAlign, 'none'>, string> = {
  left: 'rw-img-align-left',
  center: 'rw-img-align-center',
  right: 'rw-img-align-right',
  full: 'rw-img-align-full',
};

const WIDTH_PRESETS: Array<{ label: string; value: string }> = [
  { label: 'Auto', value: '' },
  { label: '320px', value: '320' },
  { label: '480px', value: '480' },
  { label: '640px', value: '640' },
];

function getAlignFromClassName(className: string | null | undefined): ImageAlign {
  if (!className) return 'none';
  const classes = className.split(/\s+/).filter(Boolean);

  if (classes.includes(ALIGN_CLASS_MAP.full)) return 'full';
  if (classes.includes(ALIGN_CLASS_MAP.left)) return 'left';
  if (classes.includes(ALIGN_CLASS_MAP.right)) return 'right';
  if (classes.includes(ALIGN_CLASS_MAP.center)) return 'center';

  return 'none';
}

function setAlignClassName(className: string | null | undefined, align: ImageAlign): string | null {
  const classes = (className ?? '').split(/\s+/).filter(Boolean);
  const withoutAlign = classes.filter((c) => !c.startsWith('rw-img-align-'));

  if (align === 'none') {
    return withoutAlign.length ? withoutAlign.join(' ') : null;
  }

  const next = [...withoutAlign, ALIGN_CLASS_MAP[align]];
  return next.join(' ');
}

export interface EditorImageBubbleMenuProps {
  editor: Editor;
  disabled?: boolean;
  onError?: (message: string) => void;
}

export function EditorImageBubbleMenu({ editor, disabled, onError }: EditorImageBubbleMenuProps) {
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const imageSnapshot = useEditorState({
    editor,
    selector: ({ editor: ed }) => {
      const attrs = ed.getAttributes('image') as Record<string, unknown>;
      return {
        src: (attrs.src as string | undefined) ?? '',
        alt: (attrs.alt as string | null | undefined) ?? null,
        title: (attrs.title as string | null | undefined) ?? null,
        width: (attrs.width as string | null | undefined) ?? null,
        height: (attrs.height as string | null | undefined) ?? null,
        className: (attrs.class as string | null | undefined) ?? null,
      };
    },
  });

  const align = useMemo(() => getAlignFromClassName(imageSnapshot.className), [imageSnapshot.className]);

  const isDisabled = disabled || isUploading;

  const updateImageAttrs = useCallback(
    (attrs: Record<string, unknown>) => {
      editor.chain().focus().updateAttributes('image', attrs).run();
    },
    [editor]
  );

  const setAlign = useCallback(
    (nextAlign: ImageAlign) => {
      const nextClassName = setAlignClassName(imageSnapshot.className, nextAlign);
      updateImageAttrs({ class: nextClassName });
    },
    [imageSnapshot.className, updateImageAttrs]
  );

  const setWidthPreset = useCallback(
    (value: string) => {
      if (!value) {
        updateImageAttrs({ width: null, height: null });
        return;
      }

      updateImageAttrs({ width: value, height: null });
    },
    [updateImageAttrs]
  );

  const editAltText = useCallback(() => {
    const previous = imageSnapshot.alt ?? '';
    const next = window.prompt('Alt text (optional)', previous);
    if (next === null) return;

    updateImageAttrs({ alt: next || null });
  }, [imageSnapshot.alt, updateImageAttrs]);

  const editTitle = useCallback(() => {
    const previous = imageSnapshot.title ?? '';
    const next = window.prompt('Title (optional)', previous);
    if (next === null) return;

    updateImageAttrs({ title: next || null });
  }, [imageSnapshot.title, updateImageAttrs]);

  const openImage = useCallback(() => {
    if (!imageSnapshot.src) return;
    window.open(imageSnapshot.src, '_blank', 'noopener,noreferrer');
  }, [imageSnapshot.src]);

  const deleteImage = useCallback(() => {
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  const handleReplaceSelected = useCallback(
    async (file: File | null) => {
      if (!file) return;

      setIsUploading(true);

      try {
        const url = await uploadPostImage(file);
        updateImageAttrs({
          src: url,
          alt: file.name,
        });
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Image upload failed');
      } finally {
        setIsUploading(false);
        if (replaceInputRef.current) replaceInputRef.current.value = '';
      }
    },
    [onError, updateImageAttrs]
  );

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 150,
        interactive: true,
        placement: 'bottom',
        maxWidth: 'calc(100vw - 400px)',
      }}
      shouldShow={() => editor.isActive('image')}
      className="flex items-center gap-1 rounded-lg border border-surface bg-white p-1 shadow-sm"
    >
      <ToolbarButton
        title="Align left"
        aria-label="Align image left"
        disabled={isDisabled}
        isActive={align === 'left'}
        onClick={() => setAlign('left')}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align center"
        aria-label="Align image center"
        disabled={isDisabled}
        isActive={align === 'center'}
        onClick={() => setAlign('center')}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align right"
        aria-label="Align image right"
        disabled={isDisabled}
        isActive={align === 'right'}
        onClick={() => setAlign('right')}
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Full width"
        aria-label="Set image full width"
        disabled={isDisabled}
        isActive={align === 'full'}
        onClick={() => setAlign('full')}
      >
        <Maximize2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSelect
        aria-label="Image width"
        size="sm"
        disabled={isDisabled}
        value={imageSnapshot.width ?? ''}
        onChange={(e) => setWidthPreset(e.target.value)}
      >
        {WIDTH_PRESETS.map((opt) => (
          <option key={opt.value || 'auto'} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </ToolbarSelect>

      <ToolbarButton
        title="Edit alt text"
        aria-label="Edit image alt text"
        disabled={isDisabled}
        onClick={editAltText}
      >
        <TextCursorInput className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Edit title"
        aria-label="Edit image title"
        disabled={isDisabled}
        onClick={editTitle}
      >
        <Tag className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Open image"
        aria-label="Open image in new tab"
        disabled={isDisabled || !imageSnapshot.src}
        onClick={openImage}
      >
        <ExternalLink className="h-4 w-4" />
      </ToolbarButton>

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => void handleReplaceSelected(e.target.files?.[0] ?? null)}
      />
      <ToolbarButton
        title="Replace image"
        aria-label="Replace image"
        disabled={isDisabled}
        onClick={() => replaceInputRef.current?.click()}
      >
        <RefreshCcw className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Delete image"
        aria-label="Delete image"
        disabled={isDisabled}
        onClick={deleteImage}
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>
    </BubbleMenu>
  );
}
