'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BubbleMenu,
  type Editor,
} from '@tiptap/react';
import {
  Columns2,
  Columns3,
  Columns4,
  Rows2,
  Rows3,
  Rows4,
  Merge,
  Split,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  TableProperties,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Scissors,
  Type,
  Bold,
  Italic,
  Underline,
  Square,
  MoreHorizontal,
  Settings,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  GripVertical,
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { TableCreationModal, type TableCreationData } from './TableCreationModal';
import { TablePropertiesDialog } from './TablePropertiesDialog';
import { TableCellStylePanel } from './TableCellStylePanel';
import { cn } from '@/lib/utils';
import {
  TABLE_BG_COLORS,
  BORDER_COLORS,
  BORDER_STYLES,
  BORDER_WIDTHS,
  getDefaultTableAttributes,
} from '@/lib/tiptap/tableHelpers';

interface TableToolbarProps {
  editor: Editor;
  disabled?: boolean;
  onError?: (message: string) => void;
}

export function TableToolbar({
  editor,
  disabled,
  onError,
}: TableToolbarProps) {
  const [isTableCreationOpen, setIsTableCreationOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false);
  const [selectedCellInfo, setSelectedCellInfo] = useState<{
    row: number;
    col: number;
    cell: HTMLElement | null;
  } | null>(null);

  // Check if we're in a table
  const isInTable = useMemo(() => {
    return editor.isActive('table');
  }, [editor]);

  // Get table attributes
  const tableAttributes = useMemo(() => {
    if (!isInTable) return null;
    const { backgroundColor, borderColor, borderStyle, borderWidth, cellPadding } =
      editor.getAttributes('table');
    return {
      backgroundColor: backgroundColor || getDefaultTableAttributes().backgroundColor,
      borderColor: borderColor || getDefaultTableAttributes().borderColor,
      borderStyle: borderStyle || getDefaultTableAttributes().borderStyle,
      borderWidth: borderWidth || getDefaultTableAttributes().borderWidth,
      cellPadding: cellPadding || getDefaultTableAttributes().cellPadding,
    };
  }, [editor, isInTable]);

  // Handle table creation
  const handleTableCreate = useCallback(
    (data: TableCreationData) => {
      try {
        editor
          .chain()
          .focus()
          .insertTable({
            rows: data.rows,
            cols: data.cols,
            withHeaderRow: data.headerRow,
          })
          .run();

        // Apply header column after insertion if needed
        if (data.headerColumn) {
          setTimeout(() => {
            editor.chain().focus().toggleHeaderColumn().run();
          }, 50);
        }
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Failed to create table');
      }
    },
    [editor, onError]
  );

  // Handle context menu
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const cell = target.closest('td, th');

      if (cell) {
        const table = target.closest('table');
        if (table) {
          const row = cell.parentElement;
          const rowIndex = row ? Array.from(row.parentElement?.children || []).indexOf(row) : 0;
          const cellIndex = Array.from(row?.children || []).indexOf(cell);

          setSelectedCellInfo({
            row: rowIndex,
            col: cellIndex,
            cell: cell as HTMLElement,
          });
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isInTable || disabled) return;

      // Ctrl/Cmd + B for bold
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        editor.chain().focus().toggleBold().run();
      }

      // Ctrl/Cmd + I for italic
      if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
        event.preventDefault();
        editor.chain().focus().toggleItalic().run();
      }

      // Delete for cell content
      if (event.key === 'Delete' && !editor.isActive('textInput')) {
        const { selection } = editor.state;
        if (selection.empty) {
          event.preventDefault();
          // Delete cell content while preserving structure
          editor.chain().focus().deleteSelection().run();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, isInTable, disabled]);

  // Toolbar sections
  const structureButtons = (
    <>
      <div className="flex items-center gap-1 px-2 border-r border-surface/50">
        <ToolbarButton
          title="Add column before (Alt+Left)"
          aria-label="Add column before"
          disabled={disabled}
          onClick={() => editor.chain().focus().addColumnBefore().run()}
        >
          <ChevronLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Add column after (Alt+Right)"
          aria-label="Add column after"
          disabled={disabled}
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <ChevronRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Add row before (Alt+Up)"
          aria-label="Add row before"
          disabled={disabled}
          onClick={() => editor.chain().focus().addRowBefore().run()}
        >
          <ChevronUp className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Add row after (Alt+Down)"
          aria-label="Add row after"
          disabled={disabled}
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <ChevronDown className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-surface/50">
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
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-surface/50">
        <ToolbarButton
          title="Delete column"
          aria-label="Delete column"
          disabled={disabled}
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          <Columns2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Delete row"
          aria-label="Delete row"
          disabled={disabled}
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          <Rows2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Delete table"
          aria-label="Delete table"
          disabled={disabled}
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </>
  );

  const alignmentButtons = (
    <div className="flex items-center gap-1 px-2 border-r border-surface/50">
      <ToolbarButton
        title="Align left"
        aria-label="Align left"
        disabled={disabled}
        isActive={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align center"
        aria-label="Align center"
        disabled={disabled}
        isActive={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align right"
        aria-label="Align right"
        disabled={disabled}
        isActive={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Justify"
        aria-label="Justify"
        disabled={disabled}
        isActive={editor.isActive({ textAlign: 'justify' })}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );

  const styleButtons = (
    <div className="flex items-center gap-1 px-2">
      <ToolbarButton
        title="Cell background color"
        aria-label="Cell background color"
        disabled={disabled}
        onClick={() => setIsStylePanelOpen(!isStylePanelOpen)}
        className={cn(isStylePanelOpen && 'bg-primary/10 border-primary/30')}
      >
        <Palette className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Table properties"
        aria-label="Table properties"
        disabled={disabled}
        onClick={() => setIsPropertiesOpen(true)}
      >
        <TableProperties className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );

  return (
    <>
      {/* Main bubble menu for table operations */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 150,
          placement: 'bottom',
          maxWidth: 'calc(100vw - 100px)',
        }}
        shouldShow={() => editor.isActive('table')}
        className="flex items-center gap-1 rounded-lg border border-surface bg-white shadow-lg overflow-x-auto"
      >
        {structureButtons}
        {alignmentButtons}
        {styleButtons}
      </BubbleMenu>

      {/* Creation modal */}
      <TableCreationModal
        isOpen={isTableCreationOpen}
        onClose={() => setIsTableCreationOpen(false)}
        onConfirm={handleTableCreate}
      />

      {/* Properties dialog */}
      {isInTable && (
        <TablePropertiesDialog
          editor={editor}
          isOpen={isPropertiesOpen}
          onClose={() => setIsPropertiesOpen(false)}
        />
      )}

      {/* Cell style panel */}
      {isStylePanelOpen && isInTable && (
        <TableCellStylePanel
          editor={editor}
          onClose={() => setIsStylePanelOpen(false)}
        />
      )}
    </>
  );
}

// Separate component for the toolbar button that opens the creation modal
export function TableInsertButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <ToolbarButton
      title="Insert table"
      aria-label="Insert table"
      disabled={disabled}
      onClick={onClick}
    >
      <TableProperties className="h-4 w-4" />
    </ToolbarButton>
  );
}
