'use client';

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type ImageAttrs = {
  src: string;
  alt?: string | null;
  title?: string | null;
  width?: string | null;
  height?: string | null;
  class?: string | null;
};

type ResizeDraft = {
  width: number;
  height: number;
};

function parsePixelValue(value: string | null | undefined): number | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.endsWith('%')) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ResizableImageNodeView({ node, selected, editor, updateAttributes }: NodeViewProps) {
  const attrs = node.attrs as ImageAttrs;

  const imgRef = useRef<HTMLImageElement | null>(null);
  const resizeSessionRef = useRef<{
    startX: number;
    startWidth: number;
    aspect: number;
  } | null>(null);

  const draftRef = useRef<ResizeDraft | null>(null);

  const [isResizing, setIsResizing] = useState(false);
  const [draftSize, setDraftSize] = useState<ResizeDraft | null>(null);

  const baseWidthPx = useMemo(() => parsePixelValue(attrs.width), [attrs.width]);
  const baseHeightPx = useMemo(() => parsePixelValue(attrs.height), [attrs.height]);

  const imgStyle = useMemo(() => {
    if (draftSize) {
      return {
        width: `${draftSize.width}px`,
        height: `${draftSize.height}px`,
      };
    }

    const style: Record<string, string> = {};

    if (attrs.width) {
      style.width = attrs.width.trim().endsWith('%') ? attrs.width : `${attrs.width}px`;
    } else if (baseWidthPx) {
      style.width = `${baseWidthPx}px`;
    }

    if (attrs.height) {
      style.height = attrs.height.trim().endsWith('%') ? attrs.height : `${attrs.height}px`;
    } else if (baseHeightPx) {
      style.height = `${baseHeightPx}px`;
    }

    return style;
  }, [attrs.height, attrs.width, baseHeightPx, baseWidthPx, draftSize]);

  const stopResize = useCallback(() => {
    resizeSessionRef.current = null;
    draftRef.current = null;
    setIsResizing(false);
    setDraftSize(null);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (event: PointerEvent) => {
      const session = resizeSessionRef.current;
      if (!session) return;

      const deltaX = event.clientX - session.startX;
      const nextWidth = Math.max(80, Math.round(session.startWidth + deltaX));
      const nextHeight = Math.max(40, Math.round(nextWidth / session.aspect));
      const next = { width: nextWidth, height: nextHeight };

      draftRef.current = next;
      setDraftSize(next);
    };

    const handlePointerUp = () => {
      const final = draftRef.current;
      stopResize();

      if (!final) return;

      updateAttributes({
        width: String(final.width),
        height: String(final.height),
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isResizing, stopResize, updateAttributes]);

  useEffect(() => {
    return () => {
      stopResize();
    };
  }, [stopResize]);

  const startResize = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!editor.isEditable) return;

      event.preventDefault();
      event.stopPropagation();

      const rect = imgRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;

      const initial: ResizeDraft = {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };

      resizeSessionRef.current = {
        startX: event.clientX,
        startWidth: rect.width,
        aspect: rect.width / rect.height,
      };

      draftRef.current = initial;
      setDraftSize(initial);
      setIsResizing(true);
    },
    [editor.isEditable]
  );

  return (
    <NodeViewWrapper
      className={cn(
        'rw-image-nodeview',
        'relative inline-block max-w-full select-none',
        selected && 'rw-image-nodeview--selected'
      )}
    >
      <img
        ref={imgRef}
        src={attrs.src}
        alt={attrs.alt ?? ''}
        title={attrs.title ?? ''}
        className={cn('max-w-full h-auto', attrs.class)}
        style={imgStyle}
      />

      {selected && editor.isEditable ? (
        <button
          type="button"
          aria-label="Resize image"
          className={cn('rw-image-resize-handle', isResizing && 'rw-image-resize-handle--active')}
          onPointerDown={startResize}
        />
      ) : null}
    </NodeViewWrapper>
  );
}
