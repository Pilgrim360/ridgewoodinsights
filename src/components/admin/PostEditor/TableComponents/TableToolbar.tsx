'use client';

import { useCallback, useState } from 'react';
import { type Editor as EditorType } from '@tiptap/react';
import {
  Table as TableIcon,
  Rows2,
  Columns2,
  Trash2,
  Merge,
  Split,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  TABLE_THEMES,
  getThemeById,
} from '@/lib/tiptap/styles/tableThemes';

import { TableStylesPanel } from './TableStylesPanel';

interface TableToolbarProps {
  editor: EditorType;
  className?: string;
}

const PRESET_SIZES = [
  { rows: 2, cols: 2, label: '2 × 2' },
  { rows: 3, cols: 3, label: '3 × 3' },
  { rows: 4, cols: 4, label: '4 × 4' },
  { rows: 4, cols: 5, label: '4 × 5' },
  { rows: 5, cols: 5, label: '5 × 5' },
];

export function TableToolbar({ editor, className }: TableToolbarProps) {
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showStylesPanel, setShowStylesPanel] = useState(false);
  const [insertDimensions, setInsertDimensions] = useState({ rows: 4, cols: 4 });
  const [selectedTheme, setSelectedTheme] = useState<string>('minimal');

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

  const insertTable = useCallback(
    (rows: number, cols: number, themeId: string) => {
      const theme = getThemeById(themeId) || getThemeById('minimal');
      
      let html = `<table data-component="advancedTable" data-theme="${themeId}" data-border-style="${theme?.config.borderStyle || 'solid'}" data-border-color="${theme?.config.borderColor || '#E2E7ED'}" data-border-width="${theme?.config.borderWidth || 1}">`;

      for (let i = 0; i < rows; i++) {
        html += '<tr>';
        for (let j = 0; j < cols; j++) {
          const isHeader = i === 0;
          const tag = isHeader ? 'th' : 'td';
          const component = isHeader ? 'advancedTableHeader' : 'advancedTableCell';
          
          // Apply header styles
          let attrs = '';
          if (isHeader && theme) {
            attrs = ` data-background-color="${theme.config.headerBg}" data-text-color="${theme.config.headerText}"`;
          } else if (i % 2 === 1 && theme?.config.rowBgAlternate) {
            attrs = ` data-background-color="${theme.config.rowBgAlternate}"`;
          }

          html += `<${tag} data-component="${component}"${attrs}></${tag}>`;
        }
        html += '</tr>';
      }

      html += '</table>';

      editor.chain().focus().insertContent(html).run();
      setShowInsertMenu(false);
    },
    [editor]
  );

  const handleInsertPreset = useCallback(
    (rows: number, cols: number) => {
      insertTable(rows, cols, selectedTheme);
    },
    [insertTable, selectedTheme]
  );

  const handleInsertCustom = useCallback(() => {
    insertTable(insertDimensions.rows, insertDimensions.cols, selectedTheme);
  }, [insertTable, insertDimensions, selectedTheme]);

  const handleApplyTheme = useCallback(
    (themeId: string) => {
      const theme = getThemeById(themeId);
      if (!theme) return;

      // Apply theme attributes to table
      editor.commands.updateAttributes('advancedTable', {
        theme: themeId,
        borderStyle: theme.config.borderStyle,
        borderColor: theme.config.borderColor,
        borderWidth: theme.config.borderWidth,
      });

      setShowStylesPanel(false);
    },
    [editor]
  );

  if (isInTable()) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border border-surface bg-white p-2',
          className
        )}
      >
        <button
          onClick={() => setShowStylesPanel(!showStylesPanel)}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            showStylesPanel
              ? 'bg-primary text-white'
              : 'bg-background text-secondary hover:bg-surface'
          )}
        >
          <TableIcon className="h-4 w-4" />
          Table Theme
        </button>

        <div className="h-6 w-px bg-surface" />

        <button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-text hover:bg-surface"
          title="Add Row Above"
        >
          <Rows2 className="h-4 w-4" />
          <span className="hidden sm:inline">Add Row</span>
        </button>

        <button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-text hover:bg-surface"
          title="Add Column Left"
        >
          <Columns2 className="h-4 w-4" />
          <span className="hidden sm:inline">Add Column</span>
        </button>

        <button
          onClick={() => editor.chain().focus().mergeCells().run()}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-text hover:bg-surface"
          title="Merge Cells"
        >
          <Merge className="h-4 w-4" />
          <span className="hidden sm:inline">Merge</span>
        </button>

        <button
          onClick={() => editor.chain().focus().splitCell().run()}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-text hover:bg-surface"
          title="Split Cell"
        >
          <Split className="h-4 w-4" />
          <span className="hidden sm:inline">Split</span>
        </button>

        <div className="h-6 w-px bg-surface" />

        <button
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-red-50"
          title="Delete Table"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </button>

        {showStylesPanel && (
          <TableStylesPanel
            currentTheme={editor.getAttributes('advancedTable').theme || 'minimal'}
            onSelectTheme={handleApplyTheme}
            onClose={() => setShowStylesPanel(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex items-center gap-2 rounded-lg border border-surface bg-white p-2',
        className
      )}
    >
      <button
        onClick={() => setShowInsertMenu(!showInsertMenu)}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          showInsertMenu
            ? 'bg-primary text-white'
            : 'bg-background text-secondary hover:bg-surface'
        )}
      >
        <TableIcon className="h-4 w-4" />
        Insert Table
        <ChevronDown className="h-3 w-3" />
      </button>

      {showInsertMenu && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border border-surface bg-white shadow-lg">
          <div className="border-b border-surface p-3">
            <p className="text-xs font-medium text-text">Preset Sizes</p>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            {PRESET_SIZES.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleInsertPreset(preset.rows, preset.cols)}
                className="flex flex-col items-center gap-1 rounded-md border border-surface p-2 transition-colors hover:border-primary hover:bg-primary/5"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: preset.cols }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-sm bg-primary"
                    />
                  ))}
                </div>
                <span className="text-xs text-text">{preset.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-surface p-3">
            <p className="text-xs font-medium text-text">Custom Size</p>
          </div>
          <div className="flex items-center gap-2 px-3 pb-3">
            <div className="flex items-center gap-1">
              <label className="text-xs text-text">Rows</label>
              <input
                type="number"
                min="1"
                max="20"
                value={insertDimensions.rows}
                onChange={(e) =>
                  setInsertDimensions((prev) => ({
                    ...prev,
                    rows: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)),
                  }))
                }
                className="w-14 rounded border border-surface px-2 py-1 text-sm"
              />
            </div>
            <span className="text-text">×</span>
            <div className="flex items-center gap-1">
              <label className="text-xs text-text">Cols</label>
              <input
                type="number"
                min="1"
                max="20"
                value={insertDimensions.cols}
                onChange={(e) =>
                  setInsertDimensions((prev) => ({
                    ...prev,
                    cols: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)),
                  }))
                }
                className="w-14 rounded border border-surface px-2 py-1 text-sm"
              />
            </div>
          </div>

          <div className="border-t border-surface p-3">
            <p className="text-xs font-medium text-text">Theme</p>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="mt-1 w-full rounded border border-surface px-2 py-1.5 text-sm"
            >
              {TABLE_THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-surface p-3">
            <button
              onClick={handleInsertCustom}
              className="w-full rounded-md bg-primary py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Insert Table
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
