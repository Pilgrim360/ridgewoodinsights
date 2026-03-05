'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CategoryData, CategoryWithPostCount } from '@/types/admin';
import { CategoriesTable } from '@/components/admin/Categories/CategoriesTable';
import { CategoryModal } from '@/components/admin/Categories/CategoryModal';
import { DeleteConfirmModal } from '@/components/admin/Categories/DeleteConfirmModal';
import { useCategoriesWithCount } from '@/hooks/queries/useCategoriesQueries';
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/queries/useAdminMutations';

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
      // Error handled by toast
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
      // Keep modal open
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-secondary">Categories</h1>
        <button
          onClick={handleNewCategory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      <CategoriesTable
        categories={categories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        isDeletingId={isDeletingId}
        isLoading={categoriesQuery.isLoading}
      />

      <CategoryModal
        isOpen={isModalOpen}
        category={editingCategory}
        existingSlugs={categories.map((c) => c.slug)}
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
