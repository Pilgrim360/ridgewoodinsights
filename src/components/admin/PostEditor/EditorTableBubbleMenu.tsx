'use client';

import { BubbleMenu, type Editor } from '@tiptap/react';
import {
  Columns2,
  Columns3,
  Rows2,
  Rows3,
  Merge,
  Split,
  Trash2,
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';

export interface EditorTableBubbleMenuProps {
  editor: Editor;
  disabled?: boolean;
}

export function EditorTableBubbleMenu({
  editor,
  disabled,
}: EditorTableBubbleMenuProps) {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 150,
        placement: 'bottom',
        maxWidth: 'calc(100vw - 400px)',
      }}
      shouldShow={() => editor.isActive('table')}
      className="flex items-center gap-1 rounded-lg border border-surface bg-white p-1 shadow-sm"
    >
      <ToolbarButton
        title="Add column before"
        aria-label="Add column before"
        disabled={disabled}
        onClick={() => editor.chain().focus().addColumnBefore().run()}
      >
        <Columns3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Add column after"
        aria-label="Add column after"
        disabled={disabled}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <Columns2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Add row before"
        aria-label="Add row before"
        disabled={disabled}
        onClick={() => editor.chain().focus().addRowBefore().run()}
      >
        <Rows3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Add row after"
        aria-label="Add row after"
        disabled={disabled}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <Rows2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Merge cells"
        aria-label="Merge cells"
        disabled={disabled}
        onClick={() => editor.chain().focus().mergeCells().run()}
      >
        <Merge className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Split cell"
        aria-label="Split cell"
        disabled={disabled}
        onClick={() => editor.chain().focus().splitCell().run()}
      >
        <Split className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Delete table"
        aria-label="Delete table"
        disabled={disabled}
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>
    </BubbleMenu>
  );
}
