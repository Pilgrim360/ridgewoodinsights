'use client';

import React from 'react';
import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  title?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ onMenuToggle, title, actions }: AdminHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-surface flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 rounded-lg text-secondary hover:bg-surface"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-secondary">{title}</h1>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}
