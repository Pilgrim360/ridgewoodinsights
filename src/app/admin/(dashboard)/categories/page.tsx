'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, MutationFunction } from '@tanstack/react-query';
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

type CategorySaveData = Omit<CategoryData, 'id' | 'created_at'>;

export default function CategoriesPage() {
  const { showError, showSuccess } = useAdminError();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithPostCount | null>(null);

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery<CategoryWithPostCount[], Error>({
    queryKey: ['categories'],
    queryFn: getCategoriesWithCount,
  });

  useEffect(() => {
    if (isError && error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
      showError(errorMessage);
    }
  }, [isError, error, showError]);

  const useApiMutation = <TData, TVariables>(
    mutationFn: MutationFunction<TData, TVariables>,
    queryKey: string[],
    successMessage: (data: TData) => string,
    errorMessage: string
  ) => {
    return useMutation<TData, Error, TVariables>({
      mutationFn,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey });
        showSuccess(successMessage(data));
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : errorMessage;
        showError(message);
      },
    });
  };

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: (_, deletedId) => {
      const deletedCategory = categories.find((c) => c.id === deletedId);
      showSuccess(`Category "${deletedCategory?.name}" deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
      showError(errorMessage);
    },
    onSettled: () => {
      setDeleteTarget(null);
    },
  });

  const createMutation = useApiMutation<CategoryData, CategorySaveData>(
    createCategory,
    ['categories'],
    (data) => `Category "${data.name}" created successfully`,
    'Failed to create category'
  );

  const updateMutation = useApiMutation<
    CategoryData,
    { id: string; category: CategorySaveData }
  >(
    (vars) => updateCategory(vars.id, vars.category),
    ['categories'],
    (data) => `Category "${data.name}" updated successfully`,
    'Failed to update category'
  );

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

  const handleConfirmDelete = () => {
    if (deleteTarget?.id) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  const handleSaveCategory = async (data: CategorySaveData) => {
    try {
      if (editingCategory?.id) {
        await updateMutation.mutateAsync({ id: editingCategory.id, category: data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (e) {
      // Errors are handled by the mutation's onError callback
    }
  };

  const existingSlugs = categories.map((c: CategoryWithPostCount) => c.slug);

  return (
    <div className="space-y-6">
      <CategoriesHeader onNewCategory={handleNewCategory} isLoading={isLoading} />

      <CategoriesTable
        categories={categories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        isDeletingId={deleteMutation.isPending ? (deleteMutation.variables as string) : undefined}
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
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        category={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
