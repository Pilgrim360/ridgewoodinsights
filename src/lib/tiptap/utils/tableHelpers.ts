import type { Editor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import { CellSelection, selectedRect, selectionCell, TableMap } from '@tiptap/pm/tables';

export type BorderStyle = 'none' | 'solid' | 'dashed' | 'dotted';
export type BorderWidth = '1px' | '2px' | '3px';
export type BorderRadius = '0px' | '4px' | '6px' | '8px';

export type TableBorderPreset =
  | 'table-borders-thin'
  | 'table-borders-thick'
  | 'table-borders-dashed'
  | 'table-borders-none'
  | 'table-borders-header-only';

export type TableTheme = 'light' | 'data' | 'minimal' | 'custom';

export interface BorderAttributes {
  borderStyle: BorderStyle;
  borderTopWidth: BorderWidth;
  borderRightWidth: BorderWidth;
  borderBottomWidth: BorderWidth;
  borderLeftWidth: BorderWidth;
  borderColor: string;
  borderRadius: BorderRadius;
}

export interface CellStyleAttributes extends BorderAttributes {
  backgroundColor: string | null;
  textColor: string | null;
}

export const DEFAULT_BORDER_COLOR = '#E2E7ED';

export const DEFAULT_BORDER_ATTRIBUTES: BorderAttributes = {
  borderStyle: 'solid',
  borderTopWidth: '1px',
  borderRightWidth: '1px',
  borderBottomWidth: '1px',
  borderLeftWidth: '1px',
  borderColor: DEFAULT_BORDER_COLOR,
  borderRadius: '0px',
};

export const DEFAULT_CELL_STYLE_ATTRIBUTES: CellStyleAttributes = {
  ...DEFAULT_BORDER_ATTRIBUTES,
  backgroundColor: null,
  textColor: null,
};

export function normalizeHexColor(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('#')) {
    const hex = trimmed.toUpperCase();
    if (/^#([0-9A-F]{3}){1,2}$/.test(hex)) {
      return hex.length === 4
        ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
        : hex;
    }
    return trimmed;
  }

  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i
  );

  if (!rgbMatch) return trimmed;

  const r = Math.max(0, Math.min(255, Number(rgbMatch[1])));
  const g = Math.max(0, Math.min(255, Number(rgbMatch[2])));
  const b = Math.max(0, Math.min(255, Number(rgbMatch[3])));

  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase();
}

export function composeBorderSideStyle({
  side,
  width,
  style,
  color,
}: {
  side: 'top' | 'right' | 'bottom' | 'left';
  width: BorderWidth;
  style: BorderStyle;
  color: string;
}): string {
  if (style === 'none') {
    return `border-${side}: 0 none transparent;`;
  }

  return `border-${side}: ${width} ${style} ${color};`;
}

export function composeCellInlineStyle(attrs: CellStyleAttributes): string {
  const parts: string[] = [];

  parts.push(
    composeBorderSideStyle({
      side: 'top',
      width: attrs.borderTopWidth,
      style: attrs.borderStyle,
      color: attrs.borderColor,
    })
  );

  parts.push(
    composeBorderSideStyle({
      side: 'right',
      width: attrs.borderRightWidth,
      style: attrs.borderStyle,
      color: attrs.borderColor,
    })
  );

  parts.push(
    composeBorderSideStyle({
      side: 'bottom',
      width: attrs.borderBottomWidth,
      style: attrs.borderStyle,
      color: attrs.borderColor,
    })
  );

  parts.push(
    composeBorderSideStyle({
      side: 'left',
      width: attrs.borderLeftWidth,
      style: attrs.borderStyle,
      color: attrs.borderColor,
    })
  );

  if (attrs.backgroundColor) {
    parts.push(`background-color: ${attrs.backgroundColor};`);
  }

  if (attrs.textColor) {
    parts.push(`color: ${attrs.textColor};`);
  }

  if (attrs.borderRadius && attrs.borderRadius !== '0px') {
    parts.push(`border-radius: ${attrs.borderRadius};`);
  }

  return parts.join(' ');
}

export type TableSelectionType = 'cell' | 'row' | 'column' | 'table' | null;

export function getTableSelectionType(state: EditorState): TableSelectionType {
  const { selection } = state;

  if (!(selection instanceof CellSelection)) return null;

  const rect = selectedRect(state);
  const fullWidth = rect.left === 0 && rect.right === rect.map.width;
  const fullHeight = rect.top === 0 && rect.bottom === rect.map.height;

  if (fullWidth && fullHeight) return 'table';
  if (fullWidth) return 'row';
  if (fullHeight) return 'column';
  return 'cell';
}

export function findParentTable(state: EditorState): { node: ProseMirrorNode; pos: number } | null {
  const { $from } = state.selection;

  for (let depth = $from.depth; depth > 0; depth -= 1) {
    const node = $from.node(depth);
    if (node.type.name === 'table') {
      return {
        node,
        pos: $from.before(depth),
      };
    }
  }

  return null;
}

export function updateTableInTransaction({
  tr,
  tableNode,
  tablePos,
  tableAttrs,
  cellAttrs,
}: {
  tr: Transaction;
  tableNode: ProseMirrorNode;
  tablePos: number;
  tableAttrs?: Record<string, unknown>;
  cellAttrs?: Partial<CellStyleAttributes>;
}): Transaction {
  let nextTr = tr;

  if (tableAttrs) {
    nextTr = nextTr.setNodeMarkup(tablePos, undefined, {
      ...tableNode.attrs,
      ...tableAttrs,
    });
  }

  if (cellAttrs) {
    tableNode.descendants((node, offset) => {
      if (node.type.name !== 'tableCell' && node.type.name !== 'tableHeader') {
        return;
      }

      const pos = tablePos + 1 + offset;
      nextTr = nextTr.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        ...cellAttrs,
      });
    });
  }

  return nextTr;
}

export function applyBorderPresetToActiveTable(editor: Editor, preset: TableBorderPreset): boolean {
  const found = findParentTable(editor.state);
  if (!found) return false;

  const { node: tableNode, pos: tablePos } = found;

  const tr = editor.state.tr;
  const presetAttrs: Partial<CellStyleAttributes> = {};

  switch (preset) {
    case 'table-borders-thin':
      presetAttrs.borderStyle = 'solid';
      presetAttrs.borderTopWidth = '1px';
      presetAttrs.borderRightWidth = '1px';
      presetAttrs.borderBottomWidth = '1px';
      presetAttrs.borderLeftWidth = '1px';
      break;
    case 'table-borders-thick':
      presetAttrs.borderStyle = 'solid';
      presetAttrs.borderTopWidth = '2px';
      presetAttrs.borderRightWidth = '2px';
      presetAttrs.borderBottomWidth = '2px';
      presetAttrs.borderLeftWidth = '2px';
      break;
    case 'table-borders-dashed':
      presetAttrs.borderStyle = 'dashed';
      presetAttrs.borderTopWidth = '1px';
      presetAttrs.borderRightWidth = '1px';
      presetAttrs.borderBottomWidth = '1px';
      presetAttrs.borderLeftWidth = '1px';
      break;
    case 'table-borders-none':
      presetAttrs.borderStyle = 'none';
      presetAttrs.borderTopWidth = '1px';
      presetAttrs.borderRightWidth = '1px';
      presetAttrs.borderBottomWidth = '1px';
      presetAttrs.borderLeftWidth = '1px';
      break;
    case 'table-borders-header-only':
      presetAttrs.borderStyle = 'none';
      presetAttrs.borderTopWidth = '1px';
      presetAttrs.borderRightWidth = '1px';
      presetAttrs.borderBottomWidth = '1px';
      presetAttrs.borderLeftWidth = '1px';
      break;
  }

  const nextTr = updateTableInTransaction({
    tr,
    tableNode,
    tablePos,
    tableAttrs: {
      borderPreset: preset,
    },
    cellAttrs: presetAttrs,
  });

  editor.view.dispatch(nextTr);
  editor.view.focus();

  return true;
}

export function applyTableTheme(editor: Editor, theme: TableTheme): boolean {
  const found = findParentTable(editor.state);
  if (!found) return false;

  const { node: tableNode, pos: tablePos } = found;

  const themeAttrs: Record<string, unknown> = {
    theme,
  };

  if (theme === 'data') {
    themeAttrs.alternatingRows = true;
    themeAttrs.borderPreset = 'table-borders-thin';
  }

  if (theme === 'light') {
    themeAttrs.alternatingRows = false;
    themeAttrs.borderPreset = 'table-borders-thin';
  }

  if (theme === 'minimal') {
    themeAttrs.alternatingRows = false;
    themeAttrs.borderPreset = 'table-borders-header-only';
  }

  const tr = updateTableInTransaction({
    tr: editor.state.tr,
    tableNode,
    tablePos,
    tableAttrs: themeAttrs,
  });

  editor.view.dispatch(tr);
  editor.view.focus();

  return true;
}

export function selectActiveRow(editor: Editor): boolean {
  try {
    const $cell = selectionCell(editor.state);
    const selection = CellSelection.rowSelection($cell);
    const tr = editor.state.tr.setSelection(selection);
    editor.view.dispatch(tr);
    editor.view.focus();
    return true;
  } catch {
    return false;
  }
}

export function selectActiveColumn(editor: Editor): boolean {
  try {
    const $cell = selectionCell(editor.state);
    const selection = CellSelection.colSelection($cell);
    const tr = editor.state.tr.setSelection(selection);
    editor.view.dispatch(tr);
    editor.view.focus();
    return true;
  } catch {
    return false;
  }
}

export function selectActiveTable(editor: Editor): boolean {
  const found = findParentTable(editor.state);
  if (!found) return false;

  const { node: tableNode, pos: tablePos } = found;
  const map = TableMap.get(tableNode);

  const tableStart = tablePos + 1;
  const anchor = tableStart + map.positionAt(0, 0, tableNode);
  const head = tableStart + map.positionAt(map.height - 1, map.width - 1, tableNode);

  const tr = editor.state.tr.setSelection(CellSelection.create(editor.state.doc, anchor, head));
  editor.view.dispatch(tr);
  editor.view.focus();

  return true;
}
