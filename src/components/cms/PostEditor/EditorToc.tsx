'use client';

import type { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';
import type { TocHeading } from '@/lib/tiptap/toc';

export interface EditorTocProps {
  editor: Editor;
  headings: TocHeading[];
  className?: string;
}

export function EditorToc({ editor, headings, className }: EditorTocProps) {
  if (headings.length === 0) {
    return (
      <div className={cn('text-sm text-text/70', className)}>
        Add headings to generate a table of contents.
      </div>
    );
  }

  return (
    <nav className={cn('space-y-1', className)} aria-label="Table of contents">
      {headings.map((heading) => (
        <button
          key={`${heading.pos}-${heading.text}`}
          type="button"
          className={cn(
            'w-full text-left text-sm rounded-md px-2 py-1 transition-colors',
            'hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40',
            heading.level === 1 && 'font-semibold text-secondary',
            heading.level > 1 && 'text-text'
          )}
          style={{ paddingLeft: `${Math.min(heading.level - 1, 5) * 12 + 8}px` }}
          onClick={() => {
            editor
              .chain()
              .focus()
              .setTextSelection(Math.min(heading.pos + 1, editor.state.doc.content.size))
              .scrollIntoView()
              .run();
          }}
        >
          {heading.text}
        </button>
      ))}
    </nav>
  );
}
