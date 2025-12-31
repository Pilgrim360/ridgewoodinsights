import { Editor } from '@tiptap/react';

export interface SelectionState {
  selectedCells: { row: number; col: number }[];
  selectedRows: number[];
  selectedColumns: number[];
  isTableSelected: boolean;
  selectionType: 'none' | 'cell' | 'row' | 'column' | 'table';
}

export function getTableSelectionState(editor: Editor): SelectionState {
  const isTableActive = editor.isActive('table');

  if (!isTableActive) {
    return {
      selectedCells: [],
      selectedRows: [],
      selectedColumns: [],
      isTableSelected: false,
      selectionType: 'none',
    };
  }

  return {
    selectedCells: [],
    selectedRows: [],
    selectedColumns: [],
    isTableSelected: editor.isActive('table'),
    selectionType: editor.isActive('table') ? 'table' : 'none',
  };
}

export const tableCommands = {
  selectCell: () => {
    // Implementation for selecting a specific cell
  },
  selectTable: () => {
    // Implementation for selecting the entire table
  },
};
