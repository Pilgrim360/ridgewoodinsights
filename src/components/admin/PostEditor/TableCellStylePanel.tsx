'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Palette, AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline, Square } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import {
  TABLE_BG_COLORS,
  BORDER_COLORS,
  BORDER_STYLES,
  BORDER_WIDTHS,
} from '@/lib/tiptap/tableHelpers';
import type { Editor } from '@tiptap/react';

interface TableCellStylePanelProps {
  editor: Editor;
  onClose: () => void;
}

type TabType = 'fill' | 'border' | 'text' | 'alignment';

export function TableCellStylePanel({
  editor,
  onClose,
}: TableCellStylePanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('fill');
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Get current cell attributes
  const currentCellAttrs = useMemo(() => {
    const { from } = editor.state.selection;
    const node = editor.state.doc.nodeAt(from);

    if (node && (node.type.name === 'tableCell' || node.type.name === 'tableHeader')) {
      return node.attrs;
    }
    return null;
  }, [editor]);

  // Local state for editing
  const [backgroundColor, setBackgroundColor] = useState(currentCellAttrs?.backgroundColor || 'transparent');
  const [textAlign, setTextAlign] = useState(currentCellAttrs?.textAlign || 'left');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [borderColor, setBorderColor] = useState(currentCellAttrs?.borderColor || '#E2E7ED');
  const [borderStyle, setBorderStyle] = useState(currentCellAttrs?.borderStyle || 'solid');
  const [borderWidth, setBorderWidth] = useState(currentCellAttrs?.borderWidth || '1px');

  // Update position on open
  useEffect(() => {
    if (editor) {
      const { dom } = editor.view;
      const rect = dom.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 10,
        left: Math.min(rect.left + 100, window.innerWidth - 320),
      });
    }
  }, [editor]);

  // Apply cell background
  const handleApplyBackground = useCallback((color: string) => {
    setBackgroundColor(color);
    editor.chain().focus().setCellAttribute('backgroundColor', color).run();
  }, [editor]);

  // Apply text alignment
  const handleApplyAlignment = useCallback((alignment: string) => {
    setTextAlign(alignment);
    editor.chain().focus().setTextAlign(alignment as 'left' | 'center' | 'right' | 'justify').run();
  }, [editor]);

  // Apply text formatting
  const handleApplyFormatting = useCallback((format: 'bold' | 'italic' | 'underline') => {
    switch (format) {
      case 'bold':
        setBold(!bold);
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        setItalic(!italic);
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        setUnderline(!underline);
        editor.chain().focus().toggleUnderline().run();
        break;
    }
  }, [editor, bold, italic, underline]);

  // Apply border settings - use setCellAttribute for table cells
  const handleApplyBorder = useCallback((type: 'color' | 'style' | 'width', value: string) => {
    if (type === 'color') setBorderColor(value);
    if (type === 'style') setBorderStyle(value);
    if (type === 'width') setBorderWidth(value);

    // Apply to current cell using setCellAttribute
    if (type === 'color') {
      editor.chain().focus().setCellAttribute('borderColor', value).run();
    } else if (type === 'style') {
      editor.chain().focus().setCellAttribute('borderStyle', value).run();
    } else if (type === 'width') {
      editor.chain().focus().setCellAttribute('borderWidth', value).run();
    }
  }, [editor]);

  // Reset cell styles
  const handleResetStyles = useCallback(() => {
    setBackgroundColor('transparent');
    setTextAlign('left');
    setBold(false);
    setItalic(false);
    setUnderline(false);
    setBorderColor('#E2E7ED');
    setBorderStyle('solid');
    setBorderWidth('1px');

    // Reset cell attributes
    editor.chain().focus()
      .setCellAttribute('backgroundColor', 'transparent')
      .setCellAttribute('textAlign', 'left')
      .setCellAttribute('borderColor', null)
      .setCellAttribute('borderStyle', null)
      .setCellAttribute('borderWidth', null)
      .run();
  }, [editor]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.cell-style-panel')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const tabs = [
    { id: 'fill' as TabType, label: 'Fill', icon: Palette },
    { id: 'border' as TabType, label: 'Border', icon: Square },
    { id: 'text' as TabType, label: 'Text', icon: Bold },
    { id: 'alignment' as TabType, label: 'Align', icon: AlignLeft },
  ];

  return createPortal(
    <div
      className="cell-style-panel fixed z-50 bg-white rounded-xl shadow-2xl w-72 overflow-hidden"
      style={{
        top: position.top,
        left: position.left,
        maxHeight: 'calc(100vh - 20px)',
      }}
      role="dialog"
      aria-label="Cell style panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface bg-background">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-secondary">Cell Styles</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md hover:bg-surface/50 text-text transition-colors"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center py-2 transition-colors',
                activeTab === tab.id
                  ? 'text-primary bg-primary/5 border-b-2 border-primary'
                  : 'text-text/70 hover:text-secondary hover:bg-surface/30'
              )}
              title={tab.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {/* Fill Tab */}
        {activeTab === 'fill' && (
          <div className="space-y-3">
            <Label className="text-xs font-medium text-text">Cell Background</Label>
            <div className="grid grid-cols-5 gap-2">
              {TABLE_BG_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleApplyBackground(color.value)}
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
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => handleApplyBackground('transparent')}
            >
              No Fill
            </Button>
          </div>
        )}

        {/* Border Tab */}
        {activeTab === 'border' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-text">Border Style</Label>
              <select
                value={borderStyle}
                onChange={(e) => handleApplyBorder('style', e.target.value)}
                className="w-full h-9 rounded-md border border-surface bg-white text-sm px-3"
              >
                {BORDER_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-text">Border Width</Label>
              <select
                value={borderWidth}
                onChange={(e) => handleApplyBorder('width', e.target.value)}
                className="w-full h-9 rounded-md border border-surface bg-white text-sm px-3"
              >
                {BORDER_WIDTHS.map((width) => (
                  <option key={width.value} value={width.value}>
                    {width.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-text">Border Color</Label>
              <div className="flex flex-wrap gap-2">
                {BORDER_COLORS.slice(0, 5).map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleApplyBorder('color', color.value)}
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

            {/* Border Preview */}
            <div className="p-3 bg-background rounded-lg">
              <div
                className="w-full h-8 rounded"
                style={{
                  borderStyle,
                  borderWidth,
                  borderColor,
                }}
              />
            </div>
          </div>
        )}

        {/* Text Tab */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <Label className="text-xs font-medium text-text">Text Formatting</Label>
            <div className="flex gap-2">
              <ToolbarButton
                title="Bold"
                aria-label="Bold"
                isActive={bold}
                onClick={() => handleApplyFormatting('bold')}
              >
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Italic"
                aria-label="Italic"
                isActive={italic}
                onClick={() => handleApplyFormatting('italic')}
              >
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Underline"
                aria-label="Underline"
                isActive={underline}
                onClick={() => handleApplyFormatting('underline')}
              >
                <Underline className="w-4 h-4" />
              </ToolbarButton>
            </div>
          </div>
        )}

        {/* Alignment Tab */}
        {activeTab === 'alignment' && (
          <div className="space-y-3">
            <Label className="text-xs font-medium text-text">Horizontal Alignment</Label>
            <div className="flex gap-2">
              <ToolbarButton
                title="Align left"
                aria-label="Align left"
                isActive={textAlign === 'left'}
                onClick={() => handleApplyAlignment('left')}
              >
                <AlignLeft className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Align center"
                aria-label="Align center"
                isActive={textAlign === 'center'}
                onClick={() => handleApplyAlignment('center')}
              >
                <AlignCenter className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Align right"
                aria-label="Align right"
                isActive={textAlign === 'right'}
                onClick={() => handleApplyAlignment('right')}
              >
                <AlignRight className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Justify"
                aria-label="Justify"
                isActive={textAlign === 'justify'}
                onClick={() => handleApplyAlignment('justify')}
              >
                <AlignJustify className="w-4 h-4" />
              </ToolbarButton>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-surface bg-background/50">
        <Button variant="ghost" size="sm" onClick={handleResetStyles}>
          Reset
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>,
    document.body
  );
}
