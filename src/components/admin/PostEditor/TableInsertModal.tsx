'use client';

import { useCallback, useState } from 'react';
import { Table2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarSelect } from './ToolbarSelect';

export interface TableInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (rows: number, cols: number, withHeaderRow: boolean) => void;
}

export function TableInsertModal({
  isOpen,
  onClose,
  onInsert,
}: TableInsertModalProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);
  const [preview, setPreview] = useState<number[][]>([]);

  const handleRowsChange = useCallback((value: string) => {
    const newRows = Math.min(Math.max(parseInt(value) || 1, 1), 20);
    setRows(newRows);
    updatePreview(newRows, cols);
  }, [cols]);

  const handleColsChange = useCallback((value: string) => {
    const newCols = Math.min(Math.max(parseInt(value) || 1, 1), 10);
    setCols(newCols);
    updatePreview(rows, newCols);
  }, [rows]);

  const updatePreview = (r: number, c: number) => {
    const newPreview: number[][] = [];
    for (let i = 0; i < Math.min(r, 6); i++) {
      newPreview.push(Array.from({ length: Math.min(c, 10) }, (_, j) => i * 100 + j));
    }
    setPreview(newPreview);
  };

  const handleInsert = useCallback(() => {
    onInsert(rows, cols, withHeaderRow);
    onClose();
    // Reset to defaults
    setRows(3);
    setCols(3);
    setWithHeaderRow(true);
    updatePreview(3, 3);
  }, [rows, cols, withHeaderRow, onInsert, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg border border-surface bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface px-4 py-3">
          <div className="flex items-center gap-2">
            <Table2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-secondary">Insert Table</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-text/50 hover:bg-surface hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Size controls */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="table-rows" className="text-sm font-medium text-secondary">
                Rows
              </label>
              <ToolbarSelect
                id="table-rows"
                value={String(rows)}
                onChange={(e) => handleRowsChange(e.target.value)}
                className="w-full"
              >
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </ToolbarSelect>
            </div>

            <div className="space-y-1">
              <label htmlFor="table-cols" className="text-sm font-medium text-secondary">
                Columns
              </label>
              <ToolbarSelect
                id="table-cols"
                value={String(cols)}
                onChange={(e) => handleColsChange(e.target.value)}
                className="w-full"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </ToolbarSelect>
            </div>
          </div>

          {/* Header row toggle */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="header-row"
              checked={withHeaderRow}
              onChange={(e) => setWithHeaderRow(e.target.checked)}
              className="h-4 w-4 rounded border-surface text-primary focus:ring-primary/40"
            />
            <label htmlFor="header-row" className="text-sm text-text">
              First row is header
            </label>
          </div>

          {/* Preview */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-secondary">Preview</p>
            <div className="overflow-hidden rounded border border-surface bg-background">
              <table className="w-full border-collapse">
                <tbody>
                  {preview.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className={cn(
                            'border border-surface px-2 py-1 text-center text-xs',
                            withHeaderRow && rowIndex === 0
                              ? 'bg-surface text-secondary'
                              : 'bg-white'
                          )}
                        >
                          {withHeaderRow && rowIndex === 0
                            ? `Header ${colIndex + 1}`
                            : `${rowIndex + 1},${colIndex + 1}`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows > 6 || cols > 10 ? (
                <p className="border-t border-surface px-2 py-1 text-xs text-text/50">
                  Preview shows first {Math.min(rows, 6)} × {Math.min(cols, 10)} cells
                </p>
              ) : null}
            </div>
          </div>

          {/* Quick insert buttons */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-secondary">Quick insert</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { r: 2, c: 2 },
                { r: 3, c: 3 },
                { r: 4, c: 4 },
                { r: 5, c: 5 },
                { r: 3, c: 4 },
                { r: 4, c: 3 },
                { r: 5, c: 2 },
                { r: 2, c: 5 },
              ].map((size) => (
                <button
                  key={`${size.r}x${size.c}`}
                  type="button"
                  onClick={() => {
                    setRows(size.r);
                    setCols(size.c);
                    updatePreview(size.r, size.c);
                  }}
                  className={cn(
                    'rounded border border-surface px-2 py-1 text-xs transition-colors',
                    rows === size.r && cols === size.c
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white hover:bg-primary/10'
                  )}
                >
                  {size.r} × {size.c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-surface px-4 py-3">
          <ToolbarButton onClick={onClose}>Cancel</ToolbarButton>
          <ToolbarButton
            variant="primary"
            onClick={handleInsert}
          >
            <Table2 className="mr-1.5 h-4 w-4" />
            Insert {rows}×{cols} table
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
}
