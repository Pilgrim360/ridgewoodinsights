'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Editor } from '@tiptap/react';

import {
  getTableSelectionType,
  type TableSelectionType,
  type CellStyleAttributes,
  DEFAULT_CELL_STYLE_ATTRIBUTES,
} from '@/lib/tiptap/utils/tableHelpers';

export interface TableSelectionState {
  isTableActive: boolean;
  selectionType: TableSelectionType;
  cellAttributes: CellStyleAttributes;
  tableAttributes: Record<string, unknown>;
}

export function useTableSelection(editor: Editor | null): TableSelectionState {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handler = () => setTick((value) => value + 1);

    editor.on('selectionUpdate', handler);
    editor.on('transaction', handler);

    return () => {
      editor.off('selectionUpdate', handler);
      editor.off('transaction', handler);
    };
  }, [editor]);

  return useMemo(() => {
    if (!editor) {
      return {
        isTableActive: false,
        selectionType: null,
        cellAttributes: DEFAULT_CELL_STYLE_ATTRIBUTES,
        tableAttributes: {},
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = tick;

    const isTableActive = editor.isActive('table');
    const selectionType = getTableSelectionType(editor.state);

    const cellAttributes = {
      ...DEFAULT_CELL_STYLE_ATTRIBUTES,
      ...(editor.getAttributes('tableCell') as Partial<CellStyleAttributes>),
      ...(editor.getAttributes('tableHeader') as Partial<CellStyleAttributes>),
    };

    const tableAttributes = editor.getAttributes('table') as Record<string, unknown>;

    return {
      isTableActive,
      selectionType,
      cellAttributes,
      tableAttributes,
    };
  }, [editor, tick]);
}
