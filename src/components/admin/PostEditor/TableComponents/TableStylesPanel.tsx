'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Editor, type Editor as EditorType } from '@tiptap/react';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  TABLE_THEMES,
  getThemeById,
  type TableTheme,
} from '@/lib/tiptap/styles/tableThemes';

interface TableStylesPanelProps {
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
  onClose: () => void;
  className?: string;
}

// Theme preview component
function ThemePreview({ theme }: { theme: TableTheme }) {
  const config = theme.config;

  return (
    <div
      className="table-theme-preview"
      style={{
        backgroundColor: config.rowBgAlternate || '#fff',
      }}
    >
      <table className="table-theme-preview-table">
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: config.headerBg,
                color: config.headerText,
                borderColor: config.borderColor,
              }}
            >
              H1
            </th>
            <th
              style={{
                backgroundColor: config.headerBg,
                color: config.headerText,
                borderColor: config.borderColor,
              }}
            >
              H2
            </th>
            <th
              style={{
                backgroundColor: config.headerBg,
                color: config.headerText,
                borderColor: config.borderColor,
              }}
            >
              H3
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: config.rowBg || '#fff',
                borderColor: config.borderColor,
              }}
            >
              A
            </td>
            <td
              style={{
                backgroundColor: config.rowBgAlternate || '#fff',
                borderColor: config.borderColor,
              }}
            >
              B
            </td>
            <td
              style={{
                backgroundColor: config.rowBg || '#fff',
                borderColor: config.borderColor,
              }}
            >
              C
            </td>
          </tr>
          <tr>
            <td
              style={{
                backgroundColor: config.rowBgAlternate || '#fff',
                borderColor: config.borderColor,
              }}
            >
              D
            </td>
            <td
              style={{
                backgroundColor: config.rowBg || '#fff',
                borderColor: config.borderColor,
              }}
            >
              E
            </td>
            <td
              style={{
                backgroundColor: config.rowBgAlternate || '#fff',
                borderColor: config.borderColor,
              }}
            >
              F
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function TableStylesPanel({
  currentTheme,
  onSelectTheme,
  onClose,
  className,
}: TableStylesPanelProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [customizeMode, setCustomizeMode] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleThemeSelect = useCallback(
    (themeId: string) => {
      setSelectedTheme(themeId);
    },
    []
  );

  const handleApplyTheme = useCallback(() => {
    onSelectTheme(selectedTheme);
  }, [onSelectTheme, selectedTheme]);

  const handleCustomize = useCallback(() => {
    setCustomizeMode(true);
  }, []);

  return (
    <div
      ref={panelRef}
      className={cn(
        'absolute left-0 top-full z-50 mt-2 w-80 rounded-lg border border-surface bg-white shadow-lg',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface px-4 py-3">
        <h3 className="font-medium text-secondary">Table Theme</h3>
        <button
          onClick={onClose}
          className="rounded p-1 text-text hover:bg-surface"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Theme Grid */}
      <div className="table-theme-grid">
        {TABLE_THEMES.map((theme) => (
          <button
            key={theme.id}
            className={cn(
              'table-theme-item',
              selectedTheme === theme.id && 'active'
            )}
            onClick={() => handleThemeSelect(theme.id)}
          >
            <ThemePreview theme={theme} />
            <span className="table-theme-name">{theme.name}</span>
            {selectedTheme === theme.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Current Theme Info */}
      {selectedTheme && (
        <div className="border-t border-surface bg-background px-4 py-3">
          <p className="text-xs text-text">
            <span className="font-medium">Selected:</span>{' '}
            {getThemeById(selectedTheme)?.name}
          </p>
          <p className="text-xs text-text opacity-70">
            {getThemeById(selectedTheme)?.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-surface p-3">
        <button
          onClick={handleApplyTheme}
          className="flex-1 rounded-md bg-primary py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Apply Theme
        </button>
      </div>
    </div>
  );
}
