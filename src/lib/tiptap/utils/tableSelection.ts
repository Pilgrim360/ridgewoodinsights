// Table Selection Management Utility
// Provides functions for detecting and managing table selections

import { Editor } from '@tiptap/core';

// Selection type definitions
export type SelectionType = 'cell' | 'range' | 'row' | 'column' | 'table' | 'none';

// Cell position interface
export interface CellPosition {
  row: number;
  column: number;
  from: number;
  to: number;
}

// Selection context interface
export interface SelectionContext {
  type: SelectionType;
  cells: CellPosition[];
  startCell: CellPosition | null;
  endCell: CellPosition | null;
  rowCount: number;
  columnCount: number;
}

// Helper to find parent table element
function findParentTable(node: Node): HTMLTableElement | null {
  while (node && node.parentElement) {
    if (node instanceof HTMLTableElement) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

// Detect the current selection type
export function detectSelectionType(editor: Editor): SelectionContext {
  const { selection } = editor.state;
  const { from, to } = selection;

  // Check for single cell selection (cursor in cell)
  if (from === to) {
    const resolved = editor.state.doc.resolve(from);
    const nodeType = resolved.parent.type.name;

    if (nodeType.includes('tableCell') || nodeType.includes('tableHeader')) {
      const table = findParentTable(editor.view.domAtPos(from).node as Node);
      
      if (table) {
        const rows = table.rows.length;
        const columns = table.rows[0]?.cells.length || 0;

        return {
          type: 'cell',
          cells: [],
          startCell: null,
          endCell: null,
          rowCount: rows,
          columnCount: columns,
        };
      }
    }
  }

  return {
    type: 'none',
    cells: [],
    startCell: null,
    endCell: null,
    rowCount: 0,
    columnCount: 0,
  };
}

// Get selected cells as array
export function getSelectedCells(editor: Editor): CellPosition[] {
  const { selection, doc } = editor.state;
  const { from, to } = selection;

  // If collapsed selection, return empty
  if (from === to) {
    return [];
  }

  const cells: CellPosition[] = [];

  // Get content between from and to
  const fragment = doc.slice(from, to).content;

  // Iterate through content to find table cells
  fragment.forEach((node, offset) => {
    if (
      node.type.name === 'tableCell' ||
      node.type.name === 'advancedTableCell' ||
      node.type.name === 'tableHeader' ||
      node.type.name === 'advancedTableHeader'
    ) {
      cells.push({
        row: -1,
        column: -1,
        from: from + offset,
        to: from + offset + node.nodeSize,
      });
    }
  });

  return cells;
}

// Get table information
interface TableInfo {
  tableStart: number;
  tableEnd: number;
  rows: number;
  columns: number;
  rowLengths: number[];
}

export function getTableInfo(editor: Editor): TableInfo | null {
  const { selection, doc } = editor.state;
  const { from } = selection;

  // Find the table node
  const resolved = doc.resolve(from);
  let tableNode: { type: { name: string }; nodeSize: number; forEach: (callback: (row: { type: { name: string }; content: { size: number }; forEach: (cellCallback: () => void) => void }) => void) => void } | null = null;
  let tableStart = 0;

  // Walk up the tree to find table
  for (let i = 0; i < resolved.depth; i++) {
    const node = resolved.node(i);
    if (node && node.type.name.includes('table')) {
      tableNode = node;
      tableStart = resolved.start(i);
      break;
    }
  }

  if (!tableNode) {
    return null;
  }

  // Count rows and columns
  let rows = 0;
  let columns = 0;
  const rowLengths: number[] = [];

  tableNode.forEach((row: { type: { name: string }; content: { size: number }; forEach: (cellCallback: () => void) => void }) => {
    if (row.type.name.includes('tableRow')) {
      rows++;
      let cols = 0;
      row.forEach(() => {
        cols++;
      });
      rowLengths.push(row.content.size || 0);
      columns = Math.max(columns, cols);
    }
  });

  return {
    tableStart,
    tableEnd: tableStart + tableNode.nodeSize,
    rows,
    columns,
    rowLengths,
  };
}

// Check if cursor is inside a table
export function isInTable(editor: Editor): boolean {
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
}

// Get the current table node
interface TableNode {
  attrs: Record<string, unknown>;
  type: { name: string };
}

export function getCurrentTable(editor: Editor): TableNode | null {
  const { selection, doc } = editor.state;
  const { from } = selection;
  const resolved = doc.resolve(from);

  for (let i = 0; i < resolved.depth; i++) {
    const node = resolved.node(i);
    if (node && node.type.name.includes('table')) {
      return node as TableNode;
    }
  }

  return null;
}

// Get current table attributes
export function getCurrentTableAttributes(editor: Editor): Record<string, unknown> {
  const tableNode = getCurrentTable(editor);
  if (!tableNode) {
    return {};
  }

  return {
    theme: tableNode.attrs?.theme || 'minimal',
    borderStyle: tableNode.attrs?.borderStyle || 'solid',
    borderColor: tableNode.attrs?.borderColor || '#E2E7ED',
    borderWidth: tableNode.attrs?.borderWidth || 1,
  };
}

// Get current cell attributes
export function getCurrentCellAttributes(editor: Editor): Record<string, unknown> {
  const { selection, doc } = editor.state;
  const { from } = selection;
  const resolved = doc.resolve(from);

  const parentType = resolved.parent.type.name;
  if (parentType.includes('tableCell') || parentType.includes('tableHeader')) {
    return (resolved.parent.attrs as Record<string, unknown>) || {};
  }

  return {};
}

// Clear selection
export function clearSelection(editor: Editor): void {
  const { from } = editor.state.selection;
  editor.commands.setTextSelection(from);
}

// Select entire table
export function selectTable(editor: Editor): boolean {
  const tableInfo = getTableInfo(editor);
  if (!tableInfo) {
    return false;
  }

  editor.commands.selectTextblockEnd();
  return true;
}

// Select entire row
export function selectRow(editor: Editor, rowIndex: number): boolean {
  const tableInfo = getTableInfo(editor);
  if (!tableInfo || rowIndex >= tableInfo.rows) {
    return false;
  }

  // Calculate positions for the entire row
  const basePos = tableInfo.tableStart;
  let startPos = basePos + 1; // Skip table tag

  for (let i = 0; i < rowIndex; i++) {
    startPos += tableInfo.rowLengths[i] + 2;
  }

  // Row content starts after <tr>, ends before </tr>
  startPos += 2; // Skip <tr>
  const rowLength = tableInfo.rowLengths[rowIndex] || 0;
  const endPos = startPos + rowLength;

  editor.commands.setTextSelection({ from: startPos, to: endPos });
  return true;
}

// Select a single cell
export function selectCell(editor: Editor, row: number, column: number): boolean {
  const tableInfo = getTableInfo(editor);
  if (!tableInfo || row >= tableInfo.rows || column >= tableInfo.columns) {
    return false;
  }

  // Position cursor at the start of the cell
  const basePos = tableInfo.tableStart;
  let currentPos = basePos + 1; // Skip table tag

  for (let i = 0; i < row; i++) {
    currentPos += tableInfo.rowLengths[i] + 2; // +2 for tr tags
  }

  currentPos += column + 2; // +2 for tr and first td

  editor.commands.setTextSelection(currentPos);
  return true;
}
