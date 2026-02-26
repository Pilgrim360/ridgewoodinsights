'use client';

import { Tag } from 'lucide-react';
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
      <div className="rounded-xl border border-surface bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface bg-background">
              {['Name', 'Posts', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-text/50 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, i) => (
              <tr key={i} className="border-b border-surface animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-4 bg-surface rounded w-32 mb-1" />
                  <div className="h-3 bg-surface rounded w-20" />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="h-4 bg-surface rounded w-8 mx-auto" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-surface rounded w-20 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-surface bg-white flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mb-4">
          <Tag className="w-6 h-6 text-text/40" />
        </div>
        <p className="font-medium text-secondary mb-1">No categories yet</p>
        <p className="text-sm text-text/60">Create your first category to organize posts.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-surface bg-white overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface bg-background">
            <th className="text-left px-6 py-3 text-xs font-semibold text-text/50 uppercase tracking-wide">
              Name
            </th>
            <th className="text-center px-6 py-3 text-xs font-semibold text-text/50 uppercase tracking-wide">
              Posts
            </th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-text/50 uppercase tracking-wide">
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
