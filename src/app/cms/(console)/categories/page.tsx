'use client';

import { useState } from 'react';
import { CategoryData, CategoryWithPostCount } from '@/types/cms';
import { CmsPageHeader } from '@/components/cms/CmsPageHeader';
import { Plus } from 'lucide-react';
import { CategoriesTable } from '@/components/cms/Categories/CategoriesTable';
import { CategoryModal } from '@/components/cms/Categories/CategoryModal';
import { DeleteConfirmModal } from '@/components/cms/Categories/DeleteConfirmModal';
import { useCategoriesWithCount } from '@/hooks/queries/useCategoriesQueries';
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/queries/useCmsMutations';

export default function CategoriesPage() {
  const categoriesQuery = useCategoriesWithCount();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const categories = categoriesQuery.data ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithPostCount | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | undefined>();

  const isLoading = categoriesQuery.isLoading;

  const handleNewCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: CategoryWithPostCount) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (category: CategoryWithPostCount) => {
    setDeleteTarget(category);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;

    setIsDeletingId(deleteTarget.id);

    try {
      await deleteCategoryMutation.mutateAsync({
        id: deleteTarget.id,
        name: deleteTarget.name,
      });
    } catch {
      // Errors are surfaced via the global cms toast system.
    } finally {
      setDeleteTarget(null);
      setIsDeletingId(undefined);
    }
  };

  const handleSaveCategory = async (data: Omit<CategoryData, 'id' | 'created_at'>) => {
    try {
      if (editingCategory?.id) {
        await updateCategoryMutation.mutateAsync({ id: editingCategory.id, updates: data });
      } else {
        await createCategoryMutation.mutateAsync(data);
      }

      setIsModalOpen(false);
      setEditingCategory(null);
    } catch {
      // Keep the modal open; errors are surfaced via the global cms toast system.
    }
  };

  const existingSlugs = categories.map((c) => c.slug);

  return (
    <div className="space-y-6">
      <CmsPageHeader
        title="Categories"
        description="Organize posts by topic."
        actions={
          <button
            type="button"
            onClick={handleNewCategory}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        }
      />

      <CategoriesTable
        categories={categories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        isDeletingId={isDeletingId}
        isLoading={isLoading}
      />

      <CategoryModal
        isOpen={isModalOpen}
        category={editingCategory}
        existingSlugs={existingSlugs}
        onSave={handleSaveCategory}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
      />

      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        category={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
