// Custom TipTap Commands for Table Manipulation
// Extends the editor with enterprise-grade table commands

import { Editor } from '@tiptap/core';
import { getThemeById, TableTheme } from '../styles/tableThemes';
import { getTableInfo } from './tableSelection';

// Extended editor commands interface
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableAdvanced: {
      // Table creation
      insertTable: (options: { rows: number; cols: number; withHeader?: boolean; theme?: string }) => ReturnType;

      // Table attributes
      setTableTheme: (themeId: string) => ReturnType;
      setTableBorderStyle: (style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      setTableBorderColor: (color: string) => ReturnType;
      setTableBorderWidth: (width: number) => ReturnType;

      // Cell styling
      setCellBackground: (color: string) => ReturnType;
      setCellTextColor: (color: string) => ReturnType;
      setCellBorderTop: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      setCellBorderBottom: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      setCellBorderLeft: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      setCellBorderRight: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      setCellBorderAll: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      clearCellBorders: () => ReturnType;

      // Header styling
      setHeaderBackground: (color: string) => ReturnType;
      setHeaderTextColor: (color: string) => ReturnType;
      setHeaderBorderAll: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;

      // Theme application
      applyTableTheme: (themeId: string) => ReturnType;
      applyThemeToAllCells: (theme: TableTheme) => ReturnType;

      // Selection-based operations
      applyBorderToSelection: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      applyBackgroundToSelection: (color: string) => ReturnType;

      // Row/Column operations
      insertRowAt: (position: number) => ReturnType;
      insertColumnAt: (position: number) => ReturnType;
      deleteRowAt: (position: number) => ReturnType;
      deleteColumnAt: (position: number) => ReturnType;
    };
  }
}

// Helper to create table HTML
function createTableHTML(rows: number, cols: number, withHeader: boolean, theme: string): string {
  let html = `<table data-component="advancedTable" data-theme="${theme}">`;

  for (let i = 0; i < rows; i++) {
    html += '<tr>';
    for (let j = 0; j < cols; j++) {
      const isHeader = withHeader && i === 0;
      const tag = isHeader ? 'th' : 'td';
      html += `<${tag} data-component="${isHeader ? 'advancedTableHeader' : 'advancedTableCell'}">`;
      html += '</' + tag + '>';
    }
    html += '</tr>';
  }

  html += '</table>';
  return html;
}

// Create table insertion command
export function createInsertTableCommand(editor: Editor) {
  return function insertTable(options: {
    rows: number;
    cols: number;
    withHeader?: boolean;
    theme?: string;
  }): boolean {
    const { rows, cols, withHeader = true, theme = 'minimal' } = options;

    // Validate input
    if (rows < 1 || cols < 1 || rows > 50 || cols > 50) {
      console.warn('Invalid table dimensions');
      return false;
    }

    // Create table HTML
    const tableHTML = createTableHTML(rows, cols, withHeader, theme);

    // Insert the table
    editor.commands.insertContent(tableHTML);

    // Move cursor to first cell content
    setTimeout(() => {
      const tableInfo = getTableInfo(editor);
      if (tableInfo) {
        const firstCellStart = tableInfo.tableStart + 5; // After <table><tr><td>
        editor.commands.setTextSelection(firstCellStart);
      }
    }, 10);

    return true;
  };
}

// Create theme application command
export function createApplyThemeCommand(editor: Editor) {
  return function applyTableTheme(themeId: string): boolean {
    const theme = getThemeById(themeId);
    if (!theme) {
      console.warn(`Theme "${themeId}" not found`);
      return false;
    }

    // Apply theme to table
    editor.commands.setTableTheme(themeId);
    editor.commands.setTableBorderStyle(theme.config.borderStyle);
    editor.commands.setTableBorderColor(theme.config.borderColor);
    editor.commands.setTableBorderWidth(theme.config.borderWidth);

    return true;
  };
}

// Create border style command
export function createSetBorderStyleCommand(editor: Editor) {
  return function setBorderStyle(style: 'solid' | 'dashed' | 'dotted'): boolean {
    editor.commands.setTableBorderStyle(style);
    return true;
  };
}

// Create border color command
export function createSetBorderColorCommand(editor: Editor) {
  return function setBorderColor(color: string): boolean {
    editor.commands.setTableBorderColor(color);
    return true;
  };
}

// Create border width command
export function createSetBorderWidthCommand(editor: Editor) {
  return function setBorderWidth(width: number): boolean {
    editor.commands.setTableBorderWidth(Math.max(1, Math.min(10, width)));
    return true;
  };
}

// Create cell background command
export function createSetCellBackgroundCommand(editor: Editor) {
  return function setCellBackground(color: string): boolean {
    editor.commands.setCellBackground(color);
    return true;
  };
}

// Create cell text color command
export function createSetCellTextColorCommand(editor: Editor) {
  return function setCellTextColor(color: string): boolean {
    editor.commands.setCellTextColor(color);
    return true;
  };
}

// Create cell border all command
export function createSetCellBorderAllCommand(editor: Editor) {
  return function setCellBorderAll(
    color: string,
    width: number,
    style: 'solid' | 'dashed' | 'dotted'
  ): boolean {
    editor.commands.setCellBorderAll(color, width, style);
    return true;
  };
}

// Create clear cell borders command
export function createClearCellBordersCommand(editor: Editor) {
  return function clearCellBorders(): boolean {
    editor.commands.clearCellBorders();
    return true;
  };
}

// Register all table commands with editor
export function registerTableCommands(editor: Editor): void {
  // These commands are already registered in the extensions
  // This function is for any custom commands that need manual registration
}

// Utility to get table cell at cursor
export function getCellAtCursor(editor: Editor): { row: number; col: number } | null {
  const tableInfo = getTableInfo(editor);
  if (!tableInfo) return null;

  const { from } = editor.state.selection;

  // Calculate approximate position
  const relativePos = from - tableInfo.tableStart;
  let currentPos = 0;

  for (let row = 0; row < tableInfo.rows; row++) {
    const rowLength = tableInfo.rowLengths[row] || 0;
    if (currentPos + rowLength + 2 > relativePos) {
      const col = Math.floor((relativePos - currentPos - 2) / 20); // Approximate
      return { row, col: Math.max(0, col) };
    }
    currentPos += rowLength + 2;
  }

  return null;
}

// Utility to check if theme is applied
export function isThemeApplied(editor: Editor, themeId: string): boolean {
  const { selection, doc } = editor.state;
  const { from } = selection;
  const resolved = doc.resolve(from);

  for (let i = 0; i < resolved.depth; i++) {
    const node = resolved.node(i);
    if (node && node.type.name.includes('table')) {
      return node.attrs?.theme === themeId;
    }
  }

  return false;
}

// Utility to get available themes
export { TABLE_THEMES } from '../styles/tableThemes';
