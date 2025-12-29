'use client';

import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { TABLE_PRESETS, validateTableDimensions, clamp } from '@/lib/tiptap/tableHelpers';

export interface TableCreationData {
  rows: number;
  cols: number;
  headerRow: boolean;
  headerColumn: boolean;
}

interface TableCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: TableCreationData) => void;
}

// Simple Grid icon component since lucide-react doesn't have all variants
const GridIcon = ({ rows, cols }: { rows: number; cols: number }) => {
  const size = rows === 2 && cols === 2 ? 2 :
               rows === 3 && cols === 3 ? 3 :
               rows === 4 && cols === 4 ? 4 :
               rows === 5 && cols === 5 ? 5 :
               2;
  
  return (
    <svg className="w-6 h-6 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {Array.from({ length: size }).map((_, i) => (
        <React.Fragment key={i}>
          <line x1={(i + 1) * (24 / size)} y1="0" x2={(i + 1) * (24 / size)} y2="24" />
          <line x1="0" y1={(i + 1) * (24 / size)} x2="24" y2={(i + 1) * (24 / size)} />
        </React.Fragment>
      ))}
    </svg>
  );
};

import React from 'react';

export function TableCreationModal({
  isOpen,
  onClose,
  onConfirm,
}: TableCreationModalProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [headerRow, setHeaderRow] = useState(true);
  const [headerColumn, setHeaderColumn] = useState(false);
  const [showCustomInputs, setShowCustomInputs] = useState(false);

  const handlePresetSelect = useCallback((presetRows: number, presetCols: number) => {
    setRows(presetRows);
    setCols(presetCols);
    setShowCustomInputs(false);
  }, []);

  const handleRowsChange = useCallback((value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setRows(clamp(numValue, 1, 100));
    }
  }, []);

  const handleColsChange = useCallback((value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setCols(clamp(numValue, 1, 50));
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (validateTableDimensions(rows, cols)) {
      onConfirm({ rows, cols, headerRow, headerColumn });
      onClose();
    }
  }, [rows, cols, headerRow, headerColumn, onClose, onConfirm]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleConfirm();
      }
    },
    [onClose, handleConfirm]
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="table-creation-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface">
          <h2 id="table-creation-title" className="text-lg font-semibold text-secondary">
            Create Table
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-surface/50 text-text transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Preset grids */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-text">Quick Presets</Label>
            <div className="grid grid-cols-4 gap-3">
              {TABLE_PRESETS.map((preset) => {
                const isSelected = rows === preset.rows && cols === preset.cols;

                return (
                  <button
                    key={`${preset.rows}x${preset.cols}`}
                    type="button"
                    onClick={() => handlePresetSelect(preset.rows, preset.cols)}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-surface hover:border-primary/50 hover:bg-surface/30'
                    )}
                    aria-pressed={isSelected}
                  >
                    <GridIcon rows={preset.rows} cols={preset.cols} />
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isSelected ? 'text-primary' : 'text-text/70'
                      )}
                    >
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom dimensions toggle */}
          <button
            type="button"
            onClick={() => setShowCustomInputs(!showCustomInputs)}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors"
          >
            {showCustomInputs ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Custom dimensions
          </button>

          {/* Custom inputs */}
          {showCustomInputs && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-background rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="custom-rows" className="text-sm">
                  Rows (1-100)
                </Label>
                <Input
                  id="custom-rows"
                  type="number"
                  min={1}
                  max={100}
                  value={rows}
                  onChange={(e) => handleRowsChange(e.target.value)}
                  hasError={!validateTableDimensions(rows, cols)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-cols" className="text-sm">
                  Columns (1-50)
                </Label>
                <Input
                  id="custom-cols"
                  type="number"
                  min={1}
                  max={50}
                  value={cols}
                  onChange={(e) => handleColsChange(e.target.value)}
                  hasError={!validateTableDimensions(rows, cols)}
                />
              </div>
            </div>
          )}

          {/* Header options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-text">Header Options</Label>
            <div className="space-y-2">
              <Checkbox
                id="header-row"
                checked={headerRow}
                onChange={(e) => setHeaderRow(e.target.checked)}
              >
                First row as header
              </Checkbox>
              <p className="text-xs text-text/60 ml-6">
                Applies bold, centered styling to the first row
              </p>
            </div>
            <div className="space-y-2">
              <Checkbox
                id="header-column"
                checked={headerColumn}
                onChange={(e) => setHeaderColumn(e.target.checked)}
              >
                First column as header
              </Checkbox>
              <p className="text-xs text-text/60 ml-6">
                Applies bold, centered styling to the first column
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-text">Preview</Label>
            <div className="p-4 bg-background rounded-lg overflow-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {Array.from({ length: Math.min(rows, 5) }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: Math.min(cols, 5) }).map((_, colIndex) => {
                        const isHeader =
                          (headerRow && rowIndex === 0) ||
                          (headerColumn && colIndex === 0);
                        return (
                          <td
                            key={colIndex}
                            className={cn(
                              'border border-surface p-2 text-center text-xs',
                              isHeader && 'bg-[#E8EAED] font-semibold'
                            )}
                          >
                            {rowIndex === 0 && colIndex === 0
                              ? `${rows}×${cols}`
                              : isHeader
                              ? 'Header'
                              : 'Cell'}
                          </td>
                        );
                      })}
                      {cols > 5 && (
                        <td className="border border-surface p-2 text-center text-xs text-text/50">
                          ...
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows > 5 && (
                <p className="text-xs text-text/50 text-center mt-2">
                  +{rows - 5} more rows
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface bg-background/50">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!validateTableDimensions(rows, cols)}
          >
            Create Table
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
