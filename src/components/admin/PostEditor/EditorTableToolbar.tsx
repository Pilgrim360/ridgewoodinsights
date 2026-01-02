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
  MinusCircle,
  MinusSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
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
        title="Delete column"
        aria-label="Delete column"
        disabled={disabled || !editor.can().deleteColumn()}
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <MinusCircle className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Delete row"
        aria-label="Delete row"
        disabled={disabled || !editor.can().deleteRow()}
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <MinusSquare className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Delete table"
        aria-label="Delete table"
        disabled={disabled}
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>
      <div className="h-6 w-px bg-surface mx-1" />
      <ToolbarButton
        title="Align table left"
        aria-label="Align table left"
        disabled={disabled}
        onClick={() => (editor.commands as any).setTableAlignment('left')}
        isActive={editor.isActive('table', { align: 'left' })}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align table center (default)"
        aria-label="Align table center"
        disabled={disabled}
        onClick={() => (editor.commands as any).setTableAlignment('center')}
        isActive={editor.isActive('table', { align: 'center' })}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align table right"
        aria-label="Align table right"
        disabled={disabled}
        onClick={() => (editor.commands as any).setTableAlignment('right')}
        isActive={editor.isActive('table', { align: 'right' })}
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
    </>
  );
}
