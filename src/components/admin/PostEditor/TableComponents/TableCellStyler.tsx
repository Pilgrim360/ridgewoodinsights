'use client';

import { useState, useCallback } from 'react';
import { type Editor } from '@tiptap/react';
import {
  BACKGROUND_COLOR_PRESETS,
  TEXT_COLOR_PRESETS,
  RIDGEWOOD_PALETTE,
} from '@/lib/tiptap/styles/tableThemes';
import { TableBorderControl } from './TableBorderControl';

interface TableCellStylerProps {
  editor: Editor;
  onClose?: () => void;
  className?: string;
}

type TabType = 'fill' | 'text' | 'borders';

export function TableCellStyler({ editor, onClose, className }: TableCellStylerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('fill');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [borderControlOpen, setBorderControlOpen] = useState(false);

  // History for undo
  const [history, setHistory] = useState<Array<{
    backgroundColor: string;
    textColor: string;
  }>>([]);

  const handleBackgroundSelect = useCallback((color: string) => {
    setBackgroundColor(color);
    if (color) {
      editor.commands.setCellBackground(color);
    }
  }, [editor]);

  const handleTextColorSelect = useCallback((color: string) => {
    setTextColor(color);
    if (color) {
      editor.commands.setCellTextColor(color);
    }
  }, [editor]);

  const handleBorderApply = useCallback((
    color: string,
    width: number,
    style: string,
    edges: { top: boolean; bottom: boolean; left: boolean; right: boolean }
  ) => {
    // Apply borders based on selected edges
    if (edges.top) {
      editor.commands.setCellBorderTop(color, width, style as 'solid' | 'dashed' | 'dotted');
    }
    if (edges.bottom) {
      editor.commands.setCellBorderBottom(color, width, style as 'solid' | 'dashed' | 'dotted');
    }
    if (edges.left) {
      editor.commands.setCellBorderLeft(color, width, style as 'solid' | 'dashed' | 'dotted');
    }
    if (edges.right) {
      editor.commands.setCellBorderRight(color, width, style as 'solid' | 'dashed' | 'dotted');
    }
  }, [editor]);

  const handleClearBackground = useCallback(() => {
    setBackgroundColor('');
    editor.commands.setCellBackground('');
  }, [editor]);

  const handleClearTextColor = useCallback(() => {
    setTextColor('');
    editor.commands.setCellTextColor('');
  }, [editor]);

  const handleClearBorders = useCallback(() => {
    editor.commands.clearCellBorders();
  }, [editor]);

  const handleUndo = useCallback(() => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setBackgroundColor(previous.backgroundColor);
      setTextColor(previous.textColor);
      setHistory((prev) => prev.slice(0, -1));
    }
  }, [history]);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'fill',
      label: 'Fill',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'text',
      label: 'Text',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="A a" />
          <text x="4" y="18" fontSize="14" fill="currentColor" stroke="none">
            Aa
          </text>
        </svg>
      ),
    },
    {
      id: 'borders',
      label: 'Borders',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="1"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className={`rounded-lg border border-surface bg-white shadow-lg ${className || ''}`}>
      {/* Tabs */}
      <div className="flex border-b border-surface">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-text hover:text-secondary'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Fill Tab */}
        {activeTab === 'fill' && (
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-text">Background Color</label>
                {backgroundColor && (
                  <button
                    onClick={handleClearBackground}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="color-picker-panel">
                <button
                  className={`color-swatch color-swatch-transparent ${!backgroundColor && 'active'}`}
                  onClick={handleClearBackground}
                  title="No fill"
                />
                {BACKGROUND_COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    className={`color-swatch ${backgroundColor === color && 'active'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleBackgroundSelect(color)}
                    title={color}
                  />
                ))}
                <input
                  type="color"
                  value={backgroundColor || '#ffffff'}
                  onChange={(e) => handleBackgroundSelect(e.target.value)}
                  className="h-6 w-6 cursor-pointer rounded border border-surface"
                  title="Custom color"
                />
              </div>
            </div>

            {/* Cell Padding */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text">Cell Padding</label>
              <div className="cell-padding-controls">
                <button className="cell-padding-btn">Compact</button>
                <button className="cell-padding-btn active">Normal</button>
                <button className="cell-padding-btn">Generous</button>
              </div>
            </div>
          </div>
        )}

        {/* Text Tab */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-text">Text Color</label>
                {textColor && (
                  <button
                    onClick={handleClearTextColor}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="color-picker-panel">
                <button
                  className={`color-swatch ${!textColor && 'active'}`}
                  style={{ backgroundColor: RIDGEWOOD_PALETTE.text }}
                  onClick={handleClearTextColor}
                  title="Default"
                />
                {TEXT_COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    className={`color-swatch ${textColor === color && 'active'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleTextColorSelect(color)}
                    title={color}
                  />
                ))}
                <input
                  type="color"
                  value={textColor || RIDGEWOOD_PALETTE.text}
                  onChange={(e) => handleTextColorSelect(e.target.value)}
                  className="h-6 w-6 cursor-pointer rounded border border-surface"
                  title="Custom color"
                />
              </div>
            </div>
          </div>
        )}

        {/* Borders Tab */}
        {activeTab === 'borders' && (
          <div className="space-y-4">
            {!borderControlOpen ? (
              <>
                <button
                  onClick={() => setBorderControlOpen(true)}
                  className="w-full rounded-md border border-surface py-2 text-sm text-text hover:bg-surface"
                >
                  Open Border Editor...
                </button>
                <button
                  onClick={handleClearBorders}
                  className="w-full rounded-md border border-surface py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Clear All Borders
                </button>
              </>
            ) : (
              <TableBorderControl
                onApply={handleBorderApply}
                onClose={() => setBorderControlOpen(false)}
              />
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-surface px-4 py-3">
        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          className="flex items-center gap-1 text-sm text-text hover:text-primary disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          Undo
        </button>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm text-text hover:bg-surface"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
