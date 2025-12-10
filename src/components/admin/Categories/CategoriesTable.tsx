'use client';

import { CategoryWithPostCount } from '@/types/admin';
import { CategoryRow } from './CategoryRow';

interface CategoriesTableProps {
  categories: CategoryWithPostCount[];
  onEdit: (category: CategoryWithPostCount) => void;
  onDelete: (category: CategoryWithPostCount) => void;
  isDeletingId?: string;
  isLoading?: boolean;
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
  isDeletingId,
  isLoading,
}: CategoriesTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
        <p className="text-text/60 text-sm">Loading categories...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-surface">
        <p className="text-secondary font-medium">No categories yet</p>
        <p className="text-text/60 text-sm mt-1">Create your first category to organize posts</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-surface">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface bg-background">
            <th className="text-left px-6 py-3 font-semibold text-secondary">
              Name
            </th>
            <th className="text-center px-6 py-3 font-semibold text-secondary">
              Posts
            </th>
            <th className="text-right px-6 py-3 font-semibold text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeletingId === category.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
