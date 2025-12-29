'use client';

import { useState, useCallback } from 'react';
import { BubbleMenu, type Editor } from '@tiptap/react';
import {
  Columns2,
  Columns3,
  Rows2,
  Rows3,
  Merge,
  Split,
  Trash2,
  Palette,
  MoreHorizontal,
} from 'lucide-react';
import { ToolbarButton } from '../ToolbarButton';
import { TableStylesPanel } from './TableStylesPanel';
import { TableCellStyler } from './TableCellStyler';

interface EnhancedEditorTableBubbleMenuProps {
  editor: Editor;
  disabled?: boolean;
}

export function EnhancedEditorTableBubbleMenu({
  editor,
  disabled,
}: EnhancedEditorTableBubbleMenuProps) {
  const [showStylesPanel, setShowStylesPanel] = useState(false);
  const [showCellStyler, setShowCellStyler] = useState(false);

  const isInTable = useCallback(() => {
    const { selection, doc } = editor.state;
    const { from } = selection;
    const resolved = doc.resolve(from);

    for (let i = 0; i < resolved.depth; i++) {
      const node = resolved.node(i);
      if (node && node.type.name.includes('table')) {
        return true;
      }
    }
    return false;
  }, [editor]);

  const handleThemeSelect = useCallback(
    (themeId: string) => {
      editor.commands.setTableTheme(themeId);
      setShowStylesPanel(false);
    },
    [editor]
  );

  if (!isInTable()) {
    return null;
  }

  return (
    <>
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 150,
          placement: 'bottom',
          maxWidth: 'calc(100vw - 400px)',
        }}
        shouldShow={() => editor.isActive('table') || editor.isActive('advancedTable')}
        className="table-bubble-menu-expanded"
      >
        {/* Structure Operations */}
        <div className="table-bubble-menu-section">
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
        </div>

        {/* Merge/Split */}
        <div className="table-bubble-menu-section">
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

        {/* Styling Operations */}
        <div className="table-bubble-menu-section">
          <div className="relative">
            <ToolbarButton
              title="Table theme"
              aria-label="Table theme"
              disabled={disabled}
              isActive={showStylesPanel}
              onClick={() => {
                setShowStylesPanel(!showStylesPanel);
                setShowCellStyler(false);
              }}
            >
              <Palette className="h-4 w-4" />
            </ToolbarButton>
            {showStylesPanel && (
              <TableStylesPanel
                currentTheme={editor.getAttributes('advancedTable').theme || 'minimal'}
                onSelectTheme={handleThemeSelect}
                onClose={() => setShowStylesPanel(false)}
              />
            )}
          </div>

          <div className="relative">
            <ToolbarButton
              title="Cell styles"
              aria-label="Cell styles"
              disabled={disabled}
              isActive={showCellStyler}
              onClick={() => {
                setShowCellStyler(!showCellStyler);
                setShowStylesPanel(false);
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </ToolbarButton>
            {showCellStyler && (
              <TableCellStyler
                editor={editor}
                onClose={() => setShowCellStyler(false)}
              />
            )}
          </div>
        </div>

        {/* Delete */}
        <div className="table-bubble-menu-section">
          <ToolbarButton
            title="Delete table"
            aria-label="Delete table"
            disabled={disabled}
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </BubbleMenu>
    </>
  );
}
