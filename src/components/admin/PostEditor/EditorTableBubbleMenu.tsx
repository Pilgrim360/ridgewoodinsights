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
  Grid2X2,
} from 'lucide-react';

import {
  applyBorderPresetToActiveTable,
  selectActiveTable,
  type TableBorderPreset,
} from '@/lib/tiptap/utils/tableHelpers';

import { ToolbarButton } from './ToolbarButton';
import { ToolbarSelect } from './ToolbarSelect';

export interface EditorTableBubbleMenuProps {
  editor: Editor;
  disabled?: boolean;
}

const BORDER_PRESETS: Array<{ label: string; value: TableBorderPreset }> = [
  { label: 'Thin', value: 'table-borders-thin' },
  { label: 'Thick', value: 'table-borders-thick' },
  { label: 'Dashed', value: 'table-borders-dashed' },
  { label: 'Outer', value: 'table-borders-none' },
  { label: 'Header', value: 'table-borders-header-only' },
];

export function EditorTableBubbleMenu({ editor, disabled }: EditorTableBubbleMenuProps) {
  const currentPreset = (editor.getAttributes('table').borderPreset as TableBorderPreset | undefined) ??
    'table-borders-thin';

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 150,
        placement: 'bottom',
        maxWidth: 'calc(100vw - 400px)',
      }}
      shouldShow={() => editor.isActive('table')}
      className="flex flex-wrap items-center gap-1 rounded-lg border border-surface bg-white p-1 shadow-sm"
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
        title="Delete row"
        aria-label="Delete row"
        disabled={disabled}
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Delete column"
        aria-label="Delete column"
        disabled={disabled}
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <Trash2 className="h-4 w-4" />
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
        title="Select table"
        aria-label="Select table"
        disabled={disabled}
        onClick={() => selectActiveTable(editor)}
      >
        <Grid2X2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSelect
        aria-label="Border preset"
        disabled={disabled}
        value={currentPreset}
        onChange={(event) => applyBorderPresetToActiveTable(editor, event.target.value as TableBorderPreset)}
      >
        {BORDER_PRESETS.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </ToolbarSelect>

      <ToolbarButton
        title="Delete table"
        aria-label="Delete table"
        disabled={disabled}
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Toggle header row"
        aria-label="Toggle header row"
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      >
        <Grid2X2 className="h-4 w-4" />
      </ToolbarButton>
    </BubbleMenu>
  );
}
