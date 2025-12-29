'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Settings2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import {
  TABLE_BG_COLORS,
  BORDER_COLORS,
  BORDER_STYLES,
  BORDER_WIDTHS,
  CELL_PADDING,
  getDefaultTableAttributes,
} from '@/lib/tiptap/tableHelpers';
import type { Editor } from '@tiptap/react';

interface TablePropertiesDialogProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'general' | 'appearance' | 'headers' | 'advanced';

export function TablePropertiesDialog({
  editor,
  isOpen,
  onClose,
}: TablePropertiesDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // Get current table attributes
  const currentAttrs = useMemo(() => {
    const attrs = editor.getAttributes('table');
    return {
      backgroundColor: attrs.backgroundColor || getDefaultTableAttributes().backgroundColor,
      borderColor: attrs.borderColor || getDefaultTableAttributes().borderColor,
      borderStyle: attrs.borderStyle || getDefaultTableAttributes().borderStyle,
      borderWidth: attrs.borderWidth || getDefaultTableAttributes().borderWidth,
      cellPadding: attrs.cellPadding || getDefaultTableAttributes().cellPadding,
      width: attrs.width || getDefaultTableAttributes().width,
      fixedWidth: attrs.fixedWidth || getDefaultTableAttributes().fixedWidth,
      headerRow: attrs.headerRow !== false,
      headerColumn: attrs.headerColumn || getDefaultTableAttributes().headerColumn,
      responsiveMode: attrs.responsiveMode || getDefaultTableAttributes().responsiveMode,
      caption: attrs.caption || getDefaultTableAttributes().caption,
    };
  }, [editor]);

  // Local state for editing
  const [backgroundColor, setBackgroundColor] = useState(currentAttrs.backgroundColor);
  const [borderColor, setBorderColor] = useState(currentAttrs.borderColor);
  const [borderStyle, setBorderStyle] = useState(currentAttrs.borderStyle);
  const [borderWidth, setBorderWidth] = useState(currentAttrs.borderWidth);
  const [cellPadding, setCellPadding] = useState(currentAttrs.cellPadding);
  const [width, setWidth] = useState(currentAttrs.width);
  const [fixedWidth, setFixedWidth] = useState(currentAttrs.fixedWidth);
  const [headerRow, setHeaderRow] = useState(currentAttrs.headerRow);
  const [headerColumn, setHeaderColumn] = useState(currentAttrs.headerColumn);
  const [responsiveMode, setResponsiveMode] = useState(currentAttrs.responsiveMode);
  const [caption, setCaption] = useState(currentAttrs.caption);

  // Reset to current values when dialog opens
  useEffect(() => {
    if (isOpen) {
      setBackgroundColor(currentAttrs.backgroundColor);
      setBorderColor(currentAttrs.borderColor);
      setBorderStyle(currentAttrs.borderStyle);
      setBorderWidth(currentAttrs.borderWidth);
      setCellPadding(currentAttrs.cellPadding);
      setWidth(currentAttrs.width);
      setFixedWidth(currentAttrs.fixedWidth);
      setHeaderRow(currentAttrs.headerRow);
      setHeaderColumn(currentAttrs.headerColumn);
      setResponsiveMode(currentAttrs.responsiveMode);
      setCaption(currentAttrs.caption);
      setActiveTab('general');
    }
  }, [isOpen, currentAttrs]);

  // Apply changes
  const handleApply = useCallback(() => {
    editor.chain().focus().updateAttributes('table', {
      backgroundColor,
      borderColor,
      borderStyle,
      borderWidth,
      cellPadding,
      width,
      fixedWidth,
      headerRow,
      headerColumn,
      responsiveMode,
      caption,
    } as Record<string, unknown>).run();
    onClose();
  }, [editor, onClose, backgroundColor, borderColor, borderStyle, borderWidth, cellPadding, width, fixedWidth, headerRow, headerColumn, responsiveMode, caption]);

  // Reset to defaults
  const handleResetDefaults = useCallback(() => {
    const defaults = getDefaultTableAttributes();
    setBackgroundColor(defaults.backgroundColor);
    setBorderColor(defaults.borderColor);
    setBorderStyle(defaults.borderStyle);
    setBorderWidth(defaults.borderWidth);
    setCellPadding(defaults.cellPadding);
    setWidth(defaults.width);
    setFixedWidth(defaults.fixedWidth);
    setHeaderRow(defaults.headerRow);
    setHeaderColumn(defaults.headerColumn);
    setResponsiveMode(defaults.responsiveMode);
    setCaption(defaults.caption);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleApply();
      }
    },
    [onClose, handleApply]
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="table-properties-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 id="table-properties-title" className="text-lg font-semibold text-secondary">
              Table Properties
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-surface/50 text-text transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface">
          {(['general', 'appearance', 'headers', 'advanced'] as TabType[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 px-4 py-2 text-sm font-medium capitalize transition-colors',
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text/70 hover:text-secondary'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Width */}
              <div className="space-y-2">
                <Label htmlFor="table-width" className="text-sm">Table Width</Label>
                <div className="flex gap-2">
                  <Input
                    id="table-width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="100%, 600px, auto"
                    className="flex-1"
                  />
                  <Checkbox
                    id="fixed-width"
                    checked={fixedWidth}
                    onChange={(e) => setFixedWidth(e.target.checked)}
                    label="Fixed"
                  />
                </div>
              </div>

              {/* Cell Padding */}
              <div className="space-y-2">
                <Label htmlFor="cell-padding" className="text-sm">Cell Padding</Label>
                <Select
                  id="cell-padding"
                  value={cellPadding}
                  onChange={(e) => setCellPadding(e.target.value)}
                >
                  {CELL_PADDING.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name} ({option.value})
                    </option>
                  ))}
                </Select>
              </div>

              {/* Responsive Mode */}
              <div className="space-y-2">
                <Label htmlFor="responsive-mode" className="text-sm">Responsive Behavior</Label>
                <Select
                  id="responsive-mode"
                  value={responsiveMode}
                  onChange={(e) => setResponsiveMode(e.target.value)}
                >
                  <option value="scroll">Horizontal scroll</option>
                  <option value="stack">Stack on mobile</option>
                  <option value="collapse">Collapse borders</option>
                </Select>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              {/* Table Background */}
              <div className="space-y-2">
                <Label className="text-sm">Table Background</Label>
                <div className="flex flex-wrap gap-2">
                  {TABLE_BG_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setBackgroundColor(color.value)}
                      className={cn(
                        'w-8 h-8 rounded-md border-2 transition-all',
                        backgroundColor === color.value
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-surface hover:border-primary/50'
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Border Settings */}
              <div className="space-y-3 pt-4 border-t border-surface">
                <Label className="text-sm font-medium">Border Style</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="border-style" className="text-xs">Style</Label>
                    <Select
                      id="border-style"
                      value={borderStyle}
                      onChange={(e) => setBorderStyle(e.target.value)}
                    >
                      {BORDER_STYLES.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="border-width" className="text-xs">Width</Label>
                    <Select
                      id="border-width"
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(e.target.value)}
                    >
                      {BORDER_WIDTHS.map((width) => (
                        <option key={width.value} value={width.value}>
                          {width.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="border-color" className="text-xs">Color</Label>
                    <div className="flex gap-1">
                      {BORDER_COLORS.slice(0, 5).map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setBorderColor(color.value)}
                          className={cn(
                            'w-6 h-6 rounded border transition-all',
                            borderColor === color.value
                              ? 'border-primary ring-1 ring-primary'
                              : 'border-surface'
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Border Preview */}
                <div className="p-4 bg-background rounded-lg">
                  <div
                    className="w-full h-12 rounded"
                    style={{
                      borderStyle,
                      borderWidth,
                      borderColor,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Headers Tab */}
          {activeTab === 'headers' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Checkbox
                    id="header-row-toggle"
                    checked={headerRow}
                    onChange={(e) => setHeaderRow(e.target.checked)}
                  >
                    <span className="font-medium">Header Row</span>
                  </Checkbox>
                  {headerRow ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-text/40" />
                  )}
                </div>
                <p className="text-sm text-text/60 ml-6">
                  Applies bold, centered styling to the first row
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Checkbox
                    id="header-column-toggle"
                    checked={headerColumn}
                    onChange={(e) => setHeaderColumn(e.target.checked)}
                  >
                    <span className="font-medium">Header Column</span>
                  </Checkbox>
                  {headerColumn ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-text/40" />
                  )}
                </div>
                <p className="text-sm text-text/60 ml-6">
                  Applies bold, centered styling to the first column
                </p>
              </div>

              {/* Preview */}
              <div className="pt-4 border-t border-surface">
                <Label className="text-sm mb-2 block">Preview</Label>
                <div className="overflow-auto border border-surface rounded-lg">
                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      <tr>
                        <th
                          className={cn(
                            'border border-surface p-2',
                            headerRow && 'bg-[#E8EAED] font-semibold'
                          )}
                        >
                          {headerRow ? 'Header' : 'Cell'}
                        </th>
                        <td className="border border-surface p-2">Data</td>
                        <td className="border border-surface p-2">Data</td>
                      </tr>
                      <tr>
                        <th
                          className={cn(
                            'border border-surface p-2',
                            headerColumn && 'bg-[#E8EAED] font-semibold'
                          )}
                        >
                          {headerColumn ? 'Header' : 'Cell'}
                        </th>
                        <td className="border border-surface p-2">Data</td>
                        <td className="border border-surface p-2">Data</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="table-caption" className="text-sm">
                  Table Caption (optional)
                </Label>
                <Input
                  id="table-caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Enter a description or title..."
                />
                <p className="text-xs text-text/60">
                  A caption appears below the table for accessibility and context
                </p>
              </div>

              {/* Column Distribution */}
              <div className="space-y-2 pt-4 border-t border-surface">
                <Label className="text-sm">Column Distribution</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const colCount = editor.state.doc.firstChild?.childCount || 1;
                      const equalWidth = Array(colCount).fill(100 / colCount);
                      editor.chain().focus().updateAttributes('table', { columnWidths: equalWidth }).run();
                    }}
                  >
                    Equal Width
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      editor.chain().focus().updateAttributes('table', { columnWidths: null }).run();
                    }}
                  >
                    Auto Width
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      editor.chain().focus().updateAttributes('table', { columnWidths: [] }).run();
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-2 pt-4 border-t border-red-200">
                <Label className="text-sm text-red-600">Danger Zone</Label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this table?')) {
                      editor.chain().focus().deleteTable().run();
                      onClose();
                    }
                  }}
                  className="w-full"
                >
                  Delete Table
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface bg-background/50">
          <Button variant="ghost" size="sm" onClick={handleResetDefaults}>
            Reset to Defaults
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
