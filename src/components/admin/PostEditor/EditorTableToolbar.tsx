'use client';

import { type Editor } from '@tiptap/react';
import {
  Columns2,
  Columns3,
  Rows2,
  Rows3,
  Merge,
  Split,
  Trash2,
  SeparatorHorizontal,
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';

export interface EditorTableToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

export function EditorTableToolbar({
  editor,
  disabled,
}: EditorTableToolbarProps) {
  if (!editor.isActive('table')) {
    return null;
  }

  return (
    <>
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
        disabled={disabled || !editor.can().mergeCells()}
        onClick={() => editor.chain().focus().mergeCells().run()}
      >
        <Merge className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Split cell"
        aria-label="Split cell"
        disabled={disabled || !editor.can().splitCell()}
        onClick={() => editor.chain().focus().splitCell().run()}
      >
        <Split className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Toggle header row"
        aria-label="Toggle header row"
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      >
        <SeparatorHorizontal className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Delete table"
        aria-label="Delete table"
        disabled={disabled}
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>
    </>
  );
}
