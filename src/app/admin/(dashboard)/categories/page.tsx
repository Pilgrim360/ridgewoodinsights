'use client';

import { useState } from 'react';
import { CategoryData, CategoryWithPostCount } from '@/types/admin';
import { CategoriesHeader } from '@/components/admin/Categories/CategoriesHeader';
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

  const isLoading = categoriesQuery.isLoading || categoriesQuery.isFetching;

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
    } finally {
      setDeleteTarget(null);
      setIsDeletingId(undefined);
    }
  };

  const handleSaveCategory = async (data: Omit<CategoryData, 'id' | 'created_at'>) => {
    if (editingCategory?.id) {
      await updateCategoryMutation.mutateAsync({ id: editingCategory.id, updates: data });
    } else {
      await createCategoryMutation.mutateAsync(data);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const existingSlugs = categories.map((c) => c.slug);

  return (
    <div className="space-y-6">
      <CategoriesHeader onNewCategory={handleNewCategory} isLoading={isLoading} />

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
