'use client';

import { useEffect, useState } from 'react';
import { useAdminError } from '@/contexts/AdminErrorContext';
import {
  getCategoriesWithCount,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/admin/categories';
import { CategoryWithPostCount, CategoryData } from '@/types/admin';
import { CategoriesHeader } from '@/components/admin/Categories/CategoriesHeader';
import { CategoriesTable } from '@/components/admin/Categories/CategoriesTable';
import { CategoryModal } from '@/components/admin/Categories/CategoryModal';
import { DeleteConfirmModal } from '@/components/admin/Categories/DeleteConfirmModal';

export default function CategoriesPage() {
  const { showError, showSuccess } = useAdminError();
  const [categories, setCategories] = useState<CategoryWithPostCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithPostCount | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        const data = await getCategoriesWithCount();
        setCategories(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load categories';
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, [showError]);

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
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showSuccess(`Category "${deleteTarget.name}" deleted successfully`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete category';
      showError(errorMessage);
    } finally {
      setDeleteTarget(null);
      setIsDeletingId(null);
    }
  };

  const handleSaveCategory = async (
    data: Omit<CategoryData, 'id' | 'created_at'>
  ) => {
    try {
      if (editingCategory?.id) {
        // Update existing
        const updated = await updateCategory(editingCategory.id, data);
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? { ...c, ...updated, post_count: c.post_count }
              : c
          )
        );
        showSuccess(`Category "${data.name}" updated successfully`);
      } else {
        // Create new
        const created = await createCategory(data);
        const newCat: CategoryWithPostCount = {
          ...created,
          post_count: 0,
        };
        setCategories((prev) => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)));
        showSuccess(`Category "${data.name}" created successfully`);
      }

      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save category';
      showError(errorMessage);
    }
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
