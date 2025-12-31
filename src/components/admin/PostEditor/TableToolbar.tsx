'use client';

import { useMemo } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Columns2,
  Columns3,
  Rows2,
  Rows3,
  Trash2,
  Merge,
  Split,
  LayoutGrid,
  Paintbrush,
  Palette,
  Table as TableIcon,
  ArrowLeftToLine,
  ArrowRightToLine,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  applyBorderPresetToActiveTable,
  applyTableTheme,
  selectActiveColumn,
  selectActiveRow,
  selectActiveTable,
  type BorderRadius,
  type BorderStyle,
  type BorderWidth,
  type TableBorderPreset,
  type TableTheme,
} from '@/lib/tiptap/utils/tableHelpers';
import { useTableSelection } from '@/hooks/useTableSelection';

import { ToolbarButton } from './ToolbarButton';
import { ToolbarSelect } from './ToolbarSelect';

const BORDER_STYLES: Array<{ label: string; value: BorderStyle }> = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
  { label: 'None', value: 'none' },
];

const BORDER_WIDTHS: BorderWidth[] = ['1px', '2px', '3px'];
const BORDER_RADII: BorderRadius[] = ['0px', '4px', '6px', '8px'];

const BORDER_PRESETS: Array<{ label: string; value: TableBorderPreset }> = [
  { label: 'Thin', value: 'table-borders-thin' },
  { label: 'Thick', value: 'table-borders-thick' },
  { label: 'Dashed', value: 'table-borders-dashed' },
  { label: 'Outer only', value: 'table-borders-none' },
  { label: 'Header only', value: 'table-borders-header-only' },
];

const THEMES: Array<{ label: string; value: TableTheme }> = [
  { label: 'Light', value: 'light' },
  { label: 'Data', value: 'data' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Custom', value: 'custom' },
];

const COLOR_PRESETS = ['#FFFFFF', '#F8F9FB', '#E2E7ED', '#DBEAFE', '#006466', '#2C3E50'];

export interface TableToolbarProps {
  editor: Editor;
  disabled?: boolean;
  className?: string;
}

export function TableToolbar({ editor, disabled, className }: TableToolbarProps) {
  const { isTableActive, selectionType, tableAttributes, cellAttributes } = useTableSelection(editor);

  const borderPreset = (tableAttributes.borderPreset as TableBorderPreset | undefined) ?? 'table-borders-thin';
  const theme = (tableAttributes.theme as TableTheme | undefined) ?? 'light';
  const zebra = (tableAttributes.alternatingRows as boolean | undefined) ?? false;
  const padding = (tableAttributes.cellPadding as string | undefined) ?? 'normal';
  const float = (tableAttributes.float as string | undefined) ?? 'none';
  const tableRadius = (tableAttributes.borderRadius as BorderRadius | undefined) ?? '0px';

  const selectionLabel = useMemo(() => {
    if (!selectionType) return 'Cell';
    return selectionType.charAt(0).toUpperCase() + selectionType.slice(1);
  }, [selectionType]);

  if (!isTableActive) return null;

  const setAllBorderWidths = (value: BorderWidth) => {
    editor
      .chain()
      .focus()
      .setCellAttribute('borderTopWidth', value)
      .setCellAttribute('borderRightWidth', value)
      .setCellAttribute('borderBottomWidth', value)
      .setCellAttribute('borderLeftWidth', value)
      .run();
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-lg border border-surface bg-white p-2 shadow-sm',
        className
      )}
      role="toolbar"
      aria-label="Table toolbar"
    >
      <div className="flex items-center gap-2 rounded-md bg-background px-2 py-1 text-xs text-text/70">
        <TableIcon className="h-3.5 w-3.5 text-secondary" />
        <span className="font-medium text-secondary">{selectionLabel}</span>
      </div>

      <div className="h-6 w-px bg-surface" aria-hidden />

      {/* Structure */}
      <ToolbarButton
        title="Insert column before"
        aria-label="Insert column before"
        disabled={disabled}
        onClick={() => editor.chain().focus().addColumnBefore().run()}
      >
        <Columns3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Insert column after"
        aria-label="Insert column after"
        disabled={disabled}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <Columns2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Insert row before"
        aria-label="Insert row before"
        disabled={disabled}
        onClick={() => editor.chain().focus().addRowBefore().run()}
      >
        <Rows3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Insert row after"
        aria-label="Insert row after"
        disabled={disabled}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <Rows2 className="h-4 w-4" />
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
        title="Delete row"
        aria-label="Delete row"
        disabled={disabled}
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>

      <div className="h-6 w-px bg-surface" aria-hidden />

      {/* Selection */}
      <ToolbarButton
        title="Select row"
        aria-label="Select row"
        disabled={disabled}
        onClick={() => selectActiveRow(editor)}
      >
        <ArrowLeftToLine className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Select column"
        aria-label="Select column"
        disabled={disabled}
        onClick={() => selectActiveColumn(editor)}
      >
        <ArrowRightToLine className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Select table"
        aria-label="Select table"
        disabled={disabled}
        onClick={() => selectActiveTable(editor)}
      >
        <LayoutGrid className="h-4 w-4" />
      </ToolbarButton>

      <div className="h-6 w-px bg-surface" aria-hidden />

      {/* Styling - presets */}
      <ToolbarSelect
        aria-label="Border preset"
        disabled={disabled}
        value={borderPreset}
        onChange={(event) => {
          const next = event.target.value as TableBorderPreset;
          applyBorderPresetToActiveTable(editor, next);
        }}
      >
        {BORDER_PRESETS.map((presetOption) => (
          <option key={presetOption.value} value={presetOption.value}>
            Borders: {presetOption.label}
          </option>
        ))}
      </ToolbarSelect>

      <ToolbarSelect
        aria-label="Table theme"
        disabled={disabled}
        value={theme}
        onChange={(event) => {
          const next = event.target.value as TableTheme;
          applyTableTheme(editor, next);
        }}
      >
        {THEMES.map((themeOption) => (
          <option key={themeOption.value} value={themeOption.value}>
            Theme: {themeOption.label}
          </option>
        ))}
      </ToolbarSelect>

      <div className="h-6 w-px bg-surface" aria-hidden />

      {/* Border controls (selection) */}
      <ToolbarSelect
        aria-label="Border style"
        disabled={disabled}
        value={cellAttributes.borderStyle}
        onChange={(event) => {
          const value = event.target.value as BorderStyle;
          editor.chain().focus().setCellAttribute('borderStyle', value).run();
        }}
      >
        {BORDER_STYLES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Border: {opt.label}
          </option>
        ))}
      </ToolbarSelect>

      <ToolbarSelect
        aria-label="Border width"
        disabled={disabled}
        value={cellAttributes.borderTopWidth}
        onChange={(event) => setAllBorderWidths(event.target.value as BorderWidth)}
      >
        {BORDER_WIDTHS.map((width) => (
          <option key={width} value={width}>
            Width: {width}
          </option>
        ))}
      </ToolbarSelect>

      <ToolbarSelect
        aria-label="Cell border radius"
        disabled={disabled}
        value={cellAttributes.borderRadius}
        onChange={(event) =>
          editor.chain().focus().setCellAttribute('borderRadius', event.target.value as BorderRadius).run()
        }
      >
        {BORDER_RADII.map((radius) => (
          <option key={radius} value={radius}>
            Radius: {radius}
          </option>
        ))}
      </ToolbarSelect>

      <div className="flex items-center gap-1">
        <Paintbrush className="h-4 w-4 text-secondary" />
        <input
          type="color"
          aria-label="Border color"
          disabled={disabled}
          value={(cellAttributes.borderColor as string) || '#E2E7ED'}
          onChange={(event) => editor.chain().focus().setCellAttribute('borderColor', event.target.value).run()}
          className={cn(
            'h-9 w-9 rounded-md border border-surface bg-white p-1',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
      </div>

      <div className="h-6 w-px bg-surface" aria-hidden />

      {/* Cell colors */}
      <div className="flex items-center gap-1">
        <Palette className="h-4 w-4 text-secondary" />
        <input
          type="color"
          aria-label="Cell background color"
          disabled={disabled}
          value={cellAttributes.backgroundColor || '#FFFFFF'}
          onChange={(event) => editor.chain().focus().setCellAttribute('backgroundColor', event.target.value).run()}
          className={cn(
            'h-9 w-9 rounded-md border border-surface bg-white p-1',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
        {COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            className="h-6 w-6 rounded border border-surface"
            style={{ backgroundColor: color }}
            aria-label={`Set cell background ${color}`}
            disabled={disabled}
            onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', color).run()}
          />
        ))}
      </div>

      <div className="h-6 w-px bg-surface" aria-hidden />

      {/* Layout */}
      <ToolbarButton
        title={zebra ? 'Disable alternating rows' : 'Enable alternating rows'}
        aria-label={zebra ? 'Disable alternating rows' : 'Enable alternating rows'}
        disabled={disabled}
        isActive={zebra}
        onClick={() =>
          editor.chain().focus().updateAttributes('table', { alternatingRows: !zebra }).run()
        }
      >
        <LayoutGrid className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSelect
        aria-label="Cell padding"
        disabled={disabled}
        value={padding}
        onChange={(event) =>
          editor.chain().focus().updateAttributes('table', { cellPadding: event.target.value }).run()
        }
      >
        <option value="compact">Padding: compact</option>
        <option value="normal">Padding: normal</option>
        <option value="spacious">Padding: spacious</option>
      </ToolbarSelect>

      <ToolbarSelect
        aria-label="Table border radius"
        disabled={disabled}
        value={tableRadius}
        onChange={(event) =>
          editor.chain().focus().updateAttributes('table', { borderRadius: event.target.value }).run()
        }
      >
        {BORDER_RADII.map((radius) => (
          <option key={radius} value={radius}>
            Table radius: {radius}
          </option>
        ))}
      </ToolbarSelect>

      <ToolbarSelect
        aria-label="Table float"
        disabled={disabled}
        value={float}
        onChange={(event) => editor.chain().focus().updateAttributes('table', { float: event.target.value }).run()}
      >
        <option value="none">Float: none</option>
        <option value="left">Float: left</option>
        <option value="right">Float: right</option>
      </ToolbarSelect>

      <ToolbarButton
        title="Toggle header row"
        aria-label="Toggle header row"
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      >
        <LayoutGrid className="h-4 w-4" />
      </ToolbarButton>

      <div className="h-6 w-px bg-surface" aria-hidden />

      {/* Advanced */}
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
        title="Delete table"
        aria-label="Delete table"
        disabled={disabled}
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}
