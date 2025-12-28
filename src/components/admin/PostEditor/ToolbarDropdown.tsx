'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolbarButton } from './ToolbarButton';

export interface ToolbarDropdownItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface ToolbarDropdownProps {
  title: string;
  'aria-label': string;
  icon: ReactNode;
  items: ToolbarDropdownItem[];
  disabled?: boolean;
}

export function ToolbarDropdown({
  title,
  'aria-label': ariaLabel,
  icon,
  items,
  disabled,
}: ToolbarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item: ToolbarDropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <ToolbarButton
        title={title}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="gap-1"
      >
        {icon}
        <ChevronDown className="h-3 w-3" />
      </ToolbarButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[180px] rounded-lg border border-surface bg-white py-1 shadow-lg">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-sm text-left',
                'transition-colors',
                item.disabled
                  ? 'text-text/40 cursor-not-allowed'
                  : 'text-secondary hover:bg-primary/5'
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
