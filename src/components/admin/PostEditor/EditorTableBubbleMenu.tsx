'use client';

import { BubbleMenu, type Editor } from '@tiptap/react';
import {
  Plus,
  Minus,
  Columns2,
  Rows2,
  Merge,
  Split,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Wrench,
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDropdown } from './ToolbarDropdown';
import { ColorPicker } from './ColorPicker';

export interface EditorTableBubbleMenuProps {
  editor: Editor;
  disabled?: boolean;
}

const CELL_BACKGROUND_PRESETS = [
  '#FFFFFF', // White
  '#F8F9FB', // Background (off-white)
  '#E2E7ED', // Surface (light gray)
  '#DBEAFE', // Light blue
  '#DCFCE7', // Light green
  '#FEF3C7', // Light yellow
  '#FCE7F3', // Light pink
  '#F3E8FF', // Light purple
  '#006466', // Primary (teal)
  '#2C3E50', // Secondary (midnight blue)
  '#415161', // Text (slate gray)
  '#B42318', // Red
];

export function EditorTableBubbleMenu({
  editor,
  disabled,
}: EditorTableBubbleMenuProps) {
  const canMergeCells = editor.can().mergeCells();
  const canSplitCell = editor.can().splitCell();
  const isHeaderRow = editor.isActive('tableRow') && editor.getAttributes('tableCell').rowHeader;
  const isHeaderColumn = editor.getAttributes('tableCell').colHeader;
  const isHeaderCell = editor.isActive('tableHeader');

  // Get current cell background color
  const currentBgColor = 
    editor.getAttributes('tableCell').backgroundColor || 
    editor.getAttributes('tableHeader').backgroundColor || 
    null;

  // Get current text alignment
  const getCurrentAlignment = () => {
    if (editor.isActive({ textAlign: 'left' })) return 'left';
    if (editor.isActive({ textAlign: 'center' })) return 'center';
    if (editor.isActive({ textAlign: 'right' })) return 'right';
    if (editor.isActive({ textAlign: 'justify' })) return 'justify';
    return 'left';
  };

  const currentAlignment = getCurrentAlignment();

  const handleCellBackgroundChange = (color: string | null) => {
    if (color) {
      editor.chain().focus().setCellAttribute('backgroundColor', color).run();
    } else {
      editor.chain().focus().setCellAttribute('backgroundColor', null).run();
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 150,
        placement: 'top',
        maxWidth: 'calc(100vw - 32px)',
      }}
      shouldShow={() => editor.isActive('table')}
      className="flex items-center gap-1 rounded-lg border border-surface bg-white p-1 shadow-lg"
    >
      {/* Insert Operations */}
      <ToolbarDropdown
        title="Insert"
        aria-label="Insert column or row"
        icon={<Plus className="h-4 w-4" />}
        disabled={disabled}
        items={[
          {
            label: 'Column Before',
            icon: <Columns2 className="h-4 w-4" />,
            onClick: () => editor.chain().focus().addColumnBefore().run(),
          },
          {
            label: 'Column After',
            icon: <Columns2 className="h-4 w-4" />,
            onClick: () => editor.chain().focus().addColumnAfter().run(),
          },
          {
            label: 'Row Before',
            icon: <Rows2 className="h-4 w-4" />,
            onClick: () => editor.chain().focus().addRowBefore().run(),
          },
          {
            label: 'Row After',
            icon: <Rows2 className="h-4 w-4" />,
            onClick: () => editor.chain().focus().addRowAfter().run(),
          },
        ]}
      />

      {/* Delete Operations */}
      <ToolbarDropdown
        title="Delete"
        aria-label="Delete column, row, or table"
        icon={<Minus className="h-4 w-4" />}
        disabled={disabled}
        items={[
          {
            label: 'Delete Column',
            icon: <Columns2 className="h-4 w-4" />,
            onClick: () => editor.chain().focus().deleteColumn().run(),
          },
          {
            label: 'Delete Row',
            icon: <Rows2 className="h-4 w-4" />,
            onClick: () => editor.chain().focus().deleteRow().run(),
          },
          {
            label: 'Delete Table',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => editor.chain().focus().deleteTable().run(),
          },
        ]}
      />

      <div className="w-px h-6 bg-surface mx-1" />

      {/* Header Toggles */}
      <ToolbarButton
        title="Toggle Header Row"
        aria-label="Toggle header row"
        disabled={disabled}
        isActive={isHeaderRow}
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      >
        <span className="text-xs font-semibold">HR</span>
      </ToolbarButton>

      <ToolbarButton
        title="Toggle Header Column"
        aria-label="Toggle header column"
        disabled={disabled}
        isActive={isHeaderColumn}
        onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
      >
        <span className="text-xs font-semibold">HC</span>
      </ToolbarButton>

      <ToolbarButton
        title="Toggle Header Cell"
        aria-label="Toggle header cell"
        disabled={disabled}
        isActive={isHeaderCell}
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
      >
        <span className="text-xs font-semibold">H</span>
      </ToolbarButton>

      <div className="w-px h-6 bg-surface mx-1" />

      {/* Merge/Split */}
      <ToolbarButton
        title="Merge cells"
        aria-label="Merge cells"
        disabled={disabled || !canMergeCells}
        onClick={() => editor.chain().focus().mergeCells().run()}
      >
        <Merge className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Split cell"
        aria-label="Split cell"
        disabled={disabled || !canSplitCell}
        onClick={() => editor.chain().focus().splitCell().run()}
      >
        <Split className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-surface mx-1" />

      {/* Cell Styling */}
      <ColorPicker
        title="Cell background"
        aria-label="Set cell background color"
        value={currentBgColor}
        presets={CELL_BACKGROUND_PRESETS}
        onChange={handleCellBackgroundChange}
        disabled={disabled}
      />

      {/* Text Alignment */}
      <ToolbarButton
        title="Align left"
        aria-label="Align text left"
        disabled={disabled}
        isActive={currentAlignment === 'left'}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Align center"
        aria-label="Align text center"
        disabled={disabled}
        isActive={currentAlignment === 'center'}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Align right"
        aria-label="Align text right"
        disabled={disabled}
        isActive={currentAlignment === 'right'}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Justify"
        aria-label="Justify text"
        disabled={disabled}
        isActive={currentAlignment === 'justify'}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-surface mx-1" />

      {/* Advanced */}
      <ToolbarButton
        title="Fix table structure"
        aria-label="Fix table structure"
        disabled={disabled}
        onClick={() => editor.chain().focus().fixTables().run()}
      >
        <Wrench className="h-4 w-4" />
      </ToolbarButton>
    </BubbleMenu>
  );
}
