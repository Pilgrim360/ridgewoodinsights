'use client';

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { CategoryWithPostCount } from '@/types/admin';

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
      <div className="bg-white rounded-lg border border-surface">
        <div className="p-8">
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-surface rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-surface p-12 text-center">
        <p className="text-secondary font-medium">No categories yet</p>
        <p className="text-sm text-text/60 mt-1">
          Create your first category to organize posts
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-surface overflow-hidden">
      <table className="w-full">
        <thead className="bg-surface/50 border-b border-surface">
          <tr>
            <th className="text-left text-xs font-medium text-text/60 uppercase tracking-wide px-4 py-3">
              Name
            </th>
            <th className="text-left text-xs font-medium text-text/60 uppercase tracking-wide px-4 py-3 w-24">
              Posts
            </th>
            <th className="w-20" />
          </tr>
        </thead>
        <tbody className="divide-y divide-surface">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-surface/30">
              <td className="px-4 py-3">
                <p className="font-medium text-secondary">{category.name}</p>
                <p className="text-xs text-text/50">/{category.slug}</p>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-text/70">
                  {category.post_count}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(category)}
                    disabled={isDeletingId === category.id}
                    className="p-1.5 rounded hover:bg-surface text-text/60 hover:text-secondary disabled:opacity-40"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(category)}
                    disabled={isDeletingId === category.id}
                    className="p-1.5 rounded hover:bg-red-50 text-text/60 hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
