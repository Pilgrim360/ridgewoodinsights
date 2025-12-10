'use client';

import { CategoryWithPostCount } from '@/types/admin';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  category: CategoryWithPostCount | null;
  isLoading?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  category,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-secondary">Delete Category?</h2>
          <p className="text-sm text-text/60 mt-2">
            Are you sure you want to delete "<strong>{category.name}</strong>"?
          </p>
        </div>

        {category.post_count > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-900">
              ⚠️ This category has <strong>{category.post_count} post{category.post_count !== 1 ? 's' : ''}</strong>. Deleting it will not affect the posts, but they will lose this category assignment.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-surface text-secondary hover:bg-surface transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
