'use client';

import { type Editor } from '@tiptap/react';
import {
  Columns2,
  Rows2,
  Merge,
  Trash2,
  Bold,
  Italic,
  Settings2,
  ChevronDown,
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarSelect } from './ToolbarSelect';
import { TABLE_THEMES } from '@/lib/tiptap/tableThemes';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface EditorTableToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

export function EditorTableToolbar({ editor, disabled }: EditorTableToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!editor.isActive('table')) {
    return null;
  }

  const updateTableAttribute = (attributes: Record<string, unknown>) => {
    editor.chain().focus().setNode('table', attributes).run();
  };

  const currentAttributes = editor.getAttributes('table');

  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex flex-wrap items-center gap-1 p-1 border-b border-surface">
        {/* Basic Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-surface">
          <ToolbarButton
            title="Bold"
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={disabled}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={disabled}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Column Operations */}
        <div className="flex items-center gap-1 px-2 border-r border-surface">
          <ToolbarButton
            title="Add column"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            disabled={disabled}
          >
            <Columns2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Col</span>
          </ToolbarButton>
          <ToolbarButton
            title="Delete column"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            disabled={disabled}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Row Operations */}
        <div className="flex items-center gap-1 px-2 border-r border-surface">
          <ToolbarButton
            title="Add row"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={disabled}
          >
            <Rows2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Row</span>
          </ToolbarButton>
          <ToolbarButton
            title="Delete row"
            onClick={() => editor.chain().focus().deleteRow().run()}
            disabled={disabled}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Cell Operations */}
        <div className="flex items-center gap-1 px-2 border-r border-surface">
          <ToolbarButton
            title="Merge/Split"
            onClick={() => {
              if (editor.can().mergeCells()) {
                editor.chain().focus().mergeCells().run();
              } else {
                editor.chain().focus().splitCell().run();
              }
            }}
            disabled={disabled}
          >
            <Merge className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Styling */}
        <div className="flex items-center gap-2 px-2 border-r border-surface">
          <span className="text-[10px] uppercase font-bold text-text/40">Theme</span>
          <ToolbarSelect
            value={currentAttributes.tableTheme || 'default'}
            onChange={(e) => updateTableAttribute({ tableTheme: e.target.value })}
            disabled={disabled}
            className="w-28 h-8 text-xs"
          >
            {Object.entries(TABLE_THEMES).map(([id, theme]) => (
              <option key={id} value={id}>
                {theme.name}
              </option>
            ))}
          </ToolbarSelect>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton
            title="Advanced Styling"
            onClick={() => setShowAdvanced(!showAdvanced)}
            isActive={showAdvanced}
            disabled={disabled}
          >
            <Settings2 className="h-4 w-4" />
            <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", showAdvanced && "rotate-180")} />
          </ToolbarButton>
        </div>
      </div>

      {showAdvanced && (
        <div className="w-full mt-2 pt-2 border-t border-surface flex flex-wrap items-center gap-4 animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text/60">Borders:</span>
            <select
              className="text-xs border border-surface rounded px-1 py-1"
              value={currentAttributes.borderStyle}
              onChange={(e) => updateTableAttribute({ borderStyle: e.target.value })}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
            <input
              type="number"
              min="0"
              max="10"
              className="w-12 text-xs border border-surface rounded px-1 py-1"
              value={currentAttributes.borderWidth}
              onChange={(e) => updateTableAttribute({ borderWidth: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text/60">Color:</span>
            <input
              type="color"
              className="h-6 w-6 rounded border border-surface p-0 cursor-pointer"
              value={currentAttributes.borderColor}
              onChange={(e) => updateTableAttribute({ borderColor: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text/60">Padding:</span>
            <input
              type="range"
              min="0"
              max="24"
              className="w-24"
              value={currentAttributes.cellPadding}
              onChange={(e) => updateTableAttribute({ cellPadding: parseInt(e.target.value) })}
            />
            <span className="text-[10px]">{currentAttributes.cellPadding}px</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text/60">Width:</span>
            <select
              className="text-xs border border-surface rounded px-1 py-1"
              value={currentAttributes.tableWidth}
              onChange={(e) => updateTableAttribute({ tableWidth: e.target.value })}
            >
              <option value="100%">100%</option>
              <option value="75%">75%</option>
              <option value="50%">50%</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
