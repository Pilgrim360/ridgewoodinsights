'use client';

import { CategoryWithPostCount } from '@/types/admin';
import { cn } from '@/lib/utils';

interface CategoryRowProps {
  category: CategoryWithPostCount;
  onEdit: (category: CategoryWithPostCount) => void;
  onDelete: (category: CategoryWithPostCount) => void;
  isDeleting?: boolean;
}

export function CategoryRow({
  category,
  onEdit,
  onDelete,
  isDeleting,
}: CategoryRowProps) {
  return (
    <tr className="border-b border-surface hover:bg-background transition-colors">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-secondary">{category.name}</p>
          <p className="text-sm text-text/60">{category.slug}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-text text-center">
        {category.post_count}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(category)}
            disabled={isDeleting}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded transition-colors',
              isDeleting
                ? 'text-text/30 cursor-not-allowed'
                : 'text-primary hover:bg-primary/10'
            )}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            disabled={isDeleting}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded transition-colors',
              isDeleting
                ? 'text-red-400 cursor-not-allowed'
                : 'text-red-600 hover:bg-red-50'
            )}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  );
}
