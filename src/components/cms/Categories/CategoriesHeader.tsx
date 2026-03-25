'use client';

import { Plus } from 'lucide-react';

interface CategoriesHeaderProps {
  onNewCategory: () => void;
  isLoading?: boolean;
}

export function CategoriesHeader({ onNewCategory, isLoading }: CategoriesHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Categories</h1>
        <p className="text-sm text-text/60 mt-0.5">Organize posts by topic.</p>
      </div>
      <button
        type="button"
        onClick={onNewCategory}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Plus className="w-4 h-4" />
        New Category
      </button>
    </div>
  );
}
