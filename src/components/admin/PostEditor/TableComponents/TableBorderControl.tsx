'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  BORDER_STYLES,
  BORDER_WIDTH_PRESETS,
  BORDER_COLOR_PRESETS,
  RIDGEWOOD_PALETTE,
} from '@/lib/tiptap/styles/tableThemes';

interface BorderEdge {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

interface TableBorderControlProps {
  onApply: (color: string, width: number, style: string, edges: BorderEdge) => void;
  onClose?: () => void;
  className?: string;
}

type BorderStyleValue = 'solid' | 'dashed' | 'dotted';

export function TableBorderControl({
  onApply,
  onClose,
  className,
}: TableBorderControlProps) {
  const [borderStyle, setBorderStyle] = useState<BorderStyleValue>('solid');
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderColor, setBorderColor] = useState<string>(RIDGEWOOD_PALETTE.primary);
  const [selectedEdges, setSelectedEdges] = useState<BorderEdge>({
    top: true,
    bottom: true,
    left: true,
    right: true,
  });

  const handleEdgeToggle = (edge: keyof BorderEdge) => {
    setSelectedEdges((prev) => ({
      ...prev,
      [edge]: !prev[edge],
    }));
  };

  const handleSelectAllEdges = () => {
    setSelectedEdges({ top: true, bottom: true, left: true, right: true });
  };

  const handleClearEdges = () => {
    setSelectedEdges({ top: false, bottom: false, left: false, right: false });
  };

  const handleApply = useCallback(() => {
    onApply(borderColor, borderWidth, borderStyle, selectedEdges);
    onClose?.();
  }, [onApply, onClose, borderColor, borderWidth, borderStyle, selectedEdges]);

  // Custom color input
  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBorderColor(e.target.value);
  };

  return (
    <div className={cn('border-control', className)}>
      {/* Style Selector */}
      <div className="border-control-row">
        <span className="border-control-label w-16">Style:</span>
        <div className="border-style-selector">
          {BORDER_STYLES.map((style) => (
            <button
              key={style.value}
              className={cn(
                'border-style-btn',
                borderStyle === style.value && 'active'
              )}
              onClick={() => setBorderStyle(style.value)}
              title={style.label}
            >
              {/* SVG preview of border style */}
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                <line
                  x1="0"
                  y1="7"
                  x2="20"
                  y2="7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={
                    style.value === 'dashed'
                      ? '4 2'
                      : style.value === 'dotted'
                      ? '2 2'
                      : 'none'
                  }
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Width Selector */}
      <div className="border-control-row">
        <span className="border-control-label w-16">Width:</span>
        <div className="border-width-presets">
          {BORDER_WIDTH_PRESETS.map((width) => (
            <button
              key={width}
              className={cn(
                'border-width-btn',
                borderWidth === width && 'active'
              )}
              onClick={() => setBorderWidth(width)}
            >
              {width}px
            </button>
          ))}
        </div>
      </div>

      {/* Custom Width Input */}
      <div className="border-control-row">
        <span className="border-control-label w-16">Custom:</span>
        <input
          type="number"
          min="1"
          max="10"
          value={borderWidth}
          onChange={(e) =>
            setBorderWidth(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))
          }
          className="w-16 rounded border border-surface px-2 py-1 text-sm"
        />
        <span className="text-xs text-text">px</span>
      </div>

      {/* Color Selector */}
      <div className="border-control-row">
        <span className="border-control-label w-16">Color:</span>
        <div className="flex flex-wrap gap-1">
          {BORDER_COLOR_PRESETS.map((color) => (
            <button
              key={color}
              className={cn(
                'color-swatch',
                borderColor === color && 'active'
              )}
              style={{ backgroundColor: color }}
              onClick={() => setBorderColor(color)}
              title={color}
            />
          ))}
          <input
            type="color"
            value={borderColor}
            onChange={handleCustomColor}
            className="h-6 w-6 cursor-pointer rounded border border-surface"
            title="Custom color"
          />
        </div>
      </div>

      {/* Edge Selector */}
      <div className="border-control-row">
        <span className="border-control-label w-16">Apply to:</span>
        <div className="flex items-center gap-2">
          {/* Visual edge selector */}
          <div className="grid grid-cols-3 gap-1">
            {/* Top-Left corner (disabled) */}
            <div className="h-6 w-6" />
            {/* Top edge */}
            <button
              className={cn(
                'h-6 w-6 rounded-t border border-surface transition-colors',
                selectedEdges.top && 'bg-primary'
              )}
              onClick={() => handleEdgeToggle('top')}
              title="Top edge"
            />
            {/* Top-Right corner (disabled) */}
            <div className="h-6 w-6" />

            {/* Left edge */}
            <button
              className={cn(
                'h-6 w-6 rounded-l border border-surface transition-colors',
                selectedEdges.left && 'bg-primary'
              )}
              onClick={() => handleEdgeToggle('left')}
              title="Left edge"
            />
            {/* Center (preview) */}
            <div className="flex h-6 w-6 items-center justify-center rounded border border-surface bg-background">
              <div
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: borderColor,
                  borderStyle: borderStyle,
                  borderWidth: `${borderWidth}px`,
                }}
              />
            </div>
            {/* Right edge */}
            <button
              className={cn(
                'h-6 w-6 rounded-r border border-surface transition-colors',
                selectedEdges.right && 'bg-primary'
              )}
              onClick={() => handleEdgeToggle('right')}
              title="Right edge"
            />

            {/* Bottom-Left corner (disabled) */}
            <div className="h-6 w-6" />
            {/* Bottom edge */}
            <button
              className={cn(
                'h-6 w-6 rounded-b border border-surface transition-colors',
                selectedEdges.bottom && 'bg-primary'
              )}
              onClick={() => handleEdgeToggle('bottom')}
              title="Bottom edge"
            />
            {/* Bottom-Right corner (disabled) */}
            <div className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Edge Quick Actions */}
      <div className="border-control-row justify-end gap-2">
        <button
          onClick={handleSelectAllEdges}
          className="text-xs text-primary hover:underline"
        >
          Select All
        </button>
        <button
          onClick={handleClearEdges}
          className="text-xs text-text hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Border Preview */}
      <div className="border-control-row">
        <span className="border-control-label w-16">Preview:</span>
        <div
          className="h-10 w-full rounded border border-surface"
          style={{
            borderTopWidth: selectedEdges.top ? borderWidth : 1,
            borderTopStyle: selectedEdges.top ? borderStyle : 'solid',
            borderTopColor: selectedEdges.top ? borderColor : '#E2E7ED',
            borderBottomWidth: selectedEdges.bottom ? borderWidth : 1,
            borderBottomStyle: selectedEdges.bottom ? borderStyle : 'solid',
            borderBottomColor: selectedEdges.bottom ? borderColor : '#E2E7ED',
            borderLeftWidth: selectedEdges.left ? borderWidth : 1,
            borderLeftStyle: selectedEdges.left ? borderStyle : 'solid',
            borderLeftColor: selectedEdges.left ? borderColor : '#E2E7ED',
            borderRightWidth: selectedEdges.right ? borderWidth : 1,
            borderRightStyle: selectedEdges.right ? borderStyle : 'solid',
            borderRightColor: selectedEdges.right ? borderColor : '#E2E7ED',
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 border-t border-surface pt-2">
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-text hover:bg-surface"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleApply}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
