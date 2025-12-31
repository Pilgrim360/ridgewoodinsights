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
import { ToolbarSelect } from './ToolbarSelect';
import { TABLE_THEMES } from '@/lib/tiptap/tableThemes';

export interface EditorTableBubbleMenuProps {
  editor: Editor;
  disabled?: boolean;
}

export function EditorTableBubbleMenu({
  editor,
  disabled,
}: EditorTableBubbleMenuProps) {
  if (!editor) return null;

  const updateTableAttribute = (attributes: Record<string, unknown>) => {
    editor.chain().focus().setNode('table', attributes).run();
  };

  const currentAttributes = editor.getAttributes('table');

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 150,
        placement: 'bottom',
        maxWidth: 'calc(100vw - 400px)',
      }}
      shouldShow={() => editor.isActive('table')}
      className="flex items-center gap-1 rounded-lg border border-surface bg-white p-1 shadow-lg"
    >
      <div className="flex items-center gap-0.5 border-r border-surface pr-1 mr-1">
        <ToolbarButton
          title="Add column before"
          disabled={disabled}
          onClick={() => editor.chain().focus().addColumnBefore().run()}
        >
          <Columns3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Add column after"
          disabled={disabled}
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <Columns2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-0.5 border-r border-surface pr-1 mr-1">
        <ToolbarButton
          title="Add row before"
          disabled={disabled}
          onClick={() => editor.chain().focus().addRowBefore().run()}
        >
          <Rows3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Add row after"
          disabled={disabled}
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <Rows2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-0.5 border-r border-surface pr-1 mr-1">
        <ToolbarButton
          title="Merge cells"
          disabled={disabled}
          onClick={() => editor.chain().focus().mergeCells().run()}
        >
          <Merge className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Split cell"
          disabled={disabled}
          onClick={() => editor.chain().focus().splitCell().run()}
        >
          <Split className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1">
        <ToolbarSelect
          value={currentAttributes.tableTheme || 'default'}
          onChange={(e) => updateTableAttribute({ tableTheme: e.target.value })}
          disabled={disabled}
          className="w-24 text-xs h-8"
        >
          {Object.entries(TABLE_THEMES).map(([id, theme]) => (
            <option key={id} value={id}>
              {theme.name}
            </option>
          ))}
        </ToolbarSelect>
        <ToolbarButton
          title="Delete table"
          disabled={disabled}
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </BubbleMenu>
  );
}
