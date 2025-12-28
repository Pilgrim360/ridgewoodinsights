'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolbarButton } from './ToolbarButton';

export interface ColorPickerProps {
  title: string;
  'aria-label': string;
  value?: string | null;
  presets: string[];
  onChange: (color: string | null) => void;
  disabled?: boolean;
  allowCustom?: boolean;
}

export function ColorPicker({
  title,
  'aria-label': ariaLabel,
  value,
  presets,
  onChange,
  disabled,
  allowCustom = true,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePresetClick = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customColor) {
      onChange(customColor);
      setCustomColor('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <ToolbarButton
        title={title}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        isActive={!!value}
      >
        <Palette className="h-4 w-4" />
        {value && (
          <span
            className="absolute bottom-1 right-1 h-2 w-2 rounded-sm border border-white"
            style={{ backgroundColor: value }}
          />
        )}
      </ToolbarButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[200px] rounded-lg border border-surface bg-white p-3 shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-secondary">Colors</span>
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 text-xs text-text hover:text-secondary"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {presets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handlePresetClick(color)}
                  className={cn(
                    'h-8 w-8 rounded border-2 transition-all hover:scale-110',
                    value === color ? 'border-primary ring-2 ring-primary/20' : 'border-surface'
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>

            {allowCustom && (
              <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-surface">
                <label className="block">
                  <span className="text-xs font-medium text-secondary">Custom</span>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1 px-2 py-1 text-xs border border-surface rounded focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button
                      type="submit"
                      disabled={!customColor}
                      className="px-3 py-1 text-xs font-medium text-white bg-primary rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </label>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
