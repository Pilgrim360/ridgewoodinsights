'use client';

import { useCallback, useState } from 'react';
import { BubbleMenu, type Editor } from '@tiptap/react';
import {
  Columns2,
  Columns3Icon,
  Rows2,
  Rows3,
  Merge,
  Split,
  Square,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowLeftRight,
  Heading1,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolbarButton } from './ToolbarButton';

export interface EditorTableBubbleMenuProps {
  editor: Editor;
  disabled?: boolean;
}

const CELL_COLORS = [
  { label: 'Transparent', value: '' },
  { label: 'Light Gray', value: '#F3F4F6' },
  { label: 'Light Red', value: '#FEE2E2' },
  { label: 'Light Orange', value: '#FFEDD5' },
  { label: 'Light Yellow', value: '#FEF3C7' },
  { label: 'Light Green', value: '#DCFCE7' },
  { label: 'Light Blue', value: '#DBEAFE' },
  { label: 'Light Indigo', value: '#E0E7FF' },
  { label: 'Light Purple', value: '#F3E8FF' },
  { label: 'Light Pink', value: '#FCE7F3' },
];

export function EditorTableBubbleMenu({
  editor,
  disabled,
}: EditorTableBubbleMenuProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const canAddColumnBefore = editor.can().addColumnBefore();
  const canAddColumnAfter = editor.can().addColumnAfter();
  const canAddRowBefore = editor.can().addRowBefore();
  const canAddRowAfter = editor.can().addRowAfter();
  const canMergeCells = editor.can().mergeCells();
  const canSplitCell = editor.can().splitCell();
  const canDeleteColumn = editor.can().deleteColumn();
  const canDeleteRow = editor.can().deleteRow();
  const canDeleteTable = editor.can().deleteTable();
  const canToggleHeaderColumn = editor.can().toggleHeaderColumn();
  const canToggleHeaderCell = editor.can().toggleHeaderCell();

  const currentCellBg = editor.getAttributes('tableCell').backgroundColor;
  const isHeaderCell = editor.isActive('tableHeader');

  const handleColorSelect = useCallback(
    (color: string) => {
      if (color === '') {
        editor.chain().focus().unsetCellBackground().run();
      } else {
        editor.chain().focus().setCellBackground(color).run();
      }
      setShowColorPicker(false);
    },
    [editor]
  );

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 150,
        placement: 'bottom',
        maxWidth: 'calc(100vw - 100px)',
      }}
      shouldShow={() => editor.isActive('table') || editor.isActive('tableCell')}
      className="flex flex-wrap items-center gap-0.5 rounded-lg border border-surface bg-white p-1 shadow-md"
    >
      {/* Row/Column Operations */}
      <div className="flex items-center gap-0.5 border-r border-surface pr-1 mr-1">
        <ToolbarButton
          title="Add column before"
          aria-label="Add column before"
          disabled={disabled || !canAddColumnBefore}
          onClick={() => editor.chain().focus().addColumnBefore().run()}
        >
          <Columns3Icon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Add column after"
          aria-label="Add column after"
          disabled={disabled || !canAddColumnAfter}
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <Columns2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Delete column"
          aria-label="Delete column"
          disabled={disabled || !canDeleteColumn}
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          <ScissorsHorizontal className="h-4 w-4 rotate-90" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-0.5 border-r border-surface pr-1 mr-1">
        <ToolbarButton
          title="Add row before"
          aria-label="Add row before"
          disabled={disabled || !canAddRowBefore}
          onClick={() => editor.chain().focus().addRowBefore().run()}
        >
          <Rows3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Add row after"
          aria-label="Add row after"
          disabled={disabled || !canAddRowAfter}
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <Rows2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Delete row"
          aria-label="Delete row"
          disabled={disabled || !canDeleteRow}
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          <ScissorsVertical className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Merge/Split */}
      <div className="flex items-center gap-0.5 border-r border-surface pr-1 mr-1">
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
        <ToolbarButton
          title="Merge or split"
          aria-label="Merge or split"
          disabled={disabled}
          onClick={() => editor.chain().focus().mergeOrSplit().run()}
        >
          <ArrowLeftRight className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Header formatting */}
      <div className="flex items-center gap-0.5 border-r border-surface pr-1 mr-1">
        <ToolbarButton
          title="Toggle header column"
          aria-label="Toggle header column"
          disabled={disabled || !canToggleHeaderColumn}
          onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
        >
          <ChevronRight className="h-4 w-4 rotate-90" />
        </ToolbarButton>
        <ToolbarButton
          title="Toggle header cell"
          aria-label="Toggle header cell"
          disabled={disabled || !canToggleHeaderCell}
          isActive={isHeaderCell}
          onClick={() => editor.chain().focus().toggleHeaderCell().run()}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Cell Background Color */}
      <div className="relative">
        <ToolbarButton
          title="Cell background color"
          aria-label="Cell background color"
          disabled={disabled}
          onClick={() => setShowColorPicker(!showColorPicker)}
          isActive={showColorPicker || !!currentCellBg}
        >
          <div className="flex items-center gap-1">
            <div
              className="h-4 w-4 rounded border border-surface"
              style={{ backgroundColor: currentCellBg || 'transparent' }}
            />
            <ChevronDown className="h-3 w-3" />
          </div>
        </ToolbarButton>

        {showColorPicker && (
          <div className="absolute top-full left-0 z-50 mt-1 grid grid-cols-5 gap-0.5 rounded-lg border border-surface bg-white p-1.5 shadow-lg">
            {CELL_COLORS.map((color) => (
              <button
                key={color.value || 'transparent'}
                type="button"
                className={cn(
                  'h-6 w-6 rounded border border-surface transition-transform hover:scale-110',
                  !color.value && 'bg-white'
                )}
                style={color.value ? { backgroundColor: color.value } : {}}
                aria-label={color.label}
                disabled={disabled}
                onClick={() => handleColorSelect(color.value)}
              >
                {color.value === currentCellBg && (
                  <CheckIcon
                    className={cn(
                      'mx-auto h-4 w-4',
                      color.value === '#FEE2E2' ||
                      color.value === '#FFEDD5' ||
                      color.value === '#FEF3C7'
                        ? 'text-secondary'
                        : 'text-primary'
                    )}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cell navigation */}
      <div className="flex items-center gap-0.5 border-l border-surface pl-1 ml-1">
        <ToolbarButton
          title="Go to previous cell"
          aria-label="Go to previous cell"
          disabled={disabled}
          onClick={() => editor.chain().focus().goToPreviousCell().run()}
        >
          <ChevronLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Go to next cell"
          aria-label="Go to next cell"
          disabled={disabled}
          onClick={() => editor.chain().focus().goToNextCell().run()}
        >
          <ChevronRight className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Selection */}
      <div className="flex items-center gap-0.5 border-l border-surface pl-1 ml-1">
        <ToolbarButton
          title="Select all cells"
          aria-label="Select all cells"
          disabled={disabled}
          onClick={() => {
            editor.chain().focus().selectAll().run();
          }}
        >
          <Square className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Delete Table */}
      <div className="flex items-center gap-0.5 border-l border-surface pl-1 ml-1">
        <ToolbarButton
          title="Delete table"
          aria-label="Delete table"
          disabled={disabled || !canDeleteTable}
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </BubbleMenu>
  );
}

// SVG icons for scissors (rotated for column/row delete)
function ScissorsVertical({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

function ScissorsHorizontal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Re-export for backwards compatibility
export { Columns3Icon } from 'lucide-react';
