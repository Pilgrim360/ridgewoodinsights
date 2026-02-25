'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { CategoryWithPostCount } from '@/types/admin';
import { cn } from '@/lib/utils';

interface CategoryRowProps {
  category: CategoryWithPostCount;
  onEdit: (category: CategoryWithPostCount) => void;
  onDelete: (category: CategoryWithPostCount) => void;
  isDeleting?: boolean;
}

export function CategoryRow({ category, onEdit, onDelete, isDeleting }: CategoryRowProps) {
  return (
    <tr className="border-b border-surface hover:bg-background/50 transition-colors last:border-0">
      <td className="px-6 py-4">
        <p className="font-medium text-secondary">{category.name}</p>
        <p className="text-xs text-text/50 mt-0.5">{category.slug}</p>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-semibold bg-surface text-secondary">
          {category.post_count}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(category)}
            disabled={isDeleting}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              'text-secondary hover:bg-surface',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            disabled={isDeleting}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              'text-red-600 hover:bg-red-50',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            {isDeleting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  );
}
